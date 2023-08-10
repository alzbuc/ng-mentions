import { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * The Highlighted Pattern Directive
 */
export declare class NgHighlighterPatternDirective implements OnInit, OnChanges {
    /**
     * Optional. CSS Class that will be added to the highlighted element.
     */
    className: string;
    /**
     * The markup used to format a mention
     */
    markup: string;
    /**
     * This can either be the name of the item taken from part of the markup, or it
     * can be a fully formed HTML markup with RegExp placers.
     * Optionally, this can also be a custom function that can be used to format the matched text
     * and returned to be displayed. No other transformation will be done to the text and no
     * matching information is passed the to function, just the matched text.
     */
    markupReplace: string | ((content: string) => string);
    private markupMention;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    match(value: string): RegExpExecArray;
    readonly format: (content: string) => any;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgHighlighterPatternDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgHighlighterPatternDirective, "ng-highlighter-pattern", ["ngHighlighterPattern"], { "className": { "alias": "className"; "required": false; }; "markup": { "alias": "markup"; "required": false; }; "markupReplace": { "alias": "markupReplace"; "required": false; }; }, {}, never, never, false, never>;
}
