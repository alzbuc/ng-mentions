import { AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { NgHighlightedValue } from './highlighted-value';
import { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
import * as i0 from "@angular/core";
/**
 * The Highlighter Component
 */
export declare class NgHighlighterComponent implements OnChanges, AfterContentInit {
    private element;
    private cdr;
    /**
     * Text value to be highlighted
     */
    text: string;
    /**
     * Event emitted when a highlighted item it clicked
     */
    itemClick: EventEmitter<NgHighlightedValue>;
    patterns: QueryList<NgHighlighterPatternDirective>;
    readonly newLine: RegExp;
    lines: string[];
    private highlightedElements;
    constructor(element: ElementRef, cdr: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterContentInit(): void;
    onItemClick(event: MouseEvent): void;
    private parseLines;
    private highlight;
    private getMatchedElement;
    private collectHighlightedItems;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgHighlighterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgHighlighterComponent, "ng-highlighter", ["ngHighlighter"], { "text": { "alias": "text"; "required": false; }; }, { "itemClick": "itemClick"; }, ["patterns"], never, false, never>;
}
