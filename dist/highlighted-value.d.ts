/**
 * The Highlighted Value
 */
export declare class NgHighlightedValue {
    /**
     * Content of the highlighted item that was clicked
     */
    readonly content: string;
    /**
     * The type (or class name) associated with the highlighted item that was clicked.
     *
     * @see NgHighlighterPatternDirective.className
     */
    readonly type: string;
    /**
     * Optional. Arbitrary rel associated with the clicked highlighted element.
     * This is determined by how the highlighted item's content is formatted.
     */
    readonly rel: string;
    constructor(content: string, type?: string, rel?: string);
}
