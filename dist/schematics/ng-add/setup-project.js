"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const add_ngm_module_1 = require("./steps/add-ngm-module");
/**
 * Sets up a project with all required to run ng-bootstrap.
 * This is run after 'package.json' was patched and all dependencies installed
 */
function ngAddSetupProject(options) {
    return (0, schematics_1.chain)([
        (0, add_ngm_module_1.addNgMentionsModuleToAppModule)(options),
        (0, schematics_1.externalSchematic)('@angular/localize', 'ng-add', options.project ? { name: options.project } : {}),
    ]);
}
exports.default = ngAddSetupProject;
//# sourceMappingURL=setup-project.js.map