import { ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Key } from './util/key';
import { NgMentionsListComponent } from './util/mentions-list.component';
import { applyChangeToValue, escapeRegExp, findStartOfMentionInPlainText, getBoundsOfMentionAtPosition, getCaretPosition, isMobileOrTablet, mapPlainTextIndex, markupToRegExp, replacePlaceholders, setCaretPosition, styleProperties } from './util/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./util/highlight.directive";
import * as i3 from "@angular/forms";
// eslint-disable-next-line no-shadow
var InputToKeyboard;
(function (InputToKeyboard) {
    InputToKeyboard[InputToKeyboard["deleteContentBackward"] = 8] = "deleteContentBackward";
    InputToKeyboard[InputToKeyboard["insertLineBreak"] = 13] = "insertLineBreak";
})(InputToKeyboard || (InputToKeyboard = {}));
/**
 * The Mentions Component
 */
export class NgMentionsComponent {
    constructor(element, componentResolver, viewContainer, changeDetector, ngZone) {
        this.element = element;
        this.componentResolver = componentResolver;
        this.viewContainer = viewContainer;
        this.changeDetector = changeDetector;
        this.ngZone = ngZone;
        /**
         * The character to trigger the mentions list when a user is typing in the input field
         */
        this.triggerChar = '@';
        /**
         * The markup used to format a mention in the model value
         */
        this.mentionMarkup = '@[__display__](__type__:__id__)';
        /**
         * Optional. When using a custom search (i.e. an API call), the internal searching capability should be disabled.
         */
        this.disableSearch = false;
        /**
         * Only used when internal search is not disabled. This limits the maximum number of items to display in the search
         * result list.
         */
        this.maxItems = -1;
        /**
         * Used to cause the search result list to display in a "drop up" fashion, instead of a typical dropdown.
         */
        this.dropUp = false;
        /**
         * If the supplied mentions are a list of objects, this is the name of the property used to display
         * the mention in the search result list and when formatting a mention in the displayed text.
         */
        this.displayName = 'display';
        /**
         * An event emitted, after the trigger character has been typed, with the user-entered search string.
         */
        this.search = new EventEmitter();
        this.valueChanges = new EventEmitter();
        this.stateChanges = new Subject();
        this.displayContent = '';
        this.lines = [];
        this.highlighterStyle = {};
        this.textAreaClassNames = {};
        this.mentions = [];
        this._value = '';
        this._rows = 1;
        this._columns = 20;
        this.stopSearch = false;
        this._destroyed = new Subject();
        this.newLine = /\n/g;
        this._errorState = false;
        this.mobile = isMobileOrTablet();
    }
    /**
     * Classes for textarea
     */
    get formClass() {
        return Object.keys(this.textAreaClassNames).join(' ');
    }
    set formClass(classNames) {
        this.textAreaClassNames = {};
        Array.from(classNames.split(' ')).forEach(className => {
            this.textAreaClassNames[className] = true;
        });
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this.parseLines(value);
    }
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value;
        this.refreshStyles();
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
        this.refreshStyles();
    }
    /**
     * Number of rows for the textarea. Defaults to 1
     */
    get rows() {
        return this._rows;
    }
    set rows(value) {
        if (value !== null && typeof value !== 'undefined') {
            if (typeof value === 'string') {
                value = parseInt(value, 10);
            }
            this._rows = Math.max(1, value);
            this.refreshStyles();
        }
    }
    /**
     * Number of columns for the textarea. Defaults to 1
     */
    get columns() {
        return this._columns;
    }
    set columns(value) {
        if (value !== null && typeof value !== 'undefined') {
            if (typeof value === 'string') {
                value = parseInt(value, 10);
            }
            this._columns = Math.max(1, value);
            this.refreshStyles();
        }
    }
    /**
     * The list of mentions to display, or filter, in the search result list.
     */
    set mentionItems(value) {
        this.mentions = value;
        if (this.disableSearch && this.mentionsList) {
            this.mentionsList.items = value;
        }
    }
    get readonly() {
        return this.disabled ? 'readonly' : null;
    }
    get errorState() {
        return this._errorState;
    }
    ngOnInit() {
        this.parseMarkup();
    }
    ngOnChanges(changes) {
        if ('markup' in changes) {
            this.parseMarkup();
        }
    }
    ngAfterViewInit() {
        this.addInputListener();
        this.parseLines(this._value);
        this.refreshStyles();
    }
    ngAfterViewChecked() {
        this.addInputListener();
        this.refreshStyles();
    }
    ngOnDestroy() {
        if (this._inputListener) {
            this.textAreaInputElement.nativeElement.removeEventListener(this.mobile ? 'input' : 'keydown', this._inputListener);
            this._inputListener = undefined;
        }
        this._destroyed.next();
        this._destroyed.complete();
    }
    onWindowResize() {
        this.refreshStyles();
    }
    onTextAreaScroll() {
        this.highlighterElement.nativeElement.scrollTop = this.textAreaInputElement.nativeElement.scrollTop;
    }
    open() {
        const event = {
            key: this.triggerChar,
            which: this.triggerChar.charCodeAt(0)
        };
        this.textAreaInputElement.nativeElement.focus();
        const caretPosition = getCaretPosition(this.textAreaInputElement.nativeElement);
        let selectionStart = this.textAreaInputElement.nativeElement.selectionStart;
        let selectionEnd = this.textAreaInputElement.nativeElement.selectionEnd;
        if (typeof selectionStart !== 'number' || typeof selectionEnd !== 'number') {
            selectionStart = caretPosition;
            selectionEnd = caretPosition;
        }
        const newCaretPosition = selectionStart + 1;
        const newValue = this.displayContent.substring(0, selectionStart) + this.triggerChar + this.displayContent.substring(selectionEnd);
        this.displayContent = newValue;
        this.onChange(newValue);
        setTimeout(() => {
            this.selectionStart = newCaretPosition;
            this.selectionEnd = newCaretPosition;
            setCaretPosition(this.textAreaInputElement.nativeElement, newCaretPosition);
            setTimeout(() => {
                this.textAreaInputElement.nativeElement.focus();
                this.onKeyDown(event);
            });
        });
    }
    onSelect(event) {
        this.selectionStart = event.target.selectionStart;
        this.selectionEnd = event.target.selectionEnd;
    }
    onChange(newPlainTextValue) {
        const value = this._value;
        const displayTransform = this.displayTransform.bind(this);
        let selectionStart = this.textAreaInputElement.nativeElement.selectionStart;
        let selectionEnd = this.textAreaInputElement.nativeElement.selectionEnd;
        const bounds = getBoundsOfMentionAtPosition(newPlainTextValue, this.markupSearch, selectionStart, displayTransform);
        if (bounds.start !== -1) {
            newPlainTextValue = newPlainTextValue.substring(0, bounds.start) + newPlainTextValue.substring(bounds.end);
        }
        const newValue = applyChangeToValue(value, this.markupSearch, newPlainTextValue, this.selectionStart, this.selectionEnd, selectionEnd, displayTransform);
        const startOfMention = findStartOfMentionInPlainText(value, this.markupSearch, selectionStart, displayTransform);
        if (startOfMention.start > -1 && this.selectionEnd > startOfMention.start) {
            selectionStart = startOfMention.start;
            selectionEnd = selectionStart;
        }
        this.selectionStart = Math.max(selectionStart, 0);
        this.selectionEnd = Math.max(selectionEnd, 0);
        this.parseLines(newValue);
        if (this.selectionEnd > 0) {
            setTimeout(() => setCaretPosition(this.textAreaInputElement.nativeElement, this.selectionEnd));
        }
    }
    onInput(event) {
        const character = (event.data || '');
        const keyCode = InputToKeyboard[event.inputType] || character.charCodeAt(0);
        if (keyCode === Key.Enter && this.mentionsList.show) {
            event.preventDefault();
        }
        this.handleInput({ which: keyCode }, keyCode, character);
    }
    onKeyDown(event) {
        let characterPressed = event.key;
        const keyCode = event.which || event.keyCode;
        if (!characterPressed) {
            const characterCode = event.which || event.keyCode;
            characterPressed = String.fromCharCode(characterCode);
            if (!event.shiftKey && (characterCode >= 65 && characterCode <= 90)) {
                characterPressed = String.fromCharCode(characterCode + 32);
            }
        }
        this.handleInput(event, keyCode, characterPressed);
    }
    onBlur(event) {
        if (event instanceof FocusEvent && event.relatedTarget) {
            const element = event.relatedTarget;
            if (element.classList.contains('dropdown-item')) {
                return;
            }
        }
        this.stopEvent(event);
        if (this.mentionsList) {
            this.mentionsList.show = false;
        }
    }
    isPartMention(part) {
        return typeof part.contents !== 'undefined';
    }
    formatMention(mention) {
        return this._formatMention(mention.contents);
    }
    handleInput(event, keyCode, characterPressed) {
        let caretPosition = getCaretPosition(this.textAreaInputElement.nativeElement);
        if (keyCode === Key.Enter && event.wasSelection && caretPosition < this.startPos) {
            caretPosition = this.startNode.length;
            setCaretPosition(this.startNode, caretPosition);
        }
        const startOfMention = findStartOfMentionInPlainText(this._value, this.markupSearch, caretPosition, this.displayTransform.bind(this));
        if (characterPressed === this.triggerChar) {
            this.setupMentionsList(caretPosition);
        }
        else if (startOfMention.start === -1 && this.startPos >= 0) {
            if (caretPosition <= this.startPos) {
                this.mentionsList.show = false;
                this.startPos = -1;
            }
            else if (keyCode !== Key.Shift && !event.metaKey && !event.altKey && !event.ctrlKey &&
                caretPosition > this.startPos) {
                this.handleKeyDown(event, caretPosition, characterPressed);
            }
        }
        else {
            this.onSelect({ target: this.textAreaInputElement.nativeElement });
        }
    }
    displayTransform(..._) {
        const replaceIndex = this.markupSearch.groups[this.displayName];
        return _[replaceIndex];
    }
    _formatMention(contents) {
        const replaceValue = `\$${this.displayName}`;
        let result = contents.replace(this.markupSearch.regEx, replaceValue);
        let replaceIndex;
        if (result === replaceValue) {
            replaceIndex = `\$${this.markupSearch.groups[this.displayName]}`;
            result = contents.replace(this.markupSearch.regEx, replaceIndex);
        }
        return result;
    }
    // noinspection JSMethodCanBeStatic
    stopEvent(event) {
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }
    setupMentionsList(caretPosition) {
        this.startPos = caretPosition;
        this.startNode = window.getSelection().anchorNode;
        this.searchString = '';
        this.stopSearch = false;
        this.showMentionsList();
        this.updateMentionsList();
    }
    handleKeyDown(event, caretPosition, characterPressed) {
        const keyCode = event.which || event.keyCode;
        if (keyCode === Key.Space) {
            this.startPos = -1;
        }
        else if (keyCode === Key.Backspace && caretPosition > 0) {
            caretPosition--;
            if (caretPosition === this.startPos) {
                this.stopSearch = true;
            }
            this.mentionsList.show = !this.stopSearch;
        }
        else if (this.mentionsList.show) {
            if (keyCode === Key.Tab || keyCode === Key.Enter) {
                this.stopEvent(event);
                this.mentionsList.show = false;
                let value = this._value;
                const start = mapPlainTextIndex(value, this.markupSearch, this.startPos, false, this.displayTransform.bind(this));
                const item = event.item || this.mentionsList.selectedItem;
                const newValue = replacePlaceholders(item, this.markupSearch);
                const newDisplayValue = this._formatMention(newValue);
                caretPosition = this.startPos + newDisplayValue.length;
                const searchString = this.searchString || '';
                value = value.substring(0, start) + newValue + value.substring(start + searchString.length + 1, value.length);
                this.parseLines(value);
                this.startPos = -1;
                this.searchString = '';
                this.stopSearch = true;
                this.mentionsList.show = false;
                this.changeDetector.detectChanges();
                setTimeout(() => {
                    setCaretPosition(this.textAreaInputElement.nativeElement, caretPosition);
                    this.onSelect({ target: this.textAreaInputElement.nativeElement });
                });
                return;
            }
            else if (keyCode === Key.Escape) {
                this.stopEvent(event);
                this.mentionsList.show = false;
                this.stopSearch = true;
                return;
            }
            else if (keyCode === Key.ArrowDown) {
                this.stopEvent(event);
                this.mentionsList.selectNextItem();
                return;
            }
            else if (keyCode === Key.ArrowUp) {
                this.stopEvent(event);
                this.mentionsList.selectPreviousItem();
                return;
            }
            else if (keyCode === Key.Home) {
                this.stopEvent(event);
                this.mentionsList.selectFirstItem();
                return;
            }
            else if (keyCode === Key.End) {
                this.stopEvent(event);
                this.mentionsList.selectLastItem();
                return;
            }
        }
        if (keyCode === Key.ArrowLeft || keyCode === Key.ArrowRight || keyCode === Key.Home || keyCode === Key.End) {
            this.onSelect(event);
            return;
        }
        let mention = this.displayContent.substring(this.startPos + 1, caretPosition);
        if (keyCode !== Key.Backspace) {
            mention += characterPressed;
        }
        this.searchString = mention || '';
        this.updateMentionsList();
    }
    getDisplayValue(item) {
        if (typeof item === 'string') {
            return item;
        }
        else if (item[this.displayName] !== undefined) {
            return item[this.displayName];
        }
        return null;
    }
    showMentionsList() {
        if (!this.mentionsList) {
            const componentFactory = this.componentResolver.resolveComponentFactory(NgMentionsListComponent);
            const componentRef = this.viewContainer.createComponent(componentFactory);
            this.mentionsList = componentRef.instance;
            this.mentionsList.itemTemplate = this.mentionListTemplate;
            this.mentionsList.displayTransform = this.displayTransform.bind(this);
            this.mentionsList.itemSelected.subscribe(item => {
                this.textAreaInputElement.nativeElement.focus();
                const fakeEvent = { which: Key.Enter, wasSelection: true, item };
                this.onKeyDown(fakeEvent);
            });
            this.mentionsList.displayTransform = this.getDisplayValue.bind(this);
        }
        this.mentionsList.textAreaElement = this.textAreaInputElement.nativeElement;
        this.mentionsList.show = true;
        this.mentionsList.dropUp = this.dropUp;
        this.mentionsList.activeIndex = 0;
        this.mentionsList.position();
        this.ngZone.run(() => this.mentionsList.resetScroll());
    }
    updateMentionsList() {
        if (!this.disableSearch) {
            let items = Array.from(this.mentions);
            if (this.searchString) {
                const searchString = this.searchString.toLowerCase();
                const searchRegEx = new RegExp(escapeRegExp(searchString), 'i');
                items = items.filter(item => {
                    const value = this.getDisplayValue(item);
                    return value !== null && searchRegEx.test(value);
                });
                if (this.maxItems > 0) {
                    items = items.slice(0, this.maxItems);
                }
            }
            this.mentionsList.items = items;
        }
        else {
            this.search.emit(this.searchString);
        }
    }
    parseMarkup() {
        if (this.mentionMarkup.length === 0 || this.mentionMarkup[0] !== this.triggerChar) {
            throw new Error(`ng-mentions markup pattern must start with the trigger character "${this.triggerChar}"`);
        }
        this.markupSearch = markupToRegExp(this.mentionMarkup);
    }
    parseLines(value = '') {
        if (value !== this._value) {
            value = value || '';
            const lines = value.split(this.newLine).map((line) => this.formatMentions(line));
            const displayContent = lines.map(line => line.content).join('\n');
            if (this.displayContent !== displayContent) {
                this.lines = lines;
                console.log(lines);
                this.displayContent = displayContent;
                this.triggerChange(value);
            }
        }
    }
    formatMentions(line) {
        const lineObj = { originalContent: line, content: line, parts: [] };
        if (line.length === 0) {
            return lineObj;
        }
        let mention;
        const tags = [];
        const regEx = this.markupSearch.regEx;
        regEx.lastIndex = 0;
        while ((mention = regEx.exec(line)) !== null) {
            tags.push({ indices: { start: mention.index, end: mention.index + mention[0].length } });
        }
        const prevTags = [];
        let content = '';
        [...tags].sort((tagA, tagB) => tagA.indices.start - tagB.indices.start).forEach((tag) => {
            const expectedLength = tag.indices.end - tag.indices.start;
            const contents = line.slice(tag.indices.start, tag.indices.end);
            if (contents.length === expectedLength) {
                const prevIndex = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
                const before = line.slice(prevIndex, tag.indices.start);
                const partMention = { contents, tag };
                lineObj.parts.push(before);
                lineObj.parts.push(partMention);
                prevTags.push(tag);
                content += before + this.formatMention(partMention);
            }
        });
        const remainingStart = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
        const remaining = line.slice(remainingStart);
        lineObj.parts.push(remaining);
        content += remaining;
        lineObj.content = content;
        return lineObj;
    }
    addInputListener() {
        if (!this._inputListener && this.textAreaInputElement) {
            this._inputListener = this.mobile ? (event) => this.onInput(event) : (event) => this.onKeyDown(event);
            this.textAreaInputElement.nativeElement.addEventListener(this.mobile ? 'input' : 'keydown', this._inputListener);
        }
    }
    refreshStyles() {
        if (!this.textAreaInputElement) {
            return;
        }
        const element = this.textAreaInputElement.nativeElement;
        const computedStyle = getComputedStyle(element);
        this.highlighterStyle = {};
        styleProperties.forEach(prop => {
            this.highlighterStyle[prop] = computedStyle[prop];
        });
        this.changeDetector.detectChanges();
    }
    triggerChange(value) {
        this._value = value;
        this.valueChanges.emit(this._value);
        this.changeDetector.detectChanges();
    }
}
NgMentionsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsComponent, deps: [{ token: i0.ElementRef }, { token: i0.ComponentFactoryResolver }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgMentionsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: NgMentionsComponent, selector: "ng-mentions", inputs: { triggerChar: "triggerChar", mentionMarkup: ["markup", "mentionMarkup"], disableSearch: "disableSearch", maxItems: "maxItems", dropUp: "dropUp", displayName: "displayName", placeholder: "placeholder", formClass: "formClass", value: "value", required: "required", disabled: "disabled", rows: "rows", columns: ["cols", "columns"], mentionItems: ["mentions", "mentionItems"] }, outputs: { search: "search", valueChanges: "valueChanges", stateChanges: "stateChanges" }, host: { listeners: { "window:resize": "onWindowResize()" } }, queries: [{ propertyName: "mentionListTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "textAreaInputElement", first: true, predicate: ["input"], descendants: true, static: true }, { propertyName: "highlighterElement", first: true, predicate: ["highlighter"], descendants: true, static: true }], exportAs: ["ngMentions"], usesOnChanges: true, ngImport: i0, template: `
      <div #highlighter class="highlighter" [ngClass]="textAreaClassNames" [attr.readonly]="readonly"
           [ngStyle]="highlighterStyle">
          <div *ngFor="let line of lines">
              <ng-container *ngFor="let part of line.parts">
                  <highlighted *ngIf="isPartMention(part)" [tag]="part.tag">{{formatMention(part)}}</highlighted>
                  <ng-container *ngIf="!isPartMention(part)">{{part}}</ng-container>
              </ng-container>
              <ng-container *ngIf="line.parts.length===0">&nbsp;</ng-container>
          </div>
      </div>
      <textarea
        #input
        [rows]="rows"
        [cols]="columns"
        [ngModel]="displayContent"
        [ngClass]="textAreaClassNames"
        (blur)="onBlur($event)"
        (select)="onSelect($event)"
        (mouseup)="onSelect($event)"
        (ngModelChange)="onChange($event)"
        (scroll)="onTextAreaScroll()"
        [disabled]="disabled"
        [required]="required"
        [placeholder]="placeholder"
      ></textarea>
  `, isInline: true, styles: ["ng-mentions{position:relative;display:inline-block}ng-mentions textarea{position:relative;background-color:transparent!important}ng-mentions .highlighter{position:absolute;top:0;left:0;right:0;bottom:0;color:transparent;overflow:hidden!important}ng-mentions highlighted{display:inline;border-radius:3px;padding:1px;margin:-1px;overflow-wrap:break-word;background-color:#add8e6}\n"], directives: [{ type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.HighlightedDirective, selector: "highlighted", inputs: ["tag"] }, { type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { type: i3.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'ngMentions', selector: 'ng-mentions', template: `
      <div #highlighter class="highlighter" [ngClass]="textAreaClassNames" [attr.readonly]="readonly"
           [ngStyle]="highlighterStyle">
          <div *ngFor="let line of lines">
              <ng-container *ngFor="let part of line.parts">
                  <highlighted *ngIf="isPartMention(part)" [tag]="part.tag">{{formatMention(part)}}</highlighted>
                  <ng-container *ngIf="!isPartMention(part)">{{part}}</ng-container>
              </ng-container>
              <ng-container *ngIf="line.parts.length===0">&nbsp;</ng-container>
          </div>
      </div>
      <textarea
        #input
        [rows]="rows"
        [cols]="columns"
        [ngModel]="displayContent"
        [ngClass]="textAreaClassNames"
        (blur)="onBlur($event)"
        (select)="onSelect($event)"
        (mouseup)="onSelect($event)"
        (ngModelChange)="onChange($event)"
        (scroll)="onTextAreaScroll()"
        [disabled]="disabled"
        [required]="required"
        [placeholder]="placeholder"
      ></textarea>
  `, preserveWhitespaces: false, encapsulation: ViewEncapsulation.None, styles: ["ng-mentions{position:relative;display:inline-block}ng-mentions textarea{position:relative;background-color:transparent!important}ng-mentions .highlighter{position:absolute;top:0;left:0;right:0;bottom:0;color:transparent;overflow:hidden!important}ng-mentions highlighted{display:inline;border-radius:3px;padding:1px;margin:-1px;overflow-wrap:break-word;background-color:#add8e6}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ComponentFactoryResolver }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { triggerChar: [{
                type: Input,
                args: ['triggerChar']
            }], mentionMarkup: [{
                type: Input,
                args: ['markup']
            }], disableSearch: [{
                type: Input,
                args: ['disableSearch']
            }], maxItems: [{
                type: Input,
                args: ['maxItems']
            }], dropUp: [{
                type: Input,
                args: ['dropUp']
            }], displayName: [{
                type: Input,
                args: ['displayName']
            }], placeholder: [{
                type: Input,
                args: ['placeholder']
            }], search: [{
                type: Output,
                args: ['search']
            }], valueChanges: [{
                type: Output,
                args: ['valueChanges']
            }], stateChanges: [{
                type: Output,
                args: ['stateChanges']
            }], mentionListTemplate: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }], textAreaInputElement: [{
                type: ViewChild,
                args: ['input', { static: true }]
            }], highlighterElement: [{
                type: ViewChild,
                args: ['highlighter', { static: true }]
            }], formClass: [{
                type: Input,
                args: ['formClass']
            }], value: [{
                type: Input,
                args: ['value']
            }], required: [{
                type: Input,
                args: ['required']
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }], rows: [{
                type: Input,
                args: ['rows']
            }], columns: [{
                type: Input,
                args: ['cols']
            }], mentionItems: [{
                type: Input,
                args: ['mentions']
            }], onWindowResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21lbnRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBSU4sTUFBTSxFQUVOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRzdCLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixZQUFZLEVBQ1osNkJBQTZCLEVBQzdCLDRCQUE0QixFQUM1QixnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFDbEMsaUJBQWlCLEVBRWpCLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDaEIsTUFBTSxjQUFjLENBQUM7Ozs7O0FBRXRCLHFDQUFxQztBQUNyQyxJQUFLLGVBR0o7QUFIRCxXQUFLLGVBQWU7SUFDbEIsdUZBQXVDLENBQUE7SUFDdkMsNEVBQTZCLENBQUE7QUFDL0IsQ0FBQyxFQUhJLGVBQWUsS0FBZixlQUFlLFFBR25CO0FBRUQ7O0dBRUc7QUFtQ0gsTUFBTSxPQUFPLG1CQUFtQjtJQW9LOUIsWUFDWSxPQUFtQixFQUFVLGlCQUEyQyxFQUN4RSxhQUErQixFQUFVLGNBQWlDLEVBQVUsTUFBYztRQURsRyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUEwQjtRQUN4RSxrQkFBYSxHQUFiLGFBQWEs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QUs7dUJBQUMsT0FBTztnQkFVVixRQUFRO3NCQURYLEtBQUs7dUJBQUMsVUFBVTtnQkFXYixRQUFRO3NCQURYLEtBQUs7dUJBQUMsVUFBVTtnQkFjYixJQUFJO3NCQURQLEtBQUs7dUJBQUMsTUFBTTtnQkFtQlQsT0FBTztzQkFEVixLQUFLO3VCQUFDLE1BQU07Z0JBbUJULFlBQVk7c0JBRGYsS0FBSzt1QkFBQyxVQUFVO2dCQXNEVixjQUFjO3NCQURwQixZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0xpbmUsIE1lbnRpb24sIFRhZ30gZnJvbSAnLi91dGlsL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4vdXRpbC9rZXknO1xuaW1wb3J0IHtOZ01lbnRpb25zTGlzdENvbXBvbmVudH0gZnJvbSAnLi91dGlsL21lbnRpb25zLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7XG4gIGFwcGx5Q2hhbmdlVG9WYWx1ZSxcbiAgZXNjYXBlUmVnRXhwLFxuICBmaW5kU3RhcnRPZk1lbnRpb25JblBsYWluVGV4dCxcbiAgZ2V0Qm91bmRzT2ZNZW50aW9uQXRQb3NpdGlvbixcbiAgZ2V0Q2FyZXRQb3NpdGlvbiwgaXNNb2JpbGVPclRhYmxldCxcbiAgbWFwUGxhaW5UZXh0SW5kZXgsXG4gIE1hcmt1cE1lbnRpb24sXG4gIG1hcmt1cFRvUmVnRXhwLFxuICByZXBsYWNlUGxhY2Vob2xkZXJzLFxuICBzZXRDYXJldFBvc2l0aW9uLFxuICBzdHlsZVByb3BlcnRpZXNcbn0gZnJvbSAnLi91dGlsL3V0aWxzJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZW51bSBJbnB1dFRvS2V5Ym9hcmQge1xuICAnZGVsZXRlQ29udGVudEJhY2t3YXJkJyA9IEtleS5CYWNrc3BhY2UsXG4gICdpbnNlcnRMaW5lQnJlYWsnID0gS2V5LkVudGVyXG59XG5cbi8qKlxuICogVGhlIE1lbnRpb25zIENvbXBvbmVudFxuICovXG5AQ29tcG9uZW50KHtcbiAgZXhwb3J0QXM6ICduZ01lbnRpb25zJyxcbiAgc2VsZWN0b3I6ICduZy1tZW50aW9ucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgICA8ZGl2ICNoaWdobGlnaHRlciBjbGFzcz1cImhpZ2hsaWdodGVyXCIgW25nQ2xhc3NdPVwidGV4dEFyZWFDbGFzc05hbWVzXCIgW2F0dHIucmVhZG9ubHldPVwicmVhZG9ubHlcIlxuICAgICAgICAgICBbbmdTdHlsZV09XCJoaWdobGlnaHRlclN0eWxlXCI+XG4gICAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgbGluZSBvZiBsaW5lc1wiPlxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBwYXJ0IG9mIGxpbmUucGFydHNcIj5cbiAgICAgICAgICAgICAgICAgIDxoaWdobGlnaHRlZCAqbmdJZj1cImlzUGFydE1lbnRpb24ocGFydClcIiBbdGFnXT1cInBhcnQudGFnXCI+e3tmb3JtYXRNZW50aW9uKHBhcnQpfX08L2hpZ2hsaWdodGVkPlxuICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpc1BhcnRNZW50aW9uKHBhcnQpXCI+e3twYXJ0fX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsaW5lLnBhcnRzLmxlbmd0aD09PTBcIj4mbmJzcDs8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHRleHRhcmVhXG4gICAgICAgICNpbnB1dFxuICAgICAgICBbcm93c109XCJyb3dzXCJcbiAgICAgICAgW2NvbHNdPVwiY29sdW1uc1wiXG4gICAgICAgIFtuZ01vZGVsXT1cImRpc3BsYXlDb250ZW50XCJcbiAgICAgICAgW25nQ2xhc3NdPVwidGV4dEFyZWFDbGFzc05hbWVzXCJcbiAgICAgICAgKGJsdXIpPVwib25CbHVyKCRldmVudClcIlxuICAgICAgICAoc2VsZWN0KT1cIm9uU2VsZWN0KCRldmVudClcIlxuICAgICAgICAobW91c2V1cCk9XCJvblNlbGVjdCgkZXZlbnQpXCJcbiAgICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIChzY3JvbGwpPVwib25UZXh0QXJlYVNjcm9sbCgpXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW3JlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgID48L3RleHRhcmVhPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9tZW50aW9ucy5zY3NzJ10sXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE5nTWVudGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFRoZSBjaGFyYWN0ZXIgdG8gdHJpZ2dlciB0aGUgbWVudGlvbnMgbGlzdCB3aGVuIGEgdXNlciBpcyB0eXBpbmcgaW4gdGhlIGlucHV0IGZpZWxkXG4gICAqL1xuICBASW5wdXQoJ3RyaWdnZXJDaGFyJykgdHJpZ2dlckNoYXIgPSAnQCc7XG4gIC8qKlxuICAgKiBUaGUgbWFya3VwIHVzZWQgdG8gZm9ybWF0IGEgbWVudGlvbiBpbiB0aGUgbW9kZWwgdmFsdWVcbiAgICovXG4gIEBJbnB1dCgnbWFya3VwJykgbWVudGlvbk1hcmt1cCA9ICdAW19fZGlzcGxheV9fXShfX3R5cGVfXzpfX2lkX18pJztcbiAgLyoqXG4gICAqIE9wdGlvbmFsLiBXaGVuIHVzaW5nIGEgY3VzdG9tIHNlYXJjaCAoaS5lLiBhbiBBUEkgY2FsbCksIHRoZSBpbnRlcm5hbCBzZWFyY2hpbmcgY2FwYWJpbGl0eSBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoJ2Rpc2FibGVTZWFyY2gnKSBkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG4gIC8qKlxuICAgKiBPbmx5IHVzZWQgd2hlbiBpbnRlcm5hbCBzZWFyY2ggaXMgbm90IGRpc2FibGVkLiBUaGlzIGxpbWl0cyB0aGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBpbiB0aGUgc2VhcmNoXG4gICAqIHJlc3VsdCBsaXN0LlxuICAgKi9cbiAgQElucHV0KCdtYXhJdGVtcycpIG1heEl0ZW1zID0gLTE7XG4gIC8qKlxuICAgKiBVc2VkIHRvIGNhdXNlIHRoZSBzZWFyY2ggcmVzdWx0IGxpc3QgdG8gZGlzcGxheSBpbiBhIFwiZHJvcCB1cFwiIGZhc2hpb24sIGluc3RlYWQgb2YgYSB0eXBpY2FsIGRyb3Bkb3duLlxuICAgKi9cbiAgQElucHV0KCdkcm9wVXAnKSBkcm9wVXAgPSBmYWxzZTtcbiAgLyoqXG4gICAqIElmIHRoZSBzdXBwbGllZCBtZW50aW9ucyBhcmUgYSBsaXN0IG9mIG9iamVjdHMsIHRoaXMgaXMgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHVzZWQgdG8gZGlzcGxheVxuICAgKiB0aGUgbWVudGlvbiBpbiB0aGUgc2VhcmNoIHJlc3VsdCBsaXN0IGFuZCB3aGVuIGZvcm1hdHRpbmcgYSBtZW50aW9uIGluIHRoZSBkaXNwbGF5ZWQgdGV4dC5cbiAgICovXG4gIEBJbnB1dCgnZGlzcGxheU5hbWUnKSBkaXNwbGF5TmFtZSA9ICdkaXNwbGF5JztcbiAgQElucHV0KCdwbGFjZWhvbGRlcicpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQsIGFmdGVyIHRoZSB0cmlnZ2VyIGNoYXJhY3RlciBoYXMgYmVlbiB0eXBlZCwgd2l0aCB0aGUgdXNlci1lbnRlcmVkIHNlYXJjaCBzdHJpbmcuXG4gICAqL1xuICBAT3V0cHV0KCdzZWFyY2gnKSByZWFkb25seSBzZWFyY2g6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoJ3ZhbHVlQ2hhbmdlcycpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlczogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgnc3RhdGVDaGFuZ2VzJykgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgbWVudGlvbkxpc3RUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7c3RhdGljOiB0cnVlfSkgdGV4dEFyZWFJbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2hpZ2hsaWdodGVyJywge3N0YXRpYzogdHJ1ZX0pIGhpZ2hsaWdodGVyRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBkaXNwbGF5Q29udGVudCA9ICcnO1xuICBsaW5lczogTGluZVtdID0gW107XG4gIGhpZ2hsaWdodGVyU3R5bGU6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gIHRleHRBcmVhQ2xhc3NOYW1lczoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIHNlbGVjdGlvblN0YXJ0OiBudW1iZXI7XG4gIHNlbGVjdGlvbkVuZDogbnVtYmVyO1xuICBtZW50aW9uczogYW55W10gPSBbXTtcblxuICBwcml2YXRlIF92YWx1ZSA9ICcnO1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX3Jvd3MgPSAxO1xuICBwcml2YXRlIF9jb2x1bW5zID0gMjA7XG4gIHByaXZhdGUgc2VhcmNoU3RyaW5nOiBzdHJpbmc7XG4gIHByaXZhdGUgc3RhcnRQb3M6IG51bWJlcjtcbiAgcHJpdmF0ZSBzdGFydE5vZGU7XG4gIG1lbnRpb25zTGlzdDogTmdNZW50aW9uc0xpc3RDb21wb25lbnQ7XG4gIHByaXZhdGUgc3RvcFNlYXJjaCA9IGZhbHNlO1xuICBwcml2YXRlIG1hcmt1cFNlYXJjaDogTWFya3VwTWVudGlvbjtcbiAgcHJpdmF0ZSBfZGVzdHJveWVkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBuZXdMaW5lID0gL1xcbi9nO1xuICBwcml2YXRlIF9lcnJvclN0YXRlID0gZmFsc2U7XG4gIHByaXZhdGUgX2lucHV0TGlzdGVuZXI6IGFueTtcbiAgcHJpdmF0ZSBtb2JpbGU6IGJvb2xlYW4gPSBpc01vYmlsZU9yVGFibGV0KCk7XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgZm9yIHRleHRhcmVhXG4gICAqL1xuICBASW5wdXQoJ2Zvcm1DbGFzcycpXG4gIGdldCBmb3JtQ2xhc3MoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy50ZXh0QXJlYUNsYXNzTmFtZXMpLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHNldCBmb3JtQ2xhc3MoY2xhc3NOYW1lczogc3RyaW5nKSB7XG4gICAgdGhpcy50ZXh0QXJlYUNsYXNzTmFtZXMgPSB7fTtcbiAgICBBcnJheS5mcm9tKGNsYXNzTmFtZXMuc3BsaXQoJyAnKSkuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgdGhpcy50ZXh0QXJlYUNsYXNzTmFtZXNbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBASW5wdXQoJ3ZhbHVlJylcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhcnNlTGluZXModmFsdWUpO1xuICB9XG5cbiAgQElucHV0KCdyZXF1aXJlZCcpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7XG4gIH1cblxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlO1xuICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICB9XG5cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByb3dzIGZvciB0aGUgdGV4dGFyZWEuIERlZmF1bHRzIHRvIDFcbiAgICovXG4gIEBJbnB1dCgncm93cycpXG4gIGdldCByb3dzKCk6IG51bWJlcnxzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG5cbiAgc2V0IHJvd3ModmFsdWU6IG51bWJlcnxzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgfVxuICAgICAgdGhpcy5fcm93cyA9IE1hdGgubWF4KDEsIHZhbHVlKTtcbiAgICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgY29sdW1ucyBmb3IgdGhlIHRleHRhcmVhLiBEZWZhdWx0cyB0byAxXG4gICAqL1xuICBASW5wdXQoJ2NvbHMnKVxuICBnZXQgY29sdW1ucygpOiBudW1iZXJ8c3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIHNldCBjb2x1bW5zKHZhbHVlOiBudW1iZXJ8c3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NvbHVtbnMgPSBNYXRoLm1heCgxLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgbWVudGlvbnMgdG8gZGlzcGxheSwgb3IgZmlsdGVyLCBpbiB0aGUgc2VhcmNoIHJlc3VsdCBsaXN0LlxuICAgKi9cbiAgQElucHV0KCdtZW50aW9ucycpXG4gIHNldCBtZW50aW9uSXRlbXModmFsdWU6IGFueVtdKSB7XG4gICAgdGhpcy5tZW50aW9ucyA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmRpc2FibGVTZWFyY2ggJiYgdGhpcy5tZW50aW9uc0xpc3QpIHtcbiAgICAgIHRoaXMubWVudGlvbnNMaXN0Lml0ZW1zID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJlYWRvbmx5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAncmVhZG9ubHknIDogbnVsbDtcbiAgfVxuXG4gIGdldCBlcnJvclN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9lcnJvclN0YXRlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgIHByaXZhdGUgdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiwgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJzZU1hcmt1cCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWFya3VwJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnBhcnNlTWFya3VwKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYWRkSW5wdXRMaXN0ZW5lcigpO1xuICAgIHRoaXMucGFyc2VMaW5lcyh0aGlzLl92YWx1ZSk7XG4gICAgdGhpcy5yZWZyZXNoU3R5bGVzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5hZGRJbnB1dExpc3RlbmVyKCk7XG4gICAgdGhpcy5yZWZyZXNoU3R5bGVzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faW5wdXRMaXN0ZW5lcikge1xuICAgICAgKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCBhcyBIVE1MVGV4dEFyZWFFbGVtZW50KS5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICB0aGlzLm1vYmlsZSA/ICdpbnB1dCcgOiAna2V5ZG93bicsXG4gICAgICAgIHRoaXMuX2lucHV0TGlzdGVuZXJcbiAgICAgICk7XG4gICAgICB0aGlzLl9pbnB1dExpc3RlbmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIHB1YmxpYyBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBvblRleHRBcmVhU2Nyb2xsKCk6IHZvaWQge1xuICAgIHRoaXMuaGlnaGxpZ2h0ZXJFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcDtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0ge1xuICAgICAga2V5OiB0aGlzLnRyaWdnZXJDaGFyLFxuICAgICAgd2hpY2g6IHRoaXMudHJpZ2dlckNoYXIuY2hhckNvZGVBdCgwKVxuICAgIH07XG4gICAgdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgY29uc3QgY2FyZXRQb3NpdGlvbjogbnVtYmVyID0gZ2V0Q2FyZXRQb3NpdGlvbih0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZDtcbiAgICBpZiAodHlwZW9mIHNlbGVjdGlvblN0YXJ0ICE9PSAnbnVtYmVyJyB8fCB0eXBlb2Ygc2VsZWN0aW9uRW5kICE9PSAnbnVtYmVyJykge1xuICAgICAgc2VsZWN0aW9uU3RhcnQgPSBjYXJldFBvc2l0aW9uO1xuICAgICAgc2VsZWN0aW9uRW5kID0gY2FyZXRQb3NpdGlvbjtcbiAgICB9XG4gICAgY29uc3QgbmV3Q2FyZXRQb3NpdGlvbiA9IHNlbGVjdGlvblN0YXJ0ICsgMTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuZGlzcGxheUNvbnRlbnQuc3Vic3RyaW5nKDAsIHNlbGVjdGlvblN0YXJ0KSArIHRoaXMudHJpZ2dlckNoYXIgKyB0aGlzLmRpc3BsYXlDb250ZW50LnN1YnN0cmluZyhzZWxlY3Rpb25FbmQpO1xuICAgIHRoaXMuZGlzcGxheUNvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLm9uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgICBzZXRUaW1lb3V0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdGlvblN0YXJ0ID0gbmV3Q2FyZXRQb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25FbmQgPSBuZXdDYXJldFBvc2l0aW9uO1xuICAgICAgICBzZXRDYXJldFBvc2l0aW9uKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCwgbmV3Q2FyZXRQb3NpdGlvbik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIHRoaXMub25LZXlEb3duKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBvblNlbGVjdChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3Rpb25TdGFydCA9IGV2ZW50LnRhcmdldC5zZWxlY3Rpb25TdGFydDtcbiAgICB0aGlzLnNlbGVjdGlvbkVuZCA9IGV2ZW50LnRhcmdldC5zZWxlY3Rpb25FbmQ7XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2UobmV3UGxhaW5UZXh0VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgY29uc3QgZGlzcGxheVRyYW5zZm9ybSA9IHRoaXMuZGlzcGxheVRyYW5zZm9ybS5iaW5kKHRoaXMpO1xuICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZDtcbiAgICBjb25zdCBib3VuZHMgPSBnZXRCb3VuZHNPZk1lbnRpb25BdFBvc2l0aW9uKG5ld1BsYWluVGV4dFZhbHVlLCB0aGlzLm1hcmt1cFNlYXJjaCwgc2VsZWN0aW9uU3RhcnQsIGRpc3BsYXlUcmFuc2Zvcm0pO1xuICAgIGlmIChib3VuZHMuc3RhcnQgIT09IC0xKSB7XG4gICAgICBuZXdQbGFpblRleHRWYWx1ZSA9IG5ld1BsYWluVGV4dFZhbHVlLnN1YnN0cmluZygwLCBib3VuZHMuc3RhcnQpICsgbmV3UGxhaW5UZXh0VmFsdWUuc3Vic3RyaW5nKGJvdW5kcy5lbmQpO1xuICAgIH1cbiAgICBjb25zdCBuZXdWYWx1ZSA9IGFwcGx5Q2hhbmdlVG9WYWx1ZShcbiAgICAgICAgdmFsdWUsIHRoaXMubWFya3VwU2VhcmNoLCBuZXdQbGFpblRleHRWYWx1ZSwgdGhpcy5zZWxlY3Rpb25TdGFydCwgdGhpcy5zZWxlY3Rpb25FbmQsIHNlbGVjdGlvbkVuZCxcbiAgICAgICAgZGlzcGxheVRyYW5zZm9ybSk7XG4gICAgY29uc3Qgc3RhcnRPZk1lbnRpb24gPSBmaW5kU3RhcnRPZk1lbnRpb25JblBsYWluVGV4dCh2YWx1ZSwgdGhpcy5tYXJrdXBTZWFyY2gsIHNlbGVjdGlvblN0YXJ0LCBkaXNwbGF5VHJhbnNmb3JtKTtcbiAgICBpZiAoc3RhcnRPZk1lbnRpb24uc3RhcnQgPiAtMSAmJiB0aGlzLnNlbGVjdGlvbkVuZCA+IHN0YXJ0T2ZNZW50aW9uLnN0YXJ0KSB7XG4gICAgICBzZWxlY3Rpb25TdGFydCA9IHN0YXJ0T2ZNZW50aW9uLnN0YXJ0O1xuICAgICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uU3RhcnQ7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0aW9uU3RhcnQgPSBNYXRoLm1heChzZWxlY3Rpb25TdGFydCwgMCk7XG4gICAgdGhpcy5zZWxlY3Rpb25FbmQgPSBNYXRoLm1heChzZWxlY3Rpb25FbmQsIDApO1xuICAgIHRoaXMucGFyc2VMaW5lcyhuZXdWYWx1ZSk7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uRW5kID4gMCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRDYXJldFBvc2l0aW9uKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCwgdGhpcy5zZWxlY3Rpb25FbmQpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JbnB1dChldmVudDogSW5wdXRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYXJhY3RlciA9IChldmVudC5kYXRhIHx8ICcnKTtcbiAgICBjb25zdCBrZXlDb2RlID0gSW5wdXRUb0tleWJvYXJkW2V2ZW50LmlucHV0VHlwZV0gfHwgY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleS5FbnRlciAmJiB0aGlzLm1lbnRpb25zTGlzdC5zaG93KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUlucHV0KHt3aGljaDoga2V5Q29kZX0sIGtleUNvZGUsIGNoYXJhY3Rlcik7XG4gIH1cblxuICBwdWJsaWMgb25LZXlEb3duKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgY2hhcmFjdGVyUHJlc3NlZCA9IGV2ZW50LmtleTtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcbiAgICBpZiAoIWNoYXJhY3RlclByZXNzZWQpIHtcbiAgICAgIGNvbnN0IGNoYXJhY3RlckNvZGUgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xuICAgICAgY2hhcmFjdGVyUHJlc3NlZCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhcmFjdGVyQ29kZSk7XG4gICAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5ICYmIChjaGFyYWN0ZXJDb2RlID49IDY1ICYmIGNoYXJhY3RlckNvZGUgPD0gOTApKSB7XG4gICAgICAgIGNoYXJhY3RlclByZXNzZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJhY3RlckNvZGUgKyAzMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVJbnB1dChldmVudCwga2V5Q29kZSwgY2hhcmFjdGVyUHJlc3NlZCk7XG4gIH1cblxuICBwdWJsaWMgb25CbHVyKGV2ZW50OiBNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnR8Rm9jdXNFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEZvY3VzRXZlbnQgJiYgZXZlbnQucmVsYXRlZFRhcmdldCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Ryb3Bkb3duLWl0ZW0nKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICBpZiAodGhpcy5tZW50aW9uc0xpc3QpIHtcbiAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaXNQYXJ0TWVudGlvbihwYXJ0OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIHBhcnQuY29udGVudHMgIT09ICd1bmRlZmluZWQnO1xuICB9XG5cbiAgcHVibGljIGZvcm1hdE1lbnRpb24obWVudGlvbjogTWVudGlvbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdE1lbnRpb24obWVudGlvbi5jb250ZW50cyk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUlucHV0KGV2ZW50OiBhbnksIGtleUNvZGU6IG51bWJlciwgY2hhcmFjdGVyUHJlc3NlZDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGNhcmV0UG9zaXRpb246IG51bWJlciA9IGdldENhcmV0UG9zaXRpb24odGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50KTtcbiAgICBpZiAoa2V5Q29kZSA9PT0gS2V5LkVudGVyICYmIGV2ZW50Lndhc1NlbGVjdGlvbiAmJiBjYXJldFBvc2l0aW9uIDwgdGhpcy5zdGFydFBvcykge1xuICAgICAgY2FyZXRQb3NpdGlvbiA9IHRoaXMuc3RhcnROb2RlLmxlbmd0aDtcbiAgICAgIHNldENhcmV0UG9zaXRpb24odGhpcy5zdGFydE5vZGUsIGNhcmV0UG9zaXRpb24pO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0T2ZNZW50aW9uID1cbiAgICAgIGZpbmRTdGFydE9mTWVudGlvbkluUGxhaW5UZXh0KHRoaXMuX3ZhbHVlLCB0aGlzLm1hcmt1cFNlYXJjaCwgY2FyZXRQb3NpdGlvbiwgdGhpcy5kaXNwbGF5VHJhbnNmb3JtLmJpbmQodGhpcykpO1xuICAgIGlmIChjaGFyYWN0ZXJQcmVzc2VkID09PSB0aGlzLnRyaWdnZXJDaGFyKSB7XG4gICAgICB0aGlzLnNldHVwTWVudGlvbnNMaXN0KGNhcmV0UG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoc3RhcnRPZk1lbnRpb24uc3RhcnQgPT09IC0xICYmIHRoaXMuc3RhcnRQb3MgPj0gMCkge1xuICAgICAgaWYgKGNhcmV0UG9zaXRpb24gPD0gdGhpcy5zdGFydFBvcykge1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSAtMTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGtleUNvZGUgIT09IEtleS5TaGlmdCAmJiAhZXZlbnQubWV0YUtleSAmJiAhZXZlbnQuYWx0S2V5ICYmICFldmVudC5jdHJsS2V5ICYmXG4gICAgICAgIGNhcmV0UG9zaXRpb24gPiB0aGlzLnN0YXJ0UG9zKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlS2V5RG93bihldmVudCwgY2FyZXRQb3NpdGlvbiwgY2hhcmFjdGVyUHJlc3NlZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TZWxlY3Qoe3RhcmdldDogdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50fSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkaXNwbGF5VHJhbnNmb3JtKC4uLl86IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBjb25zdCByZXBsYWNlSW5kZXggPSB0aGlzLm1hcmt1cFNlYXJjaC5ncm91cHNbdGhpcy5kaXNwbGF5TmFtZV07XG4gICAgcmV0dXJuIF9bcmVwbGFjZUluZGV4XTtcbiAgfVxuXG4gIHByaXZhdGUgX2Zvcm1hdE1lbnRpb24oY29udGVudHM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVwbGFjZVZhbHVlID0gYFxcJCR7dGhpcy5kaXNwbGF5TmFtZX1gO1xuICAgIGxldCByZXN1bHQgPSBjb250ZW50cy5yZXBsYWNlKHRoaXMubWFya3VwU2VhcmNoLnJlZ0V4LCByZXBsYWNlVmFsdWUpO1xuICAgIGxldCByZXBsYWNlSW5kZXg7XG4gICAgaWYgKHJlc3VsdCA9PT0gcmVwbGFjZVZhbHVlKSB7XG4gICAgICByZXBsYWNlSW5kZXggPSBgXFwkJHt0aGlzLm1hcmt1cFNlYXJjaC5ncm91cHNbdGhpcy5kaXNwbGF5TmFtZV19YDtcbiAgICAgIHJlc3VsdCA9IGNvbnRlbnRzLnJlcGxhY2UodGhpcy5tYXJrdXBTZWFyY2gucmVnRXgsIHJlcGxhY2VJbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIG5vaW5zcGVjdGlvbiBKU01ldGhvZENhbkJlU3RhdGljXG4gIHByaXZhdGUgc3RvcEV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50fEtleWJvYXJkRXZlbnR8Rm9jdXNFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cE1lbnRpb25zTGlzdChjYXJldFBvc2l0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXJ0UG9zID0gY2FyZXRQb3NpdGlvbjtcbiAgICB0aGlzLnN0YXJ0Tm9kZSA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5hbmNob3JOb2RlO1xuICAgIHRoaXMuc2VhcmNoU3RyaW5nID0gJyc7XG4gICAgdGhpcy5zdG9wU2VhcmNoID0gZmFsc2U7XG4gICAgdGhpcy5zaG93TWVudGlvbnNMaXN0KCk7XG4gICAgdGhpcy51cGRhdGVNZW50aW9uc0xpc3QoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlS2V5RG93bihldmVudDogYW55LCBjYXJldFBvc2l0aW9uOiBudW1iZXIsIGNoYXJhY3RlclByZXNzZWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xuICAgIGlmIChrZXlDb2RlID09PSBLZXkuU3BhY2UpIHtcbiAgICAgIHRoaXMuc3RhcnRQb3MgPSAtMTtcbiAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtleS5CYWNrc3BhY2UgJiYgY2FyZXRQb3NpdGlvbiA+IDApIHtcbiAgICAgIGNhcmV0UG9zaXRpb24tLTtcbiAgICAgIGlmIChjYXJldFBvc2l0aW9uID09PSB0aGlzLnN0YXJ0UG9zKSB7XG4gICAgICAgIHRoaXMuc3RvcFNlYXJjaCA9IHRydWU7XG4gICAgICB9XG4gICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gIXRoaXMuc3RvcFNlYXJjaDtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWVudGlvbnNMaXN0LnNob3cpIHtcbiAgICAgIGlmIChrZXlDb2RlID09PSBLZXkuVGFiIHx8IGtleUNvZGUgPT09IEtleS5FbnRlcikge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSBmYWxzZTtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID1cbiAgICAgICAgICAgIG1hcFBsYWluVGV4dEluZGV4KHZhbHVlLCB0aGlzLm1hcmt1cFNlYXJjaCwgdGhpcy5zdGFydFBvcywgZmFsc2UsIHRoaXMuZGlzcGxheVRyYW5zZm9ybS5iaW5kKHRoaXMpKTtcbiAgICAgICAgY29uc3QgaXRlbSA9IGV2ZW50Lml0ZW0gfHwgdGhpcy5tZW50aW9uc0xpc3Quc2VsZWN0ZWRJdGVtO1xuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHJlcGxhY2VQbGFjZWhvbGRlcnMoaXRlbSwgdGhpcy5tYXJrdXBTZWFyY2gpO1xuICAgICAgICBjb25zdCBuZXdEaXNwbGF5VmFsdWUgPSB0aGlzLl9mb3JtYXRNZW50aW9uKG5ld1ZhbHVlKTtcbiAgICAgICAgY2FyZXRQb3NpdGlvbiA9IHRoaXMuc3RhcnRQb3MgKyBuZXdEaXNwbGF5VmFsdWUubGVuZ3RoO1xuICAgICAgICBjb25zdCBzZWFyY2hTdHJpbmcgPSB0aGlzLnNlYXJjaFN0cmluZyB8fCAnJztcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnQpICsgbmV3VmFsdWUgKyB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQgKyBzZWFyY2hTdHJpbmcubGVuZ3RoICsgMSwgdmFsdWUubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5wYXJzZUxpbmVzKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IC0xO1xuICAgICAgICB0aGlzLnNlYXJjaFN0cmluZyA9ICcnO1xuICAgICAgICB0aGlzLnN0b3BTZWFyY2ggPSB0cnVlO1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBzZXRDYXJldFBvc2l0aW9uKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCwgY2FyZXRQb3NpdGlvbik7XG4gICAgICAgICAgdGhpcy5vblNlbGVjdCh7dGFyZ2V0OiB0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnR9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5LkVzY2FwZSkge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdG9wU2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXkuQXJyb3dEb3duKSB7XG4gICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5tZW50aW9uc0xpc3Quc2VsZWN0TmV4dEl0ZW0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXkuQXJyb3dVcCkge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNlbGVjdFByZXZpb3VzSXRlbSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtleS5Ib21lKSB7XG4gICAgICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5tZW50aW9uc0xpc3Quc2VsZWN0Rmlyc3RJdGVtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5LkVuZCkge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNlbGVjdExhc3RJdGVtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoa2V5Q29kZSA9PT0gS2V5LkFycm93TGVmdCB8fCBrZXlDb2RlID09PSBLZXkuQXJyb3dSaWdodCB8fCBrZXlDb2RlID09PSBLZXkuSG9tZSB8fCBrZXlDb2RlID09PSBLZXkuRW5kKSB7XG4gICAgICB0aGlzLm9uU2VsZWN0KGV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbWVudGlvbiA9IHRoaXMuZGlzcGxheUNvbnRlbnQuc3Vic3RyaW5nKHRoaXMuc3RhcnRQb3MgKyAxLCBjYXJldFBvc2l0aW9uKTtcbiAgICBpZiAoa2V5Q29kZSAhPT0gS2V5LkJhY2tzcGFjZSkge1xuICAgICAgbWVudGlvbiArPSBjaGFyYWN0ZXJQcmVzc2VkO1xuICAgIH1cbiAgICB0aGlzLnNlYXJjaFN0cmluZyA9IG1lbnRpb24gfHwgJyc7XG4gICAgdGhpcy51cGRhdGVNZW50aW9uc0xpc3QoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGlzcGxheVZhbHVlKGl0ZW06IGFueSk6IG51bGx8c3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9IGVsc2UgaWYgKGl0ZW1bdGhpcy5kaXNwbGF5TmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGl0ZW1bdGhpcy5kaXNwbGF5TmFtZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwcml2YXRlIHNob3dNZW50aW9uc0xpc3QoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1lbnRpb25zTGlzdCkge1xuICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmdNZW50aW9uc0xpc3RDb21wb25lbnQpO1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy52aWV3Q29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAgIHRoaXMubWVudGlvbnNMaXN0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuaXRlbVRlbXBsYXRlID0gdGhpcy5tZW50aW9uTGlzdFRlbXBsYXRlO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuZGlzcGxheVRyYW5zZm9ybSA9IHRoaXMuZGlzcGxheVRyYW5zZm9ybS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuaXRlbVNlbGVjdGVkLnN1YnNjcmliZShpdGVtID0+IHtcbiAgICAgICAgdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIGNvbnN0IGZha2VFdmVudCA9IHt3aGljaDogS2V5LkVudGVyLCB3YXNTZWxlY3Rpb246IHRydWUsIGl0ZW19O1xuICAgICAgICB0aGlzLm9uS2V5RG93bihmYWtlRXZlbnQpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLm1lbnRpb25zTGlzdC5kaXNwbGF5VHJhbnNmb3JtID0gdGhpcy5nZXREaXNwbGF5VmFsdWUuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5tZW50aW9uc0xpc3QudGV4dEFyZWFFbGVtZW50ID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSB0cnVlO1xuICAgIHRoaXMubWVudGlvbnNMaXN0LmRyb3BVcCA9IHRoaXMuZHJvcFVwO1xuICAgIHRoaXMubWVudGlvbnNMaXN0LmFjdGl2ZUluZGV4ID0gMDtcbiAgICB0aGlzLm1lbnRpb25zTGlzdC5wb3NpdGlvbigpO1xuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLm1lbnRpb25zTGlzdC5yZXNldFNjcm9sbCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlTWVudGlvbnNMaXN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlU2VhcmNoKSB7XG4gICAgICBsZXQgaXRlbXMgPSBBcnJheS5mcm9tKHRoaXMubWVudGlvbnMpO1xuICAgICAgaWYgKHRoaXMuc2VhcmNoU3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHNlYXJjaFN0cmluZyA9IHRoaXMuc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCk7IGNvbnN0IHNlYXJjaFJlZ0V4ID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoc2VhcmNoU3RyaW5nKSwgJ2knKTtcbiAgICAgICAgaXRlbXMgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldERpc3BsYXlWYWx1ZShpdGVtKTtcbiAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgc2VhcmNoUmVnRXgudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5tYXhJdGVtcyA+IDApIHtcbiAgICAgICAgICBpdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIHRoaXMubWF4SXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWVudGlvbnNMaXN0Lml0ZW1zID0gaXRlbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VhcmNoLmVtaXQodGhpcy5zZWFyY2hTdHJpbmcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VNYXJrdXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWVudGlvbk1hcmt1cC5sZW5ndGggPT09IDAgfHwgdGhpcy5tZW50aW9uTWFya3VwWzBdICE9PSB0aGlzLnRyaWdnZXJDaGFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5nLW1lbnRpb25zIG1hcmt1cCBwYXR0ZXJuIG11c3Qgc3RhcnQgd2l0aCB0aGUgdHJpZ2dlciBjaGFyYWN0ZXIgXCIke3RoaXMudHJpZ2dlckNoYXJ9XCJgKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmt1cFNlYXJjaCA9IG1hcmt1cFRvUmVnRXhwKHRoaXMubWVudGlvbk1hcmt1cCk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlTGluZXModmFsdWU6IHN0cmluZyA9ICcnKTogdm9pZCB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICAgIGNvbnN0IGxpbmVzID0gdmFsdWUuc3BsaXQodGhpcy5uZXdMaW5lKS5tYXAoKGxpbmU6IHN0cmluZykgPT4gdGhpcy5mb3JtYXRNZW50aW9ucyhsaW5lKSk7XG4gICAgICBjb25zdCBkaXNwbGF5Q29udGVudCA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUuY29udGVudCkuam9pbignXFxuJyk7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5Q29udGVudCAhPT0gZGlzcGxheUNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICAgICAgICBjb25zb2xlLmxvZyhsaW5lcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUNvbnRlbnQgPSBkaXNwbGF5Q29udGVudDtcbiAgICAgICAgdGhpcy50cmlnZ2VyQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdE1lbnRpb25zKGxpbmU6IHN0cmluZyk6IExpbmUge1xuICAgIGNvbnN0IGxpbmVPYmo6IExpbmUgPSA8TGluZT57b3JpZ2luYWxDb250ZW50OiBsaW5lLCBjb250ZW50OiBsaW5lLCBwYXJ0czogW119O1xuXG4gICAgaWYgKGxpbmUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbGluZU9iajtcbiAgICB9XG5cbiAgICBsZXQgbWVudGlvbjtcbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGNvbnN0IHJlZ0V4ID0gdGhpcy5tYXJrdXBTZWFyY2gucmVnRXg7XG4gICAgcmVnRXgubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAoKG1lbnRpb24gPSByZWdFeC5leGVjKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgdGFncy5wdXNoKHtpbmRpY2VzOiB7c3RhcnQ6IG1lbnRpb24uaW5kZXgsIGVuZDogbWVudGlvbi5pbmRleCArIG1lbnRpb25bMF0ubGVuZ3RofX0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZUYWdzOiBUYWdbXSA9IFtdO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgWy4uLnRhZ3NdLnNvcnQoKHRhZ0EsIHRhZ0IpID0+IHRhZ0EuaW5kaWNlcy5zdGFydCAtIHRhZ0IuaW5kaWNlcy5zdGFydCkuZm9yRWFjaCgodGFnOiBUYWcpID0+IHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkTGVuZ3RoID0gdGFnLmluZGljZXMuZW5kIC0gdGFnLmluZGljZXMuc3RhcnQ7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGxpbmUuc2xpY2UodGFnLmluZGljZXMuc3RhcnQsIHRhZy5pbmRpY2VzLmVuZCk7XG4gICAgICBpZiAoY29udGVudHMubGVuZ3RoID09PSBleHBlY3RlZExlbmd0aCkge1xuICAgICAgICBjb25zdCBwcmV2SW5kZXggPSBwcmV2VGFncy5sZW5ndGggPiAwID8gcHJldlRhZ3NbcHJldlRhZ3MubGVuZ3RoIC0gMV0uaW5kaWNlcy5lbmQgOiAwO1xuICAgICAgICBjb25zdCBiZWZvcmUgPSBsaW5lLnNsaWNlKHByZXZJbmRleCwgdGFnLmluZGljZXMuc3RhcnQpO1xuICAgICAgICBjb25zdCBwYXJ0TWVudGlvbiA9IDxNZW50aW9uPntjb250ZW50cywgdGFnfTtcbiAgICAgICAgbGluZU9iai5wYXJ0cy5wdXNoKGJlZm9yZSk7XG4gICAgICAgIGxpbmVPYmoucGFydHMucHVzaChwYXJ0TWVudGlvbik7XG4gICAgICAgIHByZXZUYWdzLnB1c2godGFnKTtcbiAgICAgICAgY29udGVudCArPSBiZWZvcmUgKyB0aGlzLmZvcm1hdE1lbnRpb24ocGFydE1lbnRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVtYWluaW5nU3RhcnQgPSBwcmV2VGFncy5sZW5ndGggPiAwID8gcHJldlRhZ3NbcHJldlRhZ3MubGVuZ3RoIC0gMV0uaW5kaWNlcy5lbmQgOiAwO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGxpbmUuc2xpY2UocmVtYWluaW5nU3RhcnQpO1xuICAgIGxpbmVPYmoucGFydHMucHVzaChyZW1haW5pbmcpO1xuICAgIGNvbnRlbnQgKz0gcmVtYWluaW5nO1xuICAgIGxpbmVPYmouY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gbGluZU9iajtcbiAgfVxuXG4gIHByaXZhdGUgYWRkSW5wdXRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lucHV0TGlzdGVuZXIgJiYgdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudCkge1xuICAgICAgdGhpcy5faW5wdXRMaXN0ZW5lciA9IHRoaXMubW9iaWxlID8gKGV2ZW50OiBJbnB1dEV2ZW50KSA9PiB0aGlzLm9uSW5wdXQoZXZlbnQpIDogKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB0aGlzLm9uS2V5RG93bihldmVudCk7XG4gICAgICAodGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICB0aGlzLm1vYmlsZSA/ICdpbnB1dCcgOiAna2V5ZG93bicsXG4gICAgICAgIHRoaXMuX2lucHV0TGlzdGVuZXJcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGNvbXB1dGVkU3R5bGU6IGFueSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgdGhpcy5oaWdobGlnaHRlclN0eWxlID0ge307XG4gICAgc3R5bGVQcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICB0aGlzLmhpZ2hsaWdodGVyU3R5bGVbcHJvcF0gPSBjb21wdXRlZFN0eWxlW3Byb3BdO1xuICAgIH0pO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyQ2hhbmdlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudmFsdWVDaGFuZ2VzLmVtaXQodGhpcy5fdmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG59XG4iXX0=