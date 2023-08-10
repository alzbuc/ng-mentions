/**
 * The Highlighted Value
 */
export class NgHighlightedValue {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZWQtdmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaGxpZ2h0ZWQtdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0lBQzdCOztPQUVHO0lBQ2EsT0FBTyxDQUFTO0lBQ2hDOzs7O09BSUc7SUFDYSxJQUFJLEdBQVcsSUFBSSxDQUFDO0lBQ3BDOzs7T0FHRztJQUNhLEdBQUcsR0FBVyxJQUFJLENBQUM7SUFFbkMsWUFBWSxPQUFlLEVBQUUsT0FBZSxJQUFJLEVBQUUsTUFBYyxJQUFJO1FBQ2xFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIEhpZ2hsaWdodGVkIFZhbHVlXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ0hpZ2hsaWdodGVkVmFsdWUge1xuICAvKipcbiAgICogQ29udGVudCBvZiB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSB0aGF0IHdhcyBjbGlja2VkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29udGVudDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHR5cGUgKG9yIGNsYXNzIG5hbWUpIGFzc29jaWF0ZWQgd2l0aCB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSB0aGF0IHdhcyBjbGlja2VkLlxuICAgKlxuICAgKiBAc2VlIE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlLmNsYXNzTmFtZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6IHN0cmluZyA9IG51bGw7XG4gIC8qKlxuICAgKiBPcHRpb25hbC4gQXJiaXRyYXJ5IHJlbCBhc3NvY2lhdGVkIHdpdGggdGhlIGNsaWNrZWQgaGlnaGxpZ2h0ZWQgZWxlbWVudC5cbiAgICogVGhpcyBpcyBkZXRlcm1pbmVkIGJ5IGhvdyB0aGUgaGlnaGxpZ2h0ZWQgaXRlbSdzIGNvbnRlbnQgaXMgZm9ybWF0dGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJlbDogc3RyaW5nID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihjb250ZW50OiBzdHJpbmcsIHR5cGU6IHN0cmluZyA9IG51bGwsIHJlbDogc3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnJlbCA9IHJlbDtcbiAgfVxufVxuIl19