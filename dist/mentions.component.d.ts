import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, ComponentFactoryResolver, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Line, Mention } from './util/interfaces';
import { NgMentionsListComponent } from './util/mentions-list.component';
import * as i0 from "@angular/core";
/**
 * The Mentions Component
 */
export declare class NgMentionsComponent implements OnChanges, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    private element;
    private componentResolver;
    private viewContainer;
    private changeDetector;
    private ngZone;
    /**
     * The character to trigger the mentions list when a user is typing in the input field
     */
    triggerChar: string;
    /**
     * The markup used to format a mention in the model value
     */
    mentionMarkup: string;
    /**
     * Optional. When using a custom search (i.e. an API call), the internal searching capability should be disabled.
     */
    disableSearch: boolean;
    /**
     * Only used when internal search is not disabled. This limits the maximum number of items to display in the search
     * result list.
     */
    maxItems: number;
    /**
     * Used to cause the search result list to display in a "drop up" fashion, instead of a typical dropdown.
     */
    dropUp: boolean;
    /**
     * If the supplied mentions are a list of objects, this is the name of the property used to display
     * the mention in the search result list and when formatting a mention in the displayed text.
     */
    displayName: string;
    placeholder: string;
    /**
     * An event emitted, after the trigger character has been typed, with the user-entered search string.
     */
    readonly search: EventEmitter<string>;
    readonly valueChanges: EventEmitter<string>;
    readonly stateChanges: Subject<void>;
    mentionListTemplate: TemplateRef<any>;
    textAreaInputElement: ElementRef;
    highlighterElement: ElementRef;
    displayContent: string;
    lines: Line[];
    highlighterStyle: {
        [key: string]: string;
    };
    textAreaClassNames: {
        [key: string]: boolean;
    };
    selectionStart: number;
    selectionEnd: number;
    mentions: any[];
    private _value;
    private _required;
    private _disabled;
    private _rows;
    private _columns;
    private searchString;
    private startPos;
    private startNode;
    mentionsList: NgMentionsListComponent;
    private stopSearch;
    private markupSearch;
    private _destroyed;
    private newLine;
    private _errorState;
    private _inputListener;
    private mobile;
    /**
     * Classes for textarea
     */
    get formClass(): string;
    set formClass(classNames: string);
    get value(): string;
    set value(value: string);
    get required(): boolean;
    set required(value: boolean);
    get disabled(): boolean;
    set disabled(value: boolean);
    /**
     * Number of rows for the textarea. Defaults to 1
     */
    get rows(): number | string;
    set rows(value: number | string);
    /**
     * Number of columns for the textarea. Defaults to 1
     */
    get columns(): number | string;
    set columns(value: number | string);
    /**
     * The list of mentions to display, or filter, in the search result list.
     */
    set mentionItems(value: any[]);
    get readonly(): string;
    get errorState(): boolean;
    constructor(element: ElementRef, componentResolver: ComponentFactoryResolver, viewContainer: ViewContainerRef, changeDetector: ChangeDetectorRef, ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    onWindowResize(): void;
    onTextAreaScroll(): void;
    open(): void;
    onSelect(event: any): void;
    onChange(newPlainTextValue: string): void;
    onInput(event: InputEvent): void;
    onKeyDown(event: any): void;
    onBlur(event: MouseEvent | KeyboardEvent | FocusEvent): void;
    isPartMention(part: any): boolean;
    formatMention(mention: Mention): string;
    private handleInput;
    private displayTransform;
    private _formatMention;
    private stopEvent;
    private setupMentionsList;
    private handleKeyDown;
    private getDisplayValue;
    private showMentionsList;
    private updateMentionsList;
    private parseMarkup;
    private parseLines;
    private formatMentions;
    private addInputListener;
    private refreshStyles;
    private triggerChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgMentionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgMentionsComponent, "ng-mentions", ["ngMentions"], { "triggerChar": "triggerChar"; "mentionMarkup": "markup"; "disableSearch": "disableSearch"; "maxItems": "maxItems"; "dropUp": "dropUp"; "displayName": "displayName"; "placeholder": "placeholder"; "formClass": "formClass"; "value": "value"; "required": "required"; "disabled": "disabled"; "rows": "rows"; "columns": "cols"; "mentionItems": "mentions"; }, { "search": "search"; "valueChanges": "valueChanges"; "stateChanges": "stateChanges"; }, ["mentionListTemplate"], never>;
}
