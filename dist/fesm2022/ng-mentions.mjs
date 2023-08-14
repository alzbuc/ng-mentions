import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Directive, Input, EventEmitter, Component, ViewEncapsulation, Output, ContentChildren, HostListener, ViewChild, HostBinding, TemplateRef, ContentChild, forwardRef, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as i2 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const styleProperties = Object.freeze([
    'direction',
    'boxSizing',
    'width',
    'height',
    'minHeight',
    'minWidth',
    'overflowX',
    'overflowY',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',
    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',
    'letterSpacing',
    'wordSpacing',
    'tabSize',
    'MozTabSize',
]);
const isBrowser = typeof window !== 'undefined';
const isFirefox = isBrowser && window.mozInnerScreenX != null;
// eslint-disable-next-line max-len
const mobileRegEx = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
// eslint-disable-next-line max-len
const mobileRegEx2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
function isMobileOrTablet() {
    const agent = navigator.userAgent || navigator.vendor || window.opera;
    return mobileRegEx.test(agent) || mobileRegEx2.test(agent.substr(0, 4));
}
function isInputOrTextAreaElement(element) {
    return (element !== null &&
        (element.nodeName.toUpperCase() === 'INPUT' ||
            element.nodeName.toUpperCase() === 'TEXTAREA' ||
            element.nodeName === '#text'));
}
function spliceString(value, start, end, insert) {
    return value.substring(0, start) + insert + value.substring(end) + '';
}
function iterateMentionsMarkup(value, mentionMarkup, textIterator, markupIterator, displayTransform) {
    let match;
    let start = 0;
    let currentPlainTextIndex = 0;
    const regEx = mentionMarkup.regEx;
    regEx.lastIndex = 0;
    while ((match = regEx.exec(value)) !== null) {
        const display = displayTransform(...match);
        const substr = value.substring(start, match.index);
        textIterator(substr, start, currentPlainTextIndex);
        currentPlainTextIndex += substr.length;
        markupIterator(match[0], match.index, currentPlainTextIndex, display);
        currentPlainTextIndex += display.length;
        start = regEx.lastIndex;
    }
    if (start < value.length) {
        textIterator(value.substring(start), start, currentPlainTextIndex);
    }
}
function iterateOnlyMentionsMarkup(value, mentionMarkup, markupIterator, displayTransform) {
    let match;
    let start = 0;
    let currentPlainTextIndex = 0;
    const regEx = mentionMarkup.regEx;
    regEx.lastIndex = 0;
    while ((match = regEx.exec(value)) !== null) {
        const display = displayTransform(...match);
        const substr = value.substring(start, match.index);
        currentPlainTextIndex += substr.length;
        markupIterator(match[0], match.index, currentPlainTextIndex, display);
        currentPlainTextIndex += display.length;
        start = regEx.lastIndex;
    }
}
function mapPlainTextIndex(value, mentionMarkup, indexInPlainText, toEndOfMarkup, displayTransform) {
    if (isNaN(indexInPlainText)) {
        return indexInPlainText;
    }
    let result;
    const textIterator = (matchString, index, substringPlainTextIndex) => {
        if (typeof result !== 'undefined') {
            return;
        }
        if (substringPlainTextIndex + matchString.length >= indexInPlainText) {
            result = index + indexInPlainText - substringPlainTextIndex;
        }
    };
    const markupIterator = (matchString, index, mentionPlainTextIndex, display) => {
        if (typeof result !== 'undefined') {
            return;
        }
        if (mentionPlainTextIndex + display.length > indexInPlainText) {
            result = index + (toEndOfMarkup ? matchString.length : 0);
        }
    };
    iterateMentionsMarkup(value, mentionMarkup, textIterator, markupIterator, displayTransform);
    return typeof result !== 'undefined' ? result : value.length;
}
function getCaretPosition(element) {
    if (isInputOrTextAreaElement(element)) {
        const value = element.value;
        return value.slice(0, element.selectionStart).length - (isMobileOrTablet() ? 1 : 0);
    }
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return range.startOffset;
    }
    return 0;
}
function getCaretCoordinates(element, position) {
    let coords = { top: 0, left: 0 };
    if (!isBrowser) {
        return coords;
    }
    const div = document.createElement('div');
    document.body.appendChild(div);
    const style = div.style;
    const computed = getElementStyle(element);
    style.whiteSpace = 'pre-wrap';
    if (element.nodeName !== 'INPUT') {
        style.wordWrap = 'break-word';
    }
    style.position = 'absolute';
    style.visibility = 'hidden';
    styleProperties.forEach((prop) => (style[prop] = computed[prop]));
    if (isFirefox) {
        if (element.scrollHeight > parseInt(computed.height, 10)) {
            style.overflowY = 'scroll';
        }
    }
    else {
        style.overflow = 'hidden';
    }
    div.textContent = element.value.substring(0, position);
    if (element.nodeName === 'INPUT') {
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');
    }
    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);
    let scrollTop = 0;
    if (element.scrollTop > 0) {
        scrollTop = element.scrollTop;
    }
    coords = {
        top: span.offsetTop + parseInt(computed['borderTopWidth'], 10) - scrollTop,
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'], 10),
    };
    document.body.removeChild(div);
    return coords;
}
function getElementStyle(element, property) {
    const style = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;
    if (property && typeof property === 'string' && typeof style[property] !== 'undefined') {
        return style[property];
    }
    else if (property && typeof property === 'string') {
        return null;
    }
    return style;
}
function setCaretPosition(element, position) {
    if (isInputOrTextAreaElement(element) && element.selectionStart !== undefined) {
        element.focus();
        element.setSelectionRange(position, position);
        element.selectionStart = position;
    }
    else {
        const range = document.createRange();
        range.setStart(element, position);
        range.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function markupToRegExp(markup) {
    const placeholderRegExp = /__([\w]+)__/g;
    const placeholderExclusion = '^\\)\\]';
    let markupPattern = escapeRegExp(markup);
    const placeholders = {};
    let match;
    let i = 1;
    do {
        match = placeholderRegExp.exec(markupPattern);
        if (match) {
            const placeholder = match[1];
            markupPattern = markupPattern.replace(`__${placeholder}__`, `([${placeholderExclusion}]+)`);
            placeholders[placeholder] = ++i;
        }
    } while (match);
    return { markup, regEx: new RegExp('(' + markupPattern + ')', 'ig'), groups: placeholders };
}
function getPlainText(value, mentionMarkup, displayTransform) {
    mentionMarkup.regEx.lastIndex = 0;
    return value.replace(mentionMarkup.regEx, displayTransform);
}
function replacePlaceholders(item, markupMention) {
    let result = markupMention.markup + '';
    Object.keys(markupMention.groups).forEach((key) => (result = result.replace(new RegExp(`__${key}__`, 'g'), typeof item === 'string' ? item : item[key])));
    return result;
}
function applyChangeToValue(value, markupMention, plainTextValue, selectionStartBeforeChange = 0, selectionEndBeforeChange = 0, selectionEndAfterChange = 0, displayTransform) {
    const oldPlainTextValue = getPlainText(value, markupMention, displayTransform);
    const lengthDelta = oldPlainTextValue.length - plainTextValue.length;
    /** fix issue when first character changing **/
    /*  if (!selectionStartBeforeChange) {
        selectionStartBeforeChange = selectionEndBeforeChange + lengthDelta;
      }
      if (!selectionEndBeforeChange) {
        selectionEndBeforeChange = selectionStartBeforeChange;
      }*/
    if (selectionStartBeforeChange === selectionEndBeforeChange &&
        selectionEndBeforeChange === selectionEndAfterChange &&
        oldPlainTextValue.length === plainTextValue.length) {
        selectionStartBeforeChange--;
    }
    const insert = plainTextValue.slice(selectionStartBeforeChange, selectionEndAfterChange);
    const spliceStart = Math.min(selectionStartBeforeChange, selectionEndAfterChange);
    let spliceEnd = selectionEndBeforeChange;
    if (selectionStartBeforeChange === selectionEndAfterChange) {
        spliceEnd = Math.max(selectionEndBeforeChange, selectionStartBeforeChange + lengthDelta);
    }
    return spliceString(value, mapPlainTextIndex(value, markupMention, spliceStart, false, displayTransform), mapPlainTextIndex(value, markupMention, spliceEnd, true, displayTransform), insert);
}
function findStartOfMentionInPlainText(value, mentionMarkup, indexInPlainText, displayTransform) {
    let result = { start: -1, end: -1 };
    const markupIterator = (matchString, index, mentionPlainTextIndex, display) => {
        if (mentionPlainTextIndex < indexInPlainText && mentionPlainTextIndex + display.length > indexInPlainText) {
            result = { start: mentionPlainTextIndex, end: mentionPlainTextIndex + display.length };
            return true;
        }
        return false;
    };
    iterateOnlyMentionsMarkup(value, mentionMarkup, markupIterator, displayTransform);
    return result;
}
function getBoundsOfMentionAtPosition(value, mentionMarkup, indexInPlainText, displayTransform) {
    return findStartOfMentionInPlainText(value, mentionMarkup, indexInPlainText, displayTransform);
}
function escapeHtml(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function isCoordinateWithinRect(rect, x, y) {
    return rect.left < x && x < rect.right && rect.top < y && y < rect.bottom;
}
class Highlighted {
    element;
    type;
    constructor(element, type = null) {
        this.element = element;
        this.type = type;
    }
    get clientRect() {
        return this.element.getBoundingClientRect();
    }
}

/**
 * The Highlighted Pattern Directive
 */
class NgHighlighterPatternDirective {
    /**
     * Optional. CSS Class that will be added to the highlighted element.
     */
    className;
    /**
     * The markup used to format a mention
     */
    markup;
    /**
     * This can either be the name of the item taken from part of the markup, or it
     * can be a fully formed HTML markup with RegExp placers.
     * Optionally, this can also be a custom function that can be used to format the matched text
     * and returned to be displayed. No other transformation will be done to the text and no
     * matching information is passed the to function, just the matched text.
     */
    markupReplace;
    markupMention;
    ngOnInit() {
        if (this.markup) {
            this.markupMention = markupToRegExp(this.markup);
        }
    }
    ngOnChanges(changes) {
        if ('markup' in changes) {
            this.markupMention = markupToRegExp(this.markup);
        }
    }
    match(value) {
        return this.markupMention ? this.markupMention.regEx.exec(value) : null;
    }
    format = (content) => {
        if (typeof this.markupReplace === 'string') {
            let result;
            const replaceTries = [
                this.markupReplace,
                `\$${this.markupReplace}`,
                `\$${this.markupMention.groups[this.markupReplace]}`,
            ];
            for (const attempt of replaceTries) {
                result = content.replace(this.markupMention.regEx, attempt);
                if (result !== attempt) {
                    break;
                }
            }
            return result;
        }
        else if (typeof this.markupReplace === 'function') {
            return this.markupReplace(content);
        }
        return content;
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgHighlighterPatternDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.7", type: NgHighlighterPatternDirective, selector: "ng-highlighter-pattern", inputs: { className: "className", markup: "markup", markupReplace: "markupReplace" }, exportAs: ["ngHighlighterPattern"], usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgHighlighterPatternDirective, decorators: [{
            type: Directive,
            args: [{ exportAs: 'ngHighlighterPattern', selector: 'ng-highlighter-pattern' }]
        }], propDecorators: { className: [{
                type: Input
            }], markup: [{
                type: Input
            }], markupReplace: [{
                type: Input
            }] } });

/**
 * The Highlighted Value
 */
class NgHighlightedValue {
    /**
     * Content of the highlighted item that was clicked
     */
    content;
    /**
     * The type (or class name) associated with the highlighted item that was clicked.
     *
     * @see NgHighlighterPatternDirective.className
     */
    type = null;
    /**
     * Optional. Arbitrary rel associated with the clicked highlighted element.
     * This is determined by how the highlighted item's content is formatted.
     */
    rel = null;
    constructor(content, type = null, rel = null) {
        this.content = content;
        this.type = type;
        this.rel = rel;
    }
}

/**
 * The Highlighter Component
 */
class NgHighlighterComponent {
    element;
    cdr;
    /**
     * Text value to be highlighted
     */
    text;
    /**
     * Event emitted when a highlighted item it clicked
     */
    itemClick = new EventEmitter();
    patterns;
    newLine = /\n/g;
    lines = [];
    highlightedElements = [];
    constructor(element, cdr) {
        this.element = element;
        this.cdr = cdr;
    }
    ngOnChanges(changes) {
        if ('text' in changes) {
            this.parseLines();
        }
    }
    ngAfterContentInit() {
        if (this.text && this.patterns) {
            this.parseLines();
        }
    }
    onItemClick(event) {
        const matchedElement = this.getMatchedElement(event);
        if (matchedElement) {
            event.preventDefault();
            event.stopPropagation();
            const content = matchedElement.element.innerText;
            let rel = matchedElement.element.getAttribute('rel') || null;
            const relElement = matchedElement.element.querySelector('[rel]');
            if (relElement) {
                rel = relElement.getAttribute('rel') || null;
            }
            this.itemClick.emit(new NgHighlightedValue(content, matchedElement.type, rel));
        }
    }
    parseLines() {
        this.lines = this.text.split(this.newLine).map((line) => this.highlight(line));
        this.cdr.detectChanges();
        this.collectHighlightedItems();
    }
    highlight(line) {
        if (line.length === 0 || !this.patterns) {
            return '&nbsp;';
        }
        const tags = [];
        let match;
        this.patterns.forEach((pattern) => {
            while ((match = pattern.match(line)) !== null) {
                tags.push({
                    type: pattern.className,
                    indices: { start: match.index, end: match.index + match[0].length },
                    formatter: pattern.format,
                });
            }
        });
        const prevTags = [];
        const parts = [];
        [...tags]
            .sort((tagA, tagB) => tagA.indices.start - tagB.indices.start)
            .forEach((tag) => {
            const expectedLength = tag.indices.end - tag.indices.start;
            const contents = line.slice(tag.indices.start, tag.indices.end);
            if (contents.length === expectedLength) {
                const prevIndex = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
                const before = line.slice(prevIndex, tag.indices.start);
                parts.push(escapeHtml(before));
                parts.push(`<span class="highlighted ${tag.type || ''}" rel="${tag.type}">${tag.formatter(contents)}</span>`);
                prevTags.push(tag);
            }
        });
        const remainingStart = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
        const remaining = line.slice(remainingStart);
        parts.push(escapeHtml(remaining));
        parts.push('&nbsp;');
        return parts.join('');
    }
    getMatchedElement(event) {
        const matched = this.highlightedElements.find((el) => isCoordinateWithinRect(el.clientRect, event.clientX, event.clientY));
        return matched ? matched : null;
    }
    collectHighlightedItems() {
        this.highlightedElements = Array.from(this.element.nativeElement.getElementsByClassName('highlighted')).map((element) => {
            const type = element.getAttribute('rel') || null;
            return new Highlighted(element, type);
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgHighlighterComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.7", type: NgHighlighterComponent, selector: "ng-highlighter", inputs: { text: "text" }, outputs: { itemClick: "itemClick" }, host: { listeners: { "click": "onItemClick($event)" } }, queries: [{ propertyName: "patterns", predicate: NgHighlighterPatternDirective }], exportAs: ["ngHighlighter"], usesOnChanges: true, ngImport: i0, template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>', isInline: true, dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgHighlighterComponent, decorators: [{
            type: Component,
            args: [{
                    exportAs: 'ngHighlighter',
                    selector: 'ng-highlighter',
                    template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>',
                    preserveWhitespaces: false,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { text: [{
                type: Input
            }], itemClick: [{
                type: Output
            }], patterns: [{
                type: ContentChildren,
                args: [NgHighlighterPatternDirective]
            }], onItemClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-shadow
var Key;
(function (Key) {
    Key[Key["Backspace"] = 8] = "Backspace";
    Key[Key["Tab"] = 9] = "Tab";
    Key[Key["Enter"] = 13] = "Enter";
    Key[Key["Shift"] = 16] = "Shift";
    Key[Key["Escape"] = 27] = "Escape";
    Key[Key["Space"] = 32] = "Space";
    Key[Key["End"] = 35] = "End";
    Key[Key["Home"] = 36] = "Home";
    Key[Key["ArrowLeft"] = 37] = "ArrowLeft";
    Key[Key["ArrowUp"] = 38] = "ArrowUp";
    Key[Key["ArrowRight"] = 39] = "ArrowRight";
    Key[Key["ArrowDown"] = 40] = "ArrowDown";
})(Key || (Key = {}));

class NgMentionsListComponent {
    items;
    itemTemplate;
    displayTransform;
    textAreaElement;
    activeIndex = -1;
    itemSelected = new EventEmitter();
    defaultItemTemplate;
    list;
    show = false;
    dropUp = false;
    _top = 0;
    _left = 0;
    get top() {
        return this._top + this.adjustTop + 'px';
    }
    get left() {
        return this._left + 'px';
    }
    get noItems() {
        return !Array.isArray(this.items) || this.items.length === 0;
    }
    get selectedItem() {
        return this.activeIndex >= 0 && this.items[this.activeIndex] !== undefined ? this.items[this.activeIndex] : null;
    }
    ngOnInit() {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    }
    onItemClick(event, activeIndex, item) {
        event.preventDefault();
        if (item) {
            this.activeIndex = activeIndex;
            this.itemSelected.emit(item);
        }
    }
    selectFirstItem() {
        this.activeIndex = 0;
        this.resetScroll();
    }
    selectPreviousItem() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
        this.scrollToActiveItem();
    }
    selectNextItem() {
        if (this.activeIndex < this.items.length - 1) {
            this.activeIndex++;
            this.scrollToActiveItem();
        }
    }
    selectLastItem() {
        this.activeIndex = this.items.length > 0 ? this.items.length - 1 : 0;
        this.scrollToActiveItem();
    }
    position() {
        const element = this.textAreaElement;
        const coords = getCaretCoordinates(element, element.selectionStart);
        this._top = coords.top;
        this._left = coords.left + element.offsetLeft;
        this.list.nativeElement.scrollTop = 0;
    }
    resetScroll() {
        this.list.nativeElement.scrollTop = 0;
    }
    transformItem(item) {
        return this.displayTransform(item) || item;
    }
    get adjustTop() {
        let adjust = 0;
        if (!this.dropUp) {
            const computedFontSize = getElementStyle(this.textAreaElement, 'fontSize');
            adjust = parseInt(computedFontSize, 10) + this.textAreaElement.offsetTop;
        }
        return adjust;
    }
    scrollToActiveItem() {
        const element = this.list.nativeElement;
        if (this.activeIndex === 0) {
            element.scrollTop = 0;
        }
        else {
            const activeElement = element.querySelector('li.active');
            if (activeElement) {
                element.scrollTop = activeElement.offsetTop;
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.7", type: NgMentionsListComponent, selector: "mentions-list", host: { properties: { "class.show": "this.show", "class.drop-up": "this.dropUp", "style.top": "this.top", "style.left": "this.left", "class.no-items": "this.noItems" } }, viewQueries: [{ propertyName: "defaultItemTemplate", first: true, predicate: ["defaultItemTemplate"], descendants: true, static: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{ transformItem(item) }}
    </ng-template>
    <ul #list class="dropdown-menu scrollable-menu">
      <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
        <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
          <ng-template
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{ item: item, index: i }"
          ></ng-template>
        </a>
      </li>
    </ul>
  `, isInline: true, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mentions-list', template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{ transformItem(item) }}
    </ng-template>
    <ul #list class="dropdown-menu scrollable-menu">
      <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
        <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
          <ng-template
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{ item: item, index: i }"
          ></ng-template>
        </a>
      </li>
    </ul>
  `, encapsulation: ViewEncapsulation.None, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"] }]
        }], propDecorators: { defaultItemTemplate: [{
                type: ViewChild,
                args: ['defaultItemTemplate', { static: true }]
            }], list: [{
                type: ViewChild,
                args: ['list', { static: true }]
            }], show: [{
                type: HostBinding,
                args: ['class.show']
            }], dropUp: [{
                type: HostBinding,
                args: ['class.drop-up']
            }], top: [{
                type: HostBinding,
                args: ['style.top']
            }], left: [{
                type: HostBinding,
                args: ['style.left']
            }], noItems: [{
                type: HostBinding,
                args: ['class.no-items']
            }] } });

class HighlightedDirective {
    tag;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: HighlightedDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.7", type: HighlightedDirective, selector: "highlighted", inputs: { tag: "tag" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: HighlightedDirective, decorators: [{
            type: Directive,
            args: [{ selector: 'highlighted' }]
        }], propDecorators: { tag: [{
                type: Input
            }] } });

// eslint-disable-next-line no-shadow
var InputToKeyboard;
(function (InputToKeyboard) {
    InputToKeyboard[InputToKeyboard["deleteContentBackward"] = 8] = "deleteContentBackward";
    InputToKeyboard[InputToKeyboard["insertLineBreak"] = 13] = "insertLineBreak";
})(InputToKeyboard || (InputToKeyboard = {}));
/**
 * The Mentions Component
 */
class NgMentionsComponent {
    element;
    viewContainer;
    changeDetector;
    ngZone;
    /**
     * The character to trigger the mentions list when a user is typing in the input field
     */
    triggerChar = '@';
    /**
     * The markup used to format a mention in the model value
     */
    mentionMarkup = '@[__display__](__type__:__id__)';
    /**
     * Optional. When using a custom search (i.e. an API call), the internal searching capability should be disabled.
     */
    disableSearch = false;
    /**
     * Only used when internal search is not disabled. This limits the maximum number of items to display in the search
     * result list.
     */
    maxItems = -1;
    /**
     * Used to cause the search result list to display in a "drop up" fashion, instead of a typical dropdown.
     */
    dropUp = false;
    /**
     * If the supplied mentions are a list of objects, this is the name of the property used to display
     * the mention in the search result list and when formatting a mention in the displayed text.
     */
    displayName = 'display';
    placeholder;
    /**
     * An event emitted, after the trigger character has been typed, with the user-entered search string.
     */
    search = new EventEmitter();
    valueChanges = new EventEmitter();
    stateChanges = new Subject();
    mentionListTemplate;
    textAreaInputElement;
    highlighterElement;
    displayContent = '';
    lines = [];
    highlighterStyle = {};
    textAreaClassNames = {};
    selectionStart;
    selectionEnd;
    mentions = [];
    _value = '';
    _required;
    _disabled;
    _rows = 1;
    _columns = 20;
    searchString;
    startPos;
    startNode;
    mentionsList;
    stopSearch = false;
    markupSearch;
    _destroyed = new Subject();
    newLine = /\n/g;
    _errorState = false;
    _inputListener;
    mobile = isMobileOrTablet();
    lastChar;
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
    saveLastChar(event) {
        if (event.key !== 'Shift') {
            this.lastChar = event;
        }
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
        if (this.lastChar.key === 'Dead') {
            this.selectionStart--;
        }
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsComponent, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.7", type: NgMentionsComponent, selector: "ng-mentions", inputs: { triggerChar: "triggerChar", mentionMarkup: ["markup", "mentionMarkup"], disableSearch: "disableSearch", maxItems: "maxItems", dropUp: "dropUp", displayName: "displayName", placeholder: "placeholder", formClass: "formClass", value: "value", required: "required", disabled: "disabled", rows: "rows", columns: ["cols", "columns"], mentionItems: ["mentions", "mentionItems"] }, outputs: { search: "search", valueChanges: "valueChanges", stateChanges: "stateChanges" }, host: { listeners: { "window:resize": "onWindowResize()" } }, queries: [{ propertyName: "mentionListTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "textAreaInputElement", first: true, predicate: ["input"], descendants: true, static: true }, { propertyName: "highlighterElement", first: true, predicate: ["highlighter"], descendants: true, static: true }], exportAs: ["ngMentions"], usesOnChanges: true, ngImport: i0, template: `
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
      (keyup)="saveLastChar($event)"
      (ngModelChange)="onChange($event)"
      (scroll)="onTextAreaScroll()"
      [disabled]="disabled"
      [required]="required"
      [placeholder]="placeholder"
    ></textarea>
  `, isInline: true, styles: ["ng-mentions{position:relative;display:inline-block}ng-mentions textarea{position:relative;background-color:transparent!important}ng-mentions .highlighter{position:absolute;top:0;left:0;right:0;bottom:0;color:transparent;overflow:hidden!important}ng-mentions highlighted{display:inline;border-radius:3px;padding:1px;margin:-1px;overflow-wrap:break-word;background-color:#add8e6}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: HighlightedDirective, selector: "highlighted", inputs: ["tag"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsComponent, decorators: [{
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
      (keyup)="saveLastChar($event)"
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

/**
 * The NgMentionsAccessorDirective directive is used to indicate the input element.
 */
class NgMentionsAccessorDirective {
    element;
    host;
    _onChange;
    _onTouch;
    _destroyed = new Subject();
    constructor(element, host) {
        this.element = element;
        this.host = host;
    }
    ngOnInit() {
        this.host.valueChanges.pipe(takeUntil(this._destroyed)).subscribe((value) => this.onChange(value));
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouch = fn;
    }
    setDisabledState(isDisabled) {
        this.host.disabled = isDisabled;
    }
    writeValue(value) {
        if (typeof value === 'string' || value === null) {
            this.host.value = value;
        }
    }
    onChange(value) {
        if (this._onChange && typeof value !== 'object') {
            this._onChange(value);
        }
    }
    onTouched() {
        if (this._onTouch) {
            this._onTouch();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsAccessorDirective, deps: [{ token: i0.ElementRef }, { token: NgMentionsComponent }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.7", type: NgMentionsAccessorDirective, selector: "ng-mentions", host: { listeners: { "change": "onChange($event)", "touch": "onTouched()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }], exportAs: ["ngMentions"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsAccessorDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngMentions',
                    selector: 'ng-mentions',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: NgMentionsComponent }]; }, propDecorators: { onChange: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], onTouched: [{
                type: HostListener,
                args: ['touch']
            }] } });

const EXPORT_DIRECTIVES = [
    NgMentionsComponent,
    NgMentionsAccessorDirective,
    NgHighlighterComponent,
    NgHighlighterPatternDirective,
];
const DECLARATIONS = [
    NgMentionsComponent,
    NgMentionsAccessorDirective,
    NgMentionsListComponent,
    HighlightedDirective,
    NgHighlighterComponent,
    NgHighlighterPatternDirective,
];
class NgMentionsModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsModule, declarations: [NgMentionsComponent,
            NgMentionsAccessorDirective,
            NgMentionsListComponent,
            HighlightedDirective,
            NgHighlighterComponent,
            NgHighlighterPatternDirective], imports: [CommonModule, FormsModule], exports: [NgMentionsComponent,
            NgMentionsAccessorDirective,
            NgHighlighterComponent,
            NgHighlighterPatternDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsModule, imports: [CommonModule, FormsModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: NgMentionsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule],
                    exports: EXPORT_DIRECTIVES,
                    declarations: DECLARATIONS,
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { NgHighlighterComponent, NgHighlighterPatternDirective, NgMentionsAccessorDirective, NgMentionsComponent, NgMentionsModule };
//# sourceMappingURL=ng-mentions.mjs.map
