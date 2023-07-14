/**
 * The Highlighted Value
 */
export class NgHighlightedValue {
    constructor(content, type = null, rel = null) {
        /**
         * The type (or class name) associated with the highlighted item that was clicked.
         *
         * @see NgHighlighterPatternDirective.className
         */
        this.type = null;
        /**
         * Optional. Arbitrary rel associated with the clicked highlighted element.
         * This is determined by how the highlighted item's content is formatted.
         */
        this.rel = null;
        this.content = content;
        this.type = type;
        this.rel = rel;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZWQtdmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaGxpZ2h0ZWQtdmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0lBaUI3QixZQUFZLE9BQWUsRUFBRSxPQUFlLElBQUksRUFBRSxNQUFjLElBQUk7UUFacEU7Ozs7V0FJRztRQUNhLFNBQUksR0FBVyxJQUFJLENBQUM7UUFDcEM7OztXQUdHO1FBQ2EsUUFBRyxHQUFXLElBQUksQ0FBQztRQUdqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBIaWdobGlnaHRlZCBWYWx1ZVxuICovXG5leHBvcnQgY2xhc3MgTmdIaWdobGlnaHRlZFZhbHVlIHtcbiAgLyoqXG4gICAqIENvbnRlbnQgb2YgdGhlIGhpZ2hsaWdodGVkIGl0ZW0gdGhhdCB3YXMgY2xpY2tlZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRlbnQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0eXBlIChvciBjbGFzcyBuYW1lKSBhc3NvY2lhdGVkIHdpdGggdGhlIGhpZ2hsaWdodGVkIGl0ZW0gdGhhdCB3YXMgY2xpY2tlZC5cbiAgICpcbiAgICogQHNlZSBOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZS5jbGFzc05hbWVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmcgPSBudWxsO1xuICAvKipcbiAgICogT3B0aW9uYWwuIEFyYml0cmFyeSByZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGlja2VkIGhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gICAqIFRoaXMgaXMgZGV0ZXJtaW5lZCBieSBob3cgdGhlIGhpZ2hsaWdodGVkIGl0ZW0ncyBjb250ZW50IGlzIGZvcm1hdHRlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByZWw6IHN0cmluZyA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoY29udGVudDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgPSBudWxsLCByZWw6IHN0cmluZyA9IG51bGwpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5yZWwgPSByZWw7XG4gIH1cbn1cbiJdfQ==