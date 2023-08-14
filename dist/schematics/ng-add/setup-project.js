'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var ts = require('@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript');
var utility = require('@schematics/angular/utility');
var astUtils = require('@schematics/angular/utility/ast-utils');
var change = require('@schematics/angular/utility/change');
var ngAstUtils = require('@schematics/angular/utility/ng-ast-utils');
require('@angular-devkit/core');
var messages = require('../messages-8aa861df.js');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var ts__namespace = /*#__PURE__*/_interopNamespaceDefault(ts);

/**
 * Resolves options for the build target of the given project
 */
function getProjectTargetOptions(project, buildTarget) {
    const buildTargetObject = project.targets.get(buildTarget);
    if (buildTargetObject && buildTargetObject.options) {
        return buildTargetObject.options;
    }
    throw new schematics.SchematicsException(`Cannot determine project target configuration for: ${buildTarget}.`);
}

const NG_MENTIONS_MODULE_NAME = 'NgMentionsModule';
const NG_MENTIONS_PACKAGE_NAME = '@nth-cloud/ng-mentions';
/**
 * Patches main application module by adding 'NgMentionsModule' import
 *
 * Relevant 'angular.json' structure is:
 *
 * {
 *   "projects" : {
 *     "projectName": {
 *       "architect": {
 *         "build": {
 *           "options": {
 *            "main": "src/main.ts"
 *           }
 *         }
 *       }
 *     }
 *   },
 *   "defaultProject": "projectName"
 * }
 *
 */
function addNgMentionsModuleToAppModule(options) {
    return async (host) => {
        const workspace = await utility.readWorkspace(host);
        const projectName = options.project || workspace.extensions.defaultProject;
        // 1. get project by name
        const project = workspace.projects.get(projectName);
        if (!project) {
            throw new schematics.SchematicsException(messages.noProject(projectName));
        }
        // 2. get main file for project
        const projectBuildOptions = getProjectTargetOptions(project, 'build');
        const mainFilePath = projectBuildOptions.main;
        if (!mainFilePath || !host.read(mainFilePath)) {
            throw new schematics.SchematicsException(messages.noMainFile(projectName));
        }
        // 3. get main app module file
        const appModuleFilePath = ngAstUtils.getAppModulePath(host, mainFilePath);
        const appModuleFileText = host.read(appModuleFilePath);
        if (appModuleFileText === null) {
            throw new schematics.SchematicsException(messages.noModuleFile(appModuleFilePath));
        }
        // 4. adding 'NgMentionsModule' to the app module
        const appModuleSource = ts__namespace.createSourceFile(appModuleFilePath, appModuleFileText.toString('utf-8'), ts__namespace.ScriptTarget.Latest, true);
        const changes = astUtils.addImportToModule(appModuleSource, appModuleFilePath, NG_MENTIONS_MODULE_NAME, NG_MENTIONS_PACKAGE_NAME);
        const recorder = host.beginUpdate(appModuleFilePath);
        for (const change$1 of changes) {
            if (change$1 instanceof change.InsertChange) {
                recorder.insertLeft(change$1.pos, change$1.toAdd);
            }
        }
        host.commitUpdate(recorder);
    };
}

/**
 * Sets up a project with all required to run ng-mentions.
 * This is run after 'package.json' was patched and all dependencies installed
 */
function ngAddSetupProject(options) {
    return schematics.chain([
        addNgMentionsModuleToAppModule(options),
        schematics.externalSchematic('@angular/localize', 'ng-add', options.project ? { name: options.project } : {}),
    ]);
}

exports.default = ngAddSetupProject;
