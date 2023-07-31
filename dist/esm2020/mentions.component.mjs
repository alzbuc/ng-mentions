import { ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { Subject } from 'rxjs';
import { Key } from './util/key';
import { NgMentionsListComponent } from './util/mentions-list.component';
import { applyChangeToValue, escapeRegExp, findStartOfMentionInPlainText, getBoundsOfMentionAtPosition, getCaretPosition, isMobileOrTablet, mapPlainTextIndex, markupToRegExp, replacePlaceholders, setCaretPosition, styleProperties, } from './util/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/forms";
import * as i3 from "./util/highlight.directive";
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
    /**
     * Classes for textarea
     */
    get formClass() {
        return Object.keys(this.textAreaClassNames).join(' ');
    }
    set formClass(classNames) {
        this.textAreaClassNames = {};
        Array.from(classNames.split(' ')).forEach((className) => (this.textAreaClassNames[className] = true));
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
    constructor(element, viewContainer, changeDetector, ngZone) {
        this.element = element;
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
        const event = { key: this.triggerChar, which: this.triggerChar.charCodeAt(0) };
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
        const character = event.data || '';
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
            if (!event.shiftKey && characterCode >= 65 && characterCode <= 90) {
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
            else if (keyCode !== Key.Shift &&
                !event.metaKey &&
                !event.altKey &&
                !event.ctrlKey &&
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
                this.handleKeydownMentionSelection(event, caretPosition);
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
    handleKeydownMentionSelection(event, caretPosition) {
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
            const componentRef = this.viewContainer.createComponent(NgMentionsListComponent);
            this.mentionsList = componentRef.instance;
            this.mentionsList.itemTemplate = this.mentionListTemplate;
            this.mentionsList.displayTransform = this.displayTransform.bind(this);
            this.mentionsList.itemSelected.subscribe((item) => {
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
                items = items.filter((item) => {
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
            const displayContent = lines.map((line) => line.content).join('\n');
            if (this.displayContent !== displayContent) {
                this.lines = lines;
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
        [...tags]
            .sort((tagA, tagB) => tagA.indices.start - tagB.indices.start)
            .forEach((tag) => {
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
            this._inputListener = (event) => this.onKeyDown(event);
            if (this.mobile) {
                this._inputListener = (event) => this.onInput(event);
            }
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
        styleProperties.forEach((prop) => (this.highlighterStyle[prop] = computedStyle[prop]));
        this.changeDetector.detectChanges();
    }
    triggerChange(value) {
        this._value = value;
        this.valueChanges.emit(this._value);
        this.changeDetector.detectChanges();
    }
}
NgMentionsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.4", ngImport: i0, type: NgMentionsComponent, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgMentionsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.4", type: NgMentionsComponent, selector: "ng-mentions", inputs: { triggerChar: "triggerChar", mentionMarkup: ["markup", "mentionMarkup"], disableSearch: "disableSearch", maxItems: "maxItems", dropUp: "dropUp", displayName: "displayName", placeholder: "placeholder", formClass: "formClass", value: "value", required: "required", disabled: "disabled", rows: "rows", columns: ["cols", "columns"], mentionItems: ["mentions", "mentionItems"] }, outputs: { search: "search", valueChanges: "valueChanges", stateChanges: "stateChanges" }, host: { listeners: { "window:resize": "onWindowResize()" } }, queries: [{ propertyName: "mentionListTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "textAreaInputElement", first: true, predicate: ["input"], descendants: true, static: true }, { propertyName: "highlighterElement", first: true, predicate: ["highlighter"], descendants: true, static: true }], exportAs: ["ngMentions"], usesOnChanges: true, ngImport: i0, template: `
    <div
      #highlighter
      class="highlighter"
      [ngClass]="textAreaClassNames"
      [attr.readonly]="readonly"
      [ngStyle]="highlighterStyle"
    >
      <div *ngFor="let line of lines">
        <ng-container *ngFor="let part of line.parts">
          <highlighted *ngIf="isPartMention(part)" [tag]="part.tag">{{ formatMention(part) }}</highlighted>
          <ng-container *ngIf="!isPartMention(part)">{{ part }}</ng-container>
        </ng-container>
        <ng-container *ngIf="line.parts.length === 0">&nbsp;</ng-container>
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
  `, isInline: true, styles: ["ng-mentions{position:relative;display:inline-block}ng-mentions textarea{position:relative;background-color:transparent!important}ng-mentions .highlighter{position:absolute;top:0;left:0;right:0;bottom:0;color:transparent;overflow:hidden!important}ng-mentions highlighted{display:inline;border-radius:3px;padding:1px;margin:-1px;overflow-wrap:break-word;background-color:#add8e6}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.HighlightedDirective, selector: "highlighted", inputs: ["tag"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.4", ngImport: i0, type: NgMentionsComponent, decorators: [{
            type: Component,
            args: [{ exportAs: 'ngMentions', selector: 'ng-mentions', template: `
    <div
      #highlighter
      class="highlighter"
      [ngClass]="textAreaClassNames"
      [attr.readonly]="readonly"
      [ngStyle]="highlighterStyle"
    >
      <div *ngFor="let line of lines">
        <ng-container *ngFor="let part of line.parts">
          <highlighted *ngIf="isPartMention(part)" [tag]="part.tag">{{ formatMention(part) }}</highlighted>
          <ng-container *ngIf="!isPartMention(part)">{{ part }}</ng-container>
        </ng-container>
        <ng-container *ngIf="line.parts.length === 0">&nbsp;</ng-container>
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { triggerChar: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21lbnRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBR0wsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFJTixNQUFNLEVBRU4sV0FBVyxFQUNYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHL0IsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNqQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN6RSxPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLFlBQVksRUFDWiw2QkFBNkIsRUFDN0IsNEJBQTRCLEVBQzVCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBRWpCLGNBQWMsRUFDZCxtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FDaEIsTUFBTSxjQUFjLENBQUM7Ozs7O0FBRXRCLHFDQUFxQztBQUNyQyxJQUFLLGVBR0o7QUFIRCxXQUFLLGVBQWU7SUFDbEIsdUZBQXVDLENBQUE7SUFDdkMsNEVBQTZCLENBQUE7QUFDL0IsQ0FBQyxFQUhJLGVBQWUsS0FBZixlQUFlLFFBR25CO0FBRUQ7O0dBRUc7QUF3Q0gsTUFBTSxPQUFPLG1CQUFtQjtJQWlFOUI7O09BRUc7SUFDSCxJQUNJLFNBQVM7UUFDWCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxVQUFrQjtRQUM5QixJ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QkFEWCxLQUFLO3VCQUFDLFVBQVU7Z0JBY2IsSUFBSTtzQkFEUCxLQUFLO3VCQUFDLE1BQU07Z0JBbUJULE9BQU87c0JBRFYsS0FBSzt1QkFBQyxNQUFNO2dCQW1CVCxZQUFZO3NCQURmLEtBQUs7dUJBQUMsVUFBVTtnQkF5RFYsY0FBYztzQkFEcEIsWUFBWTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IExpbmUsIE1lbnRpb24sIFRhZyB9IGZyb20gJy4vdXRpbC9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEtleSB9IGZyb20gJy4vdXRpbC9rZXknO1xuaW1wb3J0IHsgTmdNZW50aW9uc0xpc3RDb21wb25lbnQgfSBmcm9tICcuL3V0aWwvbWVudGlvbnMtbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgYXBwbHlDaGFuZ2VUb1ZhbHVlLFxuICBlc2NhcGVSZWdFeHAsXG4gIGZpbmRTdGFydE9mTWVudGlvbkluUGxhaW5UZXh0LFxuICBnZXRCb3VuZHNPZk1lbnRpb25BdFBvc2l0aW9uLFxuICBnZXRDYXJldFBvc2l0aW9uLFxuICBpc01vYmlsZU9yVGFibGV0LFxuICBtYXBQbGFpblRleHRJbmRleCxcbiAgTWFya3VwTWVudGlvbixcbiAgbWFya3VwVG9SZWdFeHAsXG4gIHJlcGxhY2VQbGFjZWhvbGRlcnMsXG4gIHNldENhcmV0UG9zaXRpb24sXG4gIHN0eWxlUHJvcGVydGllcyxcbn0gZnJvbSAnLi91dGlsL3V0aWxzJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNoYWRvd1xuZW51bSBJbnB1dFRvS2V5Ym9hcmQge1xuICAnZGVsZXRlQ29udGVudEJhY2t3YXJkJyA9IEtleS5CYWNrc3BhY2UsXG4gICdpbnNlcnRMaW5lQnJlYWsnID0gS2V5LkVudGVyLFxufVxuXG4vKipcbiAqIFRoZSBNZW50aW9ucyBDb21wb25lbnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIGV4cG9ydEFzOiAnbmdNZW50aW9ucycsXG4gIHNlbGVjdG9yOiAnbmctbWVudGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgICNoaWdobGlnaHRlclxuICAgICAgY2xhc3M9XCJoaWdobGlnaHRlclwiXG4gICAgICBbbmdDbGFzc109XCJ0ZXh0QXJlYUNsYXNzTmFtZXNcIlxuICAgICAgW2F0dHIucmVhZG9ubHldPVwicmVhZG9ubHlcIlxuICAgICAgW25nU3R5bGVdPVwiaGlnaGxpZ2h0ZXJTdHlsZVwiXG4gICAgPlxuICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgbGluZSBvZiBsaW5lc1wiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBwYXJ0IG9mIGxpbmUucGFydHNcIj5cbiAgICAgICAgICA8aGlnaGxpZ2h0ZWQgKm5nSWY9XCJpc1BhcnRNZW50aW9uKHBhcnQpXCIgW3RhZ109XCJwYXJ0LnRhZ1wiPnt7IGZvcm1hdE1lbnRpb24ocGFydCkgfX08L2hpZ2hsaWdodGVkPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaXNQYXJ0TWVudGlvbihwYXJ0KVwiPnt7IHBhcnQgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsaW5lLnBhcnRzLmxlbmd0aCA9PT0gMFwiPiZuYnNwOzwvbmctY29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPHRleHRhcmVhXG4gICAgICAjaW5wdXRcbiAgICAgIFtyb3dzXT1cInJvd3NcIlxuICAgICAgW2NvbHNdPVwiY29sdW1uc1wiXG4gICAgICBbbmdNb2RlbF09XCJkaXNwbGF5Q29udGVudFwiXG4gICAgICBbbmdDbGFzc109XCJ0ZXh0QXJlYUNsYXNzTmFtZXNcIlxuICAgICAgKGJsdXIpPVwib25CbHVyKCRldmVudClcIlxuICAgICAgKHNlbGVjdCk9XCJvblNlbGVjdCgkZXZlbnQpXCJcbiAgICAgIChtb3VzZXVwKT1cIm9uU2VsZWN0KCRldmVudClcIlxuICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwib25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAoc2Nyb2xsKT1cIm9uVGV4dEFyZWFTY3JvbGwoKVwiXG4gICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgW3JlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgIFtwbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgPjwvdGV4dGFyZWE+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL21lbnRpb25zLnNjc3MnXSxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE5nTWVudGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFRoZSBjaGFyYWN0ZXIgdG8gdHJpZ2dlciB0aGUgbWVudGlvbnMgbGlzdCB3aGVuIGEgdXNlciBpcyB0eXBpbmcgaW4gdGhlIGlucHV0IGZpZWxkXG4gICAqL1xuICBASW5wdXQoJ3RyaWdnZXJDaGFyJykgdHJpZ2dlckNoYXIgPSAnQCc7XG4gIC8qKlxuICAgKiBUaGUgbWFya3VwIHVzZWQgdG8gZm9ybWF0IGEgbWVudGlvbiBpbiB0aGUgbW9kZWwgdmFsdWVcbiAgICovXG4gIEBJbnB1dCgnbWFya3VwJykgbWVudGlvbk1hcmt1cCA9ICdAW19fZGlzcGxheV9fXShfX3R5cGVfXzpfX2lkX18pJztcbiAgLyoqXG4gICAqIE9wdGlvbmFsLiBXaGVuIHVzaW5nIGEgY3VzdG9tIHNlYXJjaCAoaS5lLiBhbiBBUEkgY2FsbCksIHRoZSBpbnRlcm5hbCBzZWFyY2hpbmcgY2FwYWJpbGl0eSBzaG91bGQgYmUgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoJ2Rpc2FibGVTZWFyY2gnKSBkaXNhYmxlU2VhcmNoID0gZmFsc2U7XG4gIC8qKlxuICAgKiBPbmx5IHVzZWQgd2hlbiBpbnRlcm5hbCBzZWFyY2ggaXMgbm90IGRpc2FibGVkLiBUaGlzIGxpbWl0cyB0aGUgbWF4aW11bSBudW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBpbiB0aGUgc2VhcmNoXG4gICAqIHJlc3VsdCBsaXN0LlxuICAgKi9cbiAgQElucHV0KCdtYXhJdGVtcycpIG1heEl0ZW1zID0gLTE7XG4gIC8qKlxuICAgKiBVc2VkIHRvIGNhdXNlIHRoZSBzZWFyY2ggcmVzdWx0IGxpc3QgdG8gZGlzcGxheSBpbiBhIFwiZHJvcCB1cFwiIGZhc2hpb24sIGluc3RlYWQgb2YgYSB0eXBpY2FsIGRyb3Bkb3duLlxuICAgKi9cbiAgQElucHV0KCdkcm9wVXAnKSBkcm9wVXAgPSBmYWxzZTtcbiAgLyoqXG4gICAqIElmIHRoZSBzdXBwbGllZCBtZW50aW9ucyBhcmUgYSBsaXN0IG9mIG9iamVjdHMsIHRoaXMgaXMgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHVzZWQgdG8gZGlzcGxheVxuICAgKiB0aGUgbWVudGlvbiBpbiB0aGUgc2VhcmNoIHJlc3VsdCBsaXN0IGFuZCB3aGVuIGZvcm1hdHRpbmcgYSBtZW50aW9uIGluIHRoZSBkaXNwbGF5ZWQgdGV4dC5cbiAgICovXG4gIEBJbnB1dCgnZGlzcGxheU5hbWUnKSBkaXNwbGF5TmFtZSA9ICdkaXNwbGF5JztcbiAgQElucHV0KCdwbGFjZWhvbGRlcicpIHBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQsIGFmdGVyIHRoZSB0cmlnZ2VyIGNoYXJhY3RlciBoYXMgYmVlbiB0eXBlZCwgd2l0aCB0aGUgdXNlci1lbnRlcmVkIHNlYXJjaCBzdHJpbmcuXG4gICAqL1xuICBAT3V0cHV0KCdzZWFyY2gnKSByZWFkb25seSBzZWFyY2g6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoJ3ZhbHVlQ2hhbmdlcycpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlczogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgnc3RhdGVDaGFuZ2VzJykgcmVhZG9ubHkgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7IHN0YXRpYzogdHJ1ZSB9KSBtZW50aW9uTGlzdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAVmlld0NoaWxkKCdpbnB1dCcsIHsgc3RhdGljOiB0cnVlIH0pIHRleHRBcmVhSW5wdXRFbGVtZW50OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdoaWdobGlnaHRlcicsIHsgc3RhdGljOiB0cnVlIH0pIGhpZ2hsaWdodGVyRWxlbWVudDogRWxlbWVudFJlZjtcblxuICBkaXNwbGF5Q29udGVudCA9ICcnO1xuICBsaW5lczogTGluZVtdID0gW107XG4gIGhpZ2hsaWdodGVyU3R5bGU6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgdGV4dEFyZWFDbGFzc05hbWVzOiB7IFtrZXk6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuICBzZWxlY3Rpb25TdGFydDogbnVtYmVyO1xuICBzZWxlY3Rpb25FbmQ6IG51bWJlcjtcbiAgbWVudGlvbnM6IGFueVtdID0gW107XG5cbiAgcHJpdmF0ZSBfdmFsdWUgPSAnJztcbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9yb3dzID0gMTtcbiAgcHJpdmF0ZSBfY29sdW1ucyA9IDIwO1xuICBwcml2YXRlIHNlYXJjaFN0cmluZzogc3RyaW5nO1xuICBwcml2YXRlIHN0YXJ0UG9zOiBudW1iZXI7XG4gIHByaXZhdGUgc3RhcnROb2RlO1xuICBtZW50aW9uc0xpc3Q6IE5nTWVudGlvbnNMaXN0Q29tcG9uZW50O1xuICBwcml2YXRlIHN0b3BTZWFyY2ggPSBmYWxzZTtcbiAgcHJpdmF0ZSBtYXJrdXBTZWFyY2g6IE1hcmt1cE1lbnRpb247XG4gIHByaXZhdGUgX2Rlc3Ryb3llZDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgbmV3TGluZSA9IC9cXG4vZztcbiAgcHJpdmF0ZSBfZXJyb3JTdGF0ZSA9IGZhbHNlO1xuICBwcml2YXRlIF9pbnB1dExpc3RlbmVyOiBhbnk7XG4gIHByaXZhdGUgbW9iaWxlOiBib29sZWFuID0gaXNNb2JpbGVPclRhYmxldCgpO1xuXG4gIC8qKlxuICAgKiBDbGFzc2VzIGZvciB0ZXh0YXJlYVxuICAgKi9cbiAgQElucHV0KCdmb3JtQ2xhc3MnKVxuICBnZXQgZm9ybUNsYXNzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudGV4dEFyZWFDbGFzc05hbWVzKS5qb2luKCcgJyk7XG4gIH1cblxuICBzZXQgZm9ybUNsYXNzKGNsYXNzTmFtZXM6IHN0cmluZykge1xuICAgIHRoaXMudGV4dEFyZWFDbGFzc05hbWVzID0ge307XG4gICAgQXJyYXkuZnJvbShjbGFzc05hbWVzLnNwbGl0KCcgJykpLmZvckVhY2goKGNsYXNzTmFtZSkgPT4gKHRoaXMudGV4dEFyZWFDbGFzc05hbWVzW2NsYXNzTmFtZV0gPSB0cnVlKSk7XG4gIH1cblxuICBASW5wdXQoJ3ZhbHVlJylcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhcnNlTGluZXModmFsdWUpO1xuICB9XG5cbiAgQElucHV0KCdyZXF1aXJlZCcpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7XG4gIH1cblxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlO1xuICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICB9XG5cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByb3dzIGZvciB0aGUgdGV4dGFyZWEuIERlZmF1bHRzIHRvIDFcbiAgICovXG4gIEBJbnB1dCgncm93cycpXG4gIGdldCByb3dzKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvd3M7XG4gIH1cblxuICBzZXQgcm93cyh2YWx1ZTogbnVtYmVyIHwgc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Jvd3MgPSBNYXRoLm1heCgxLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTnVtYmVyIG9mIGNvbHVtbnMgZm9yIHRoZSB0ZXh0YXJlYS4gRGVmYXVsdHMgdG8gMVxuICAgKi9cbiAgQElucHV0KCdjb2xzJylcbiAgZ2V0IGNvbHVtbnMoKTogbnVtYmVyIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgfVxuXG4gIHNldCBjb2x1bW5zKHZhbHVlOiBudW1iZXIgfCBzdHJpbmcpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgfVxuICAgICAgdGhpcy5fY29sdW1ucyA9IE1hdGgubWF4KDEsIHZhbHVlKTtcbiAgICAgIHRoaXMucmVmcmVzaFN0eWxlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBtZW50aW9ucyB0byBkaXNwbGF5LCBvciBmaWx0ZXIsIGluIHRoZSBzZWFyY2ggcmVzdWx0IGxpc3QuXG4gICAqL1xuICBASW5wdXQoJ21lbnRpb25zJylcbiAgc2V0IG1lbnRpb25JdGVtcyh2YWx1ZTogYW55W10pIHtcbiAgICB0aGlzLm1lbnRpb25zID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVNlYXJjaCAmJiB0aGlzLm1lbnRpb25zTGlzdCkge1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuaXRlbXMgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmVhZG9ubHkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICdyZWFkb25seScgOiBudWxsO1xuICB9XG5cbiAgZ2V0IGVycm9yU3RhdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yU3RhdGU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnBhcnNlTWFya3VwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCdtYXJrdXAnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMucGFyc2VNYXJrdXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5hZGRJbnB1dExpc3RlbmVyKCk7XG4gICAgdGhpcy5wYXJzZUxpbmVzKHRoaXMuX3ZhbHVlKTtcbiAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmFkZElucHV0TGlzdGVuZXIoKTtcbiAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pbnB1dExpc3RlbmVyKSB7XG4gICAgICAodGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHRoaXMubW9iaWxlID8gJ2lucHV0JyA6ICdrZXlkb3duJyxcbiAgICAgICAgdGhpcy5faW5wdXRMaXN0ZW5lcixcbiAgICAgICk7XG4gICAgICB0aGlzLl9pbnB1dExpc3RlbmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIHB1YmxpYyBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlZnJlc2hTdHlsZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBvblRleHRBcmVhU2Nyb2xsKCk6IHZvaWQge1xuICAgIHRoaXMuaGlnaGxpZ2h0ZXJFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcDtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0geyBrZXk6IHRoaXMudHJpZ2dlckNoYXIsIHdoaWNoOiB0aGlzLnRyaWdnZXJDaGFyLmNoYXJDb2RlQXQoMCkgfTtcbiAgICB0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICBjb25zdCBjYXJldFBvc2l0aW9uOiBudW1iZXIgPSBnZXRDYXJldFBvc2l0aW9uKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgIGxldCBzZWxlY3Rpb25FbmQgPSB0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uRW5kO1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0aW9uU3RhcnQgIT09ICdudW1iZXInIHx8IHR5cGVvZiBzZWxlY3Rpb25FbmQgIT09ICdudW1iZXInKSB7XG4gICAgICBzZWxlY3Rpb25TdGFydCA9IGNhcmV0UG9zaXRpb247XG4gICAgICBzZWxlY3Rpb25FbmQgPSBjYXJldFBvc2l0aW9uO1xuICAgIH1cbiAgICBjb25zdCBuZXdDYXJldFBvc2l0aW9uID0gc2VsZWN0aW9uU3RhcnQgKyAxO1xuICAgIGNvbnN0IG5ld1ZhbHVlID1cbiAgICAgIHRoaXMuZGlzcGxheUNvbnRlbnQuc3Vic3RyaW5nKDAsIHNlbGVjdGlvblN0YXJ0KSArIHRoaXMudHJpZ2dlckNoYXIgKyB0aGlzLmRpc3BsYXlDb250ZW50LnN1YnN0cmluZyhzZWxlY3Rpb25FbmQpO1xuICAgIHRoaXMuZGlzcGxheUNvbnRlbnQgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLm9uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uU3RhcnQgPSBuZXdDYXJldFBvc2l0aW9uO1xuICAgICAgdGhpcy5zZWxlY3Rpb25FbmQgPSBuZXdDYXJldFBvc2l0aW9uO1xuICAgICAgc2V0Q2FyZXRQb3NpdGlvbih0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5ld0NhcmV0UG9zaXRpb24pO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB0aGlzLm9uS2V5RG93bihldmVudCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblNlbGVjdChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3Rpb25TdGFydCA9IGV2ZW50LnRhcmdldC5zZWxlY3Rpb25TdGFydDtcbiAgICB0aGlzLnNlbGVjdGlvbkVuZCA9IGV2ZW50LnRhcmdldC5zZWxlY3Rpb25FbmQ7XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2UobmV3UGxhaW5UZXh0VmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgY29uc3QgZGlzcGxheVRyYW5zZm9ybSA9IHRoaXMuZGlzcGxheVRyYW5zZm9ybS5iaW5kKHRoaXMpO1xuICAgIGxldCBzZWxlY3Rpb25TdGFydCA9IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25TdGFydDtcbiAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZDtcbiAgICBjb25zdCBib3VuZHMgPSBnZXRCb3VuZHNPZk1lbnRpb25BdFBvc2l0aW9uKG5ld1BsYWluVGV4dFZhbHVlLCB0aGlzLm1hcmt1cFNlYXJjaCwgc2VsZWN0aW9uU3RhcnQsIGRpc3BsYXlUcmFuc2Zvcm0pO1xuICAgIGlmIChib3VuZHMuc3RhcnQgIT09IC0xKSB7XG4gICAgICBuZXdQbGFpblRleHRWYWx1ZSA9IG5ld1BsYWluVGV4dFZhbHVlLnN1YnN0cmluZygwLCBib3VuZHMuc3RhcnQpICsgbmV3UGxhaW5UZXh0VmFsdWUuc3Vic3RyaW5nKGJvdW5kcy5lbmQpO1xuICAgIH1cbiAgICBjb25zdCBuZXdWYWx1ZSA9IGFwcGx5Q2hhbmdlVG9WYWx1ZShcbiAgICAgIHZhbHVlLFxuICAgICAgdGhpcy5tYXJrdXBTZWFyY2gsXG4gICAgICBuZXdQbGFpblRleHRWYWx1ZSxcbiAgICAgIHRoaXMuc2VsZWN0aW9uU3RhcnQsXG4gICAgICB0aGlzLnNlbGVjdGlvbkVuZCxcbiAgICAgIHNlbGVjdGlvbkVuZCxcbiAgICAgIGRpc3BsYXlUcmFuc2Zvcm0sXG4gICAgKTtcbiAgICBjb25zdCBzdGFydE9mTWVudGlvbiA9IGZpbmRTdGFydE9mTWVudGlvbkluUGxhaW5UZXh0KHZhbHVlLCB0aGlzLm1hcmt1cFNlYXJjaCwgc2VsZWN0aW9uU3RhcnQsIGRpc3BsYXlUcmFuc2Zvcm0pO1xuICAgIGlmIChzdGFydE9mTWVudGlvbi5zdGFydCA+IC0xICYmIHRoaXMuc2VsZWN0aW9uRW5kID4gc3RhcnRPZk1lbnRpb24uc3RhcnQpIHtcbiAgICAgIHNlbGVjdGlvblN0YXJ0ID0gc3RhcnRPZk1lbnRpb24uc3RhcnQ7XG4gICAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb25TdGFydDtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3Rpb25TdGFydCA9IE1hdGgubWF4KHNlbGVjdGlvblN0YXJ0LCAwKTtcbiAgICB0aGlzLnNlbGVjdGlvbkVuZCA9IE1hdGgubWF4KHNlbGVjdGlvbkVuZCwgMCk7XG4gICAgdGhpcy5wYXJzZUxpbmVzKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25FbmQgPiAwKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHNldENhcmV0UG9zaXRpb24odGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLnNlbGVjdGlvbkVuZCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbklucHV0KGV2ZW50OiBJbnB1dEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgY2hhcmFjdGVyID0gZXZlbnQuZGF0YSB8fCAnJztcbiAgICBjb25zdCBrZXlDb2RlID0gSW5wdXRUb0tleWJvYXJkW2V2ZW50LmlucHV0VHlwZV0gfHwgY2hhcmFjdGVyLmNoYXJDb2RlQXQoMCk7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleS5FbnRlciAmJiB0aGlzLm1lbnRpb25zTGlzdC5zaG93KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUlucHV0KHsgd2hpY2g6IGtleUNvZGUgfSwga2V5Q29kZSwgY2hhcmFjdGVyKTtcbiAgfVxuXG4gIHB1YmxpYyBvbktleURvd24oZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGxldCBjaGFyYWN0ZXJQcmVzc2VkID0gZXZlbnQua2V5O1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xuICAgIGlmICghY2hhcmFjdGVyUHJlc3NlZCkge1xuICAgICAgY29uc3QgY2hhcmFjdGVyQ29kZSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICBjaGFyYWN0ZXJQcmVzc2VkID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaGFyYWN0ZXJDb2RlKTtcbiAgICAgIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgY2hhcmFjdGVyQ29kZSA+PSA2NSAmJiBjaGFyYWN0ZXJDb2RlIDw9IDkwKSB7XG4gICAgICAgIGNoYXJhY3RlclByZXNzZWQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJhY3RlckNvZGUgKyAzMik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVJbnB1dChldmVudCwga2V5Q29kZSwgY2hhcmFjdGVyUHJlc3NlZCk7XG4gIH1cblxuICBwdWJsaWMgb25CbHVyKGV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudCB8IEZvY3VzRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBGb2N1c0V2ZW50ICYmIGV2ZW50LnJlbGF0ZWRUYXJnZXQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBldmVudC5yZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wZG93bi1pdGVtJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgaWYgKHRoaXMubWVudGlvbnNMaXN0KSB7XG4gICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzUGFydE1lbnRpb24ocGFydDogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiBwYXJ0LmNvbnRlbnRzICE9PSAndW5kZWZpbmVkJztcbiAgfVxuXG4gIHB1YmxpYyBmb3JtYXRNZW50aW9uKG1lbnRpb246IE1lbnRpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9mb3JtYXRNZW50aW9uKG1lbnRpb24uY29udGVudHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVJbnB1dChldmVudDogYW55LCBrZXlDb2RlOiBudW1iZXIsIGNoYXJhY3RlclByZXNzZWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBjYXJldFBvc2l0aW9uOiBudW1iZXIgPSBnZXRDYXJldFBvc2l0aW9uKHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleS5FbnRlciAmJiBldmVudC53YXNTZWxlY3Rpb24gJiYgY2FyZXRQb3NpdGlvbiA8IHRoaXMuc3RhcnRQb3MpIHtcbiAgICAgIGNhcmV0UG9zaXRpb24gPSB0aGlzLnN0YXJ0Tm9kZS5sZW5ndGg7XG4gICAgICBzZXRDYXJldFBvc2l0aW9uKHRoaXMuc3RhcnROb2RlLCBjYXJldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydE9mTWVudGlvbiA9IGZpbmRTdGFydE9mTWVudGlvbkluUGxhaW5UZXh0KFxuICAgICAgdGhpcy5fdmFsdWUsXG4gICAgICB0aGlzLm1hcmt1cFNlYXJjaCxcbiAgICAgIGNhcmV0UG9zaXRpb24sXG4gICAgICB0aGlzLmRpc3BsYXlUcmFuc2Zvcm0uYmluZCh0aGlzKSxcbiAgICApO1xuICAgIGlmIChjaGFyYWN0ZXJQcmVzc2VkID09PSB0aGlzLnRyaWdnZXJDaGFyKSB7XG4gICAgICB0aGlzLnNldHVwTWVudGlvbnNMaXN0KGNhcmV0UG9zaXRpb24pO1xuICAgIH0gZWxzZSBpZiAoc3RhcnRPZk1lbnRpb24uc3RhcnQgPT09IC0xICYmIHRoaXMuc3RhcnRQb3MgPj0gMCkge1xuICAgICAgaWYgKGNhcmV0UG9zaXRpb24gPD0gdGhpcy5zdGFydFBvcykge1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSAtMTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGtleUNvZGUgIT09IEtleS5TaGlmdCAmJlxuICAgICAgICAhZXZlbnQubWV0YUtleSAmJlxuICAgICAgICAhZXZlbnQuYWx0S2V5ICYmXG4gICAgICAgICFldmVudC5jdHJsS2V5ICYmXG4gICAgICAgIGNhcmV0UG9zaXRpb24gPiB0aGlzLnN0YXJ0UG9zXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5oYW5kbGVLZXlEb3duKGV2ZW50LCBjYXJldFBvc2l0aW9uLCBjaGFyYWN0ZXJQcmVzc2VkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNlbGVjdCh7IHRhcmdldDogdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50IH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGlzcGxheVRyYW5zZm9ybSguLi5fOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVwbGFjZUluZGV4ID0gdGhpcy5tYXJrdXBTZWFyY2guZ3JvdXBzW3RoaXMuZGlzcGxheU5hbWVdO1xuICAgIHJldHVybiBfW3JlcGxhY2VJbmRleF07XG4gIH1cblxuICBwcml2YXRlIF9mb3JtYXRNZW50aW9uKGNvbnRlbnRzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlcGxhY2VWYWx1ZSA9IGBcXCQke3RoaXMuZGlzcGxheU5hbWV9YDtcbiAgICBsZXQgcmVzdWx0ID0gY29udGVudHMucmVwbGFjZSh0aGlzLm1hcmt1cFNlYXJjaC5yZWdFeCwgcmVwbGFjZVZhbHVlKTtcbiAgICBsZXQgcmVwbGFjZUluZGV4O1xuICAgIGlmIChyZXN1bHQgPT09IHJlcGxhY2VWYWx1ZSkge1xuICAgICAgcmVwbGFjZUluZGV4ID0gYFxcJCR7dGhpcy5tYXJrdXBTZWFyY2guZ3JvdXBzW3RoaXMuZGlzcGxheU5hbWVdfWA7XG4gICAgICByZXN1bHQgPSBjb250ZW50cy5yZXBsYWNlKHRoaXMubWFya3VwU2VhcmNoLnJlZ0V4LCByZXBsYWNlSW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBub2luc3BlY3Rpb24gSlNNZXRob2RDYW5CZVN0YXRpY1xuICBwcml2YXRlIHN0b3BFdmVudChldmVudDogTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQgfCBGb2N1c0V2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldHVwTWVudGlvbnNMaXN0KGNhcmV0UG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc3RhcnRQb3MgPSBjYXJldFBvc2l0aW9uO1xuICAgIHRoaXMuc3RhcnROb2RlID0gd2luZG93LmdldFNlbGVjdGlvbigpLmFuY2hvck5vZGU7XG4gICAgdGhpcy5zZWFyY2hTdHJpbmcgPSAnJztcbiAgICB0aGlzLnN0b3BTZWFyY2ggPSBmYWxzZTtcbiAgICB0aGlzLnNob3dNZW50aW9uc0xpc3QoKTtcbiAgICB0aGlzLnVwZGF0ZU1lbnRpb25zTGlzdCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVLZXlEb3duKGV2ZW50OiBhbnksIGNhcmV0UG9zaXRpb246IG51bWJlciwgY2hhcmFjdGVyUHJlc3NlZDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgaWYgKGtleUNvZGUgPT09IEtleS5TcGFjZSkge1xuICAgICAgdGhpcy5zdGFydFBvcyA9IC0xO1xuICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5LkJhY2tzcGFjZSAmJiBjYXJldFBvc2l0aW9uID4gMCkge1xuICAgICAgY2FyZXRQb3NpdGlvbi0tO1xuICAgICAgaWYgKGNhcmV0UG9zaXRpb24gPT09IHRoaXMuc3RhcnRQb3MpIHtcbiAgICAgICAgdGhpcy5zdG9wU2VhcmNoID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSAhdGhpcy5zdG9wU2VhcmNoO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tZW50aW9uc0xpc3Quc2hvdykge1xuICAgICAgaWYgKGtleUNvZGUgPT09IEtleS5UYWIgfHwga2V5Q29kZSA9PT0gS2V5LkVudGVyKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlS2V5ZG93bk1lbnRpb25TZWxlY3Rpb24oZXZlbnQsIGNhcmV0UG9zaXRpb24pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtleS5Fc2NhcGUpIHtcbiAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RvcFNlYXJjaCA9IHRydWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5LkFycm93RG93bikge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNlbGVjdE5leHRJdGVtKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gS2V5LkFycm93VXApIHtcbiAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zZWxlY3RQcmV2aW91c0l0ZW0oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBLZXkuSG9tZSkge1xuICAgICAgICB0aGlzLnN0b3BFdmVudChldmVudCk7XG4gICAgICAgIHRoaXMubWVudGlvbnNMaXN0LnNlbGVjdEZpcnN0SXRlbSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEtleS5FbmQpIHtcbiAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLm1lbnRpb25zTGlzdC5zZWxlY3RMYXN0SXRlbSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGtleUNvZGUgPT09IEtleS5BcnJvd0xlZnQgfHwga2V5Q29kZSA9PT0gS2V5LkFycm93UmlnaHQgfHwga2V5Q29kZSA9PT0gS2V5LkhvbWUgfHwga2V5Q29kZSA9PT0gS2V5LkVuZCkge1xuICAgICAgdGhpcy5vblNlbGVjdChldmVudCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IG1lbnRpb24gPSB0aGlzLmRpc3BsYXlDb250ZW50LnN1YnN0cmluZyh0aGlzLnN0YXJ0UG9zICsgMSwgY2FyZXRQb3NpdGlvbik7XG4gICAgaWYgKGtleUNvZGUgIT09IEtleS5CYWNrc3BhY2UpIHtcbiAgICAgIG1lbnRpb24gKz0gY2hhcmFjdGVyUHJlc3NlZDtcbiAgICB9XG4gICAgdGhpcy5zZWFyY2hTdHJpbmcgPSBtZW50aW9uIHx8ICcnO1xuICAgIHRoaXMudXBkYXRlTWVudGlvbnNMaXN0KCk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZUtleWRvd25NZW50aW9uU2VsZWN0aW9uKGV2ZW50OiBhbnksIGNhcmV0UG9zaXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc3RvcEV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gZmFsc2U7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5fdmFsdWU7XG4gICAgY29uc3Qgc3RhcnQgPSBtYXBQbGFpblRleHRJbmRleCh2YWx1ZSwgdGhpcy5tYXJrdXBTZWFyY2gsIHRoaXMuc3RhcnRQb3MsIGZhbHNlLCB0aGlzLmRpc3BsYXlUcmFuc2Zvcm0uYmluZCh0aGlzKSk7XG4gICAgY29uc3QgaXRlbSA9IGV2ZW50Lml0ZW0gfHwgdGhpcy5tZW50aW9uc0xpc3Quc2VsZWN0ZWRJdGVtO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcmVwbGFjZVBsYWNlaG9sZGVycyhpdGVtLCB0aGlzLm1hcmt1cFNlYXJjaCk7XG4gICAgY29uc3QgbmV3RGlzcGxheVZhbHVlID0gdGhpcy5fZm9ybWF0TWVudGlvbihuZXdWYWx1ZSk7XG4gICAgY2FyZXRQb3NpdGlvbiA9IHRoaXMuc3RhcnRQb3MgKyBuZXdEaXNwbGF5VmFsdWUubGVuZ3RoO1xuICAgIGNvbnN0IHNlYXJjaFN0cmluZyA9IHRoaXMuc2VhcmNoU3RyaW5nIHx8ICcnO1xuICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIG5ld1ZhbHVlICsgdmFsdWUuc3Vic3RyaW5nKHN0YXJ0ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCArIDEsIHZhbHVlLmxlbmd0aCk7XG4gICAgdGhpcy5wYXJzZUxpbmVzKHZhbHVlKTtcbiAgICB0aGlzLnN0YXJ0UG9zID0gLTE7XG4gICAgdGhpcy5zZWFyY2hTdHJpbmcgPSAnJztcbiAgICB0aGlzLnN0b3BTZWFyY2ggPSB0cnVlO1xuICAgIHRoaXMubWVudGlvbnNMaXN0LnNob3cgPSBmYWxzZTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNldENhcmV0UG9zaXRpb24odGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LCBjYXJldFBvc2l0aW9uKTtcbiAgICAgIHRoaXMub25TZWxlY3QoeyB0YXJnZXQ6IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudCB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGlzcGxheVZhbHVlKGl0ZW06IGFueSk6IG51bGwgfCBzdHJpbmcge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH0gZWxzZSBpZiAoaXRlbVt0aGlzLmRpc3BsYXlOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaXRlbVt0aGlzLmRpc3BsYXlOYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd01lbnRpb25zTGlzdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWVudGlvbnNMaXN0KSB7XG4gICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXIuY3JlYXRlQ29tcG9uZW50KE5nTWVudGlvbnNMaXN0Q29tcG9uZW50KTtcbiAgICAgIHRoaXMubWVudGlvbnNMaXN0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuaXRlbVRlbXBsYXRlID0gdGhpcy5tZW50aW9uTGlzdFRlbXBsYXRlO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuZGlzcGxheVRyYW5zZm9ybSA9IHRoaXMuZGlzcGxheVRyYW5zZm9ybS5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuaXRlbVNlbGVjdGVkLnN1YnNjcmliZSgoaXRlbSkgPT4ge1xuICAgICAgICB0aGlzLnRleHRBcmVhSW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgY29uc3QgZmFrZUV2ZW50ID0geyB3aGljaDogS2V5LkVudGVyLCB3YXNTZWxlY3Rpb246IHRydWUsIGl0ZW0gfTtcbiAgICAgICAgdGhpcy5vbktleURvd24oZmFrZUV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5tZW50aW9uc0xpc3QuZGlzcGxheVRyYW5zZm9ybSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIHRoaXMubWVudGlvbnNMaXN0LnRleHRBcmVhRWxlbWVudCA9IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLm1lbnRpb25zTGlzdC5zaG93ID0gdHJ1ZTtcbiAgICB0aGlzLm1lbnRpb25zTGlzdC5kcm9wVXAgPSB0aGlzLmRyb3BVcDtcbiAgICB0aGlzLm1lbnRpb25zTGlzdC5hY3RpdmVJbmRleCA9IDA7XG4gICAgdGhpcy5tZW50aW9uc0xpc3QucG9zaXRpb24oKTtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gdGhpcy5tZW50aW9uc0xpc3QucmVzZXRTY3JvbGwoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZU1lbnRpb25zTGlzdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZVNlYXJjaCkge1xuICAgICAgbGV0IGl0ZW1zID0gQXJyYXkuZnJvbSh0aGlzLm1lbnRpb25zKTtcbiAgICAgIGlmICh0aGlzLnNlYXJjaFN0cmluZykge1xuICAgICAgICBjb25zdCBzZWFyY2hTdHJpbmcgPSB0aGlzLnNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBzZWFyY2hSZWdFeCA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKHNlYXJjaFN0cmluZyksICdpJyk7XG4gICAgICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldERpc3BsYXlWYWx1ZShpdGVtKTtcbiAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgc2VhcmNoUmVnRXgudGVzdCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5tYXhJdGVtcyA+IDApIHtcbiAgICAgICAgICBpdGVtcyA9IGl0ZW1zLnNsaWNlKDAsIHRoaXMubWF4SXRlbXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWVudGlvbnNMaXN0Lml0ZW1zID0gaXRlbXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VhcmNoLmVtaXQodGhpcy5zZWFyY2hTdHJpbmcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VNYXJrdXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWVudGlvbk1hcmt1cC5sZW5ndGggPT09IDAgfHwgdGhpcy5tZW50aW9uTWFya3VwWzBdICE9PSB0aGlzLnRyaWdnZXJDaGFyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG5nLW1lbnRpb25zIG1hcmt1cCBwYXR0ZXJuIG11c3Qgc3RhcnQgd2l0aCB0aGUgdHJpZ2dlciBjaGFyYWN0ZXIgXCIke3RoaXMudHJpZ2dlckNoYXJ9XCJgKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hcmt1cFNlYXJjaCA9IG1hcmt1cFRvUmVnRXhwKHRoaXMubWVudGlvbk1hcmt1cCk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlTGluZXModmFsdWU6IHN0cmluZyA9ICcnKTogdm9pZCB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl92YWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICAgIGNvbnN0IGxpbmVzID0gdmFsdWUuc3BsaXQodGhpcy5uZXdMaW5lKS5tYXAoKGxpbmU6IHN0cmluZykgPT4gdGhpcy5mb3JtYXRNZW50aW9ucyhsaW5lKSk7XG4gICAgICBjb25zdCBkaXNwbGF5Q29udGVudCA9IGxpbmVzLm1hcCgobGluZSkgPT4gbGluZS5jb250ZW50KS5qb2luKCdcXG4nKTtcbiAgICAgIGlmICh0aGlzLmRpc3BsYXlDb250ZW50ICE9PSBkaXNwbGF5Q29udGVudCkge1xuICAgICAgICB0aGlzLmxpbmVzID0gbGluZXM7XG4gICAgICAgIHRoaXMuZGlzcGxheUNvbnRlbnQgPSBkaXNwbGF5Q29udGVudDtcbiAgICAgICAgdGhpcy50cmlnZ2VyQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdE1lbnRpb25zKGxpbmU6IHN0cmluZyk6IExpbmUge1xuICAgIGNvbnN0IGxpbmVPYmo6IExpbmUgPSA8TGluZT57IG9yaWdpbmFsQ29udGVudDogbGluZSwgY29udGVudDogbGluZSwgcGFydHM6IFtdIH07XG5cbiAgICBpZiAobGluZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBsaW5lT2JqO1xuICAgIH1cblxuICAgIGxldCBtZW50aW9uO1xuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgY29uc3QgcmVnRXggPSB0aGlzLm1hcmt1cFNlYXJjaC5yZWdFeDtcbiAgICByZWdFeC5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobWVudGlvbiA9IHJlZ0V4LmV4ZWMobGluZSkpICE9PSBudWxsKSB7XG4gICAgICB0YWdzLnB1c2goeyBpbmRpY2VzOiB7IHN0YXJ0OiBtZW50aW9uLmluZGV4LCBlbmQ6IG1lbnRpb24uaW5kZXggKyBtZW50aW9uWzBdLmxlbmd0aCB9IH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZUYWdzOiBUYWdbXSA9IFtdO1xuICAgIGxldCBjb250ZW50ID0gJyc7XG4gICAgWy4uLnRhZ3NdXG4gICAgICAuc29ydCgodGFnQSwgdGFnQikgPT4gdGFnQS5pbmRpY2VzLnN0YXJ0IC0gdGFnQi5pbmRpY2VzLnN0YXJ0KVxuICAgICAgLmZvckVhY2goKHRhZzogVGFnKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTGVuZ3RoID0gdGFnLmluZGljZXMuZW5kIC0gdGFnLmluZGljZXMuc3RhcnQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRzID0gbGluZS5zbGljZSh0YWcuaW5kaWNlcy5zdGFydCwgdGFnLmluZGljZXMuZW5kKTtcbiAgICAgICAgaWYgKGNvbnRlbnRzLmxlbmd0aCA9PT0gZXhwZWN0ZWRMZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBwcmV2SW5kZXggPSBwcmV2VGFncy5sZW5ndGggPiAwID8gcHJldlRhZ3NbcHJldlRhZ3MubGVuZ3RoIC0gMV0uaW5kaWNlcy5lbmQgOiAwO1xuICAgICAgICAgIGNvbnN0IGJlZm9yZSA9IGxpbmUuc2xpY2UocHJldkluZGV4LCB0YWcuaW5kaWNlcy5zdGFydCk7XG4gICAgICAgICAgY29uc3QgcGFydE1lbnRpb24gPSA8TWVudGlvbj57IGNvbnRlbnRzLCB0YWcgfTtcbiAgICAgICAgICBsaW5lT2JqLnBhcnRzLnB1c2goYmVmb3JlKTtcbiAgICAgICAgICBsaW5lT2JqLnBhcnRzLnB1c2gocGFydE1lbnRpb24pO1xuICAgICAgICAgIHByZXZUYWdzLnB1c2godGFnKTtcbiAgICAgICAgICBjb250ZW50ICs9IGJlZm9yZSArIHRoaXMuZm9ybWF0TWVudGlvbihwYXJ0TWVudGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgcmVtYWluaW5nU3RhcnQgPSBwcmV2VGFncy5sZW5ndGggPiAwID8gcHJldlRhZ3NbcHJldlRhZ3MubGVuZ3RoIC0gMV0uaW5kaWNlcy5lbmQgOiAwO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IGxpbmUuc2xpY2UocmVtYWluaW5nU3RhcnQpO1xuICAgIGxpbmVPYmoucGFydHMucHVzaChyZW1haW5pbmcpO1xuICAgIGNvbnRlbnQgKz0gcmVtYWluaW5nO1xuICAgIGxpbmVPYmouY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICByZXR1cm4gbGluZU9iajtcbiAgfVxuXG4gIHByaXZhdGUgYWRkSW5wdXRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2lucHV0TGlzdGVuZXIgJiYgdGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudCkge1xuICAgICAgdGhpcy5faW5wdXRMaXN0ZW5lciA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdGhpcy5vbktleURvd24oZXZlbnQpO1xuICAgICAgaWYgKHRoaXMubW9iaWxlKSB7XG4gICAgICAgIHRoaXMuX2lucHV0TGlzdGVuZXIgPSAoZXZlbnQ6IElucHV0RXZlbnQpID0+IHRoaXMub25JbnB1dChldmVudCk7XG4gICAgICB9XG4gICAgICAodGhpcy50ZXh0QXJlYUlucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICB0aGlzLm1vYmlsZSA/ICdpbnB1dCcgOiAna2V5ZG93bicsXG4gICAgICAgIHRoaXMuX2lucHV0TGlzdGVuZXIsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaFN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMudGV4dEFyZWFJbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBjb21wdXRlZFN0eWxlOiBhbnkgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgIHRoaXMuaGlnaGxpZ2h0ZXJTdHlsZSA9IHt9O1xuICAgIHN0eWxlUHJvcGVydGllcy5mb3JFYWNoKChwcm9wKSA9PiAodGhpcy5oaWdobGlnaHRlclN0eWxlW3Byb3BdID0gY29tcHV0ZWRTdHlsZVtwcm9wXSkpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmlnZ2VyQ2hhbmdlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMudmFsdWVDaGFuZ2VzLmVtaXQodGhpcy5fdmFsdWUpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG59XG4iXX0=