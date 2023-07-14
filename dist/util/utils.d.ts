export declare const styleProperties: readonly string[];
export declare function isMobileOrTablet(): boolean;
export declare function mapPlainTextIndex(value: string, mentionMarkup: MarkupMention, indexInPlainText: number, toEndOfMarkup: boolean, displayTransform: (..._: string[]) => string): number;
export declare function getCaretPosition(element: HTMLInputElement): number;
export declare function getCaretCoordinates(element: HTMLTextAreaElement, position: number): {
    top: number;
    left: number;
};
export declare function getElementStyle(element: HTMLElement, property?: string): any;
export declare function setCaretPosition(element: HTMLInputElement, position: number): void;
export declare function escapeRegExp(str: string): string;
export interface MarkupMention {
    markup: string;
    regEx: RegExp;
    groups: {
        [key: string]: number;
    };
}
export declare function markupToRegExp(markup: string): MarkupMention;
export declare function getPlainText(value: string, mentionMarkup: MarkupMention, displayTransform: (..._: string[]) => string): string;
export declare function replacePlaceholders(item: any, markupMention: MarkupMention): string;
export declare function applyChangeToValue(value: string, markupMention: MarkupMention, plainTextValue: string, selectionStartBeforeChange: number, selectionEndBeforeChange: number, selectionEndAfterChange: number, displayTransform: (..._: string[]) => string): string;
export declare function findStartOfMentionInPlainText(value: string, mentionMarkup: MarkupMention, indexInPlainText: number, displayTransform: (..._: string[]) => string): {
    start: number;
    end: number;
};
export declare function getBoundsOfMentionAtPosition(value: string, mentionMarkup: MarkupMention, indexInPlainText: number, displayTransform: (..._: string[]) => string): {
    start: number;
    end: number;
};
export declare function escapeHtml(text: string): string;
export declare function isCoordinateWithinRect(rect: ClientRect, x: number, y: number): boolean;
export declare class Highlighted {
    readonly element: Element;
    readonly type: string;
    constructor(element: Element, type?: string);
    get clientRect(): ClientRect;
}
