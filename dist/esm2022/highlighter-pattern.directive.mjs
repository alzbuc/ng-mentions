import { Directive, Input } from '@angular/core';
import { markupToRegExp } from './util/utils';
import * as i0 from "@angular/core";
/**
 * The Highlighted Pattern Directive
 */
export class NgHighlighterPatternDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQW9DLE1BQU0sZUFBZSxDQUFDO0FBRW5GLE9BQU8sRUFBaUIsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQUU3RDs7R0FFRztBQUVILE1BQU0sT0FBTyw2QkFBNkI7SUFDeEM7O09BRUc7SUFDTSxTQUFTLENBQVM7SUFDM0I7O09BRUc7SUFDTSxNQUFNLENBQVM7SUFDeEI7Ozs7OztPQU1HO0lBQ00sYUFBYSxDQUF5QztJQUV2RCxhQUFhLENBQWdCO0lBRXJDLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFDakIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxRSxDQUFDO0lBRVEsTUFBTSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7UUFDcEMsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzFDLElBQUksTUFBTSxDQUFDO1lBQ1gsTUFBTSxZQUFZLEdBQUc7Z0JBQ25CLElBQUksQ0FBQyxhQUFhO2dCQUNsQixLQUFLLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3pCLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2FBQ3JELENBQUM7WUFDRixLQUFLLE1BQU0sT0FBTyxJQUFJLFlBQVksRUFBRTtnQkFDbEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzVELElBQUksTUFBTSxLQUFLLE9BQU8sRUFBRTtvQkFDdEIsTUFBTTtpQkFDUDthQUNGO1lBRUQsT0FBTyxNQUFNLENBQUM7U0FDZjthQUFNLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBRTtZQUNuRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDLENBQUM7dUdBekRTLDZCQUE2QjsyRkFBN0IsNkJBQTZCOzsyRkFBN0IsNkJBQTZCO2tCQUR6QyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBRTs4QkFLeEUsU0FBUztzQkFBakIsS0FBSztnQkFJRyxNQUFNO3NCQUFkLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE1hcmt1cE1lbnRpb24sIG1hcmt1cFRvUmVnRXhwIH0gZnJvbSAnLi91dGlsL3V0aWxzJztcblxuLyoqXG4gKiBUaGUgSGlnaGxpZ2h0ZWQgUGF0dGVybiBEaXJlY3RpdmVcbiAqL1xuQERpcmVjdGl2ZSh7IGV4cG9ydEFzOiAnbmdIaWdobGlnaHRlclBhdHRlcm4nLCBzZWxlY3RvcjogJ25nLWhpZ2hsaWdodGVyLXBhdHRlcm4nIH0pXG5leHBvcnQgY2xhc3MgTmdIaWdobGlnaHRlclBhdHRlcm5EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBPcHRpb25hbC4gQ1NTIENsYXNzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgaGlnaGxpZ2h0ZWQgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgpIGNsYXNzTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIG1hcmt1cCB1c2VkIHRvIGZvcm1hdCBhIG1lbnRpb25cbiAgICovXG4gIEBJbnB1dCgpIG1hcmt1cDogc3RyaW5nO1xuICAvKipcbiAgICogVGhpcyBjYW4gZWl0aGVyIGJlIHRoZSBuYW1lIG9mIHRoZSBpdGVtIHRha2VuIGZyb20gcGFydCBvZiB0aGUgbWFya3VwLCBvciBpdFxuICAgKiBjYW4gYmUgYSBmdWxseSBmb3JtZWQgSFRNTCBtYXJrdXAgd2l0aCBSZWdFeHAgcGxhY2Vycy5cbiAgICogT3B0aW9uYWxseSwgdGhpcyBjYW4gYWxzbyBiZSBhIGN1c3RvbSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGZvcm1hdCB0aGUgbWF0Y2hlZCB0ZXh0XG4gICAqIGFuZCByZXR1cm5lZCB0byBiZSBkaXNwbGF5ZWQuIE5vIG90aGVyIHRyYW5zZm9ybWF0aW9uIHdpbGwgYmUgZG9uZSB0byB0aGUgdGV4dCBhbmQgbm9cbiAgICogbWF0Y2hpbmcgaW5mb3JtYXRpb24gaXMgcGFzc2VkIHRoZSB0byBmdW5jdGlvbiwganVzdCB0aGUgbWF0Y2hlZCB0ZXh0LlxuICAgKi9cbiAgQElucHV0KCkgbWFya3VwUmVwbGFjZTogc3RyaW5nIHwgKChjb250ZW50OiBzdHJpbmcpID0+IHN0cmluZyk7XG5cbiAgcHJpdmF0ZSBtYXJrdXBNZW50aW9uOiBNYXJrdXBNZW50aW9uO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hcmt1cCkge1xuICAgICAgdGhpcy5tYXJrdXBNZW50aW9uID0gbWFya3VwVG9SZWdFeHAodGhpcy5tYXJrdXApO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ21hcmt1cCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5tYXJrdXBNZW50aW9uID0gbWFya3VwVG9SZWdFeHAodGhpcy5tYXJrdXApO1xuICAgIH1cbiAgfVxuXG4gIG1hdGNoKHZhbHVlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrdXBNZW50aW9uID8gdGhpcy5tYXJrdXBNZW50aW9uLnJlZ0V4LmV4ZWModmFsdWUpIDogbnVsbDtcbiAgfVxuXG4gIHJlYWRvbmx5IGZvcm1hdCA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICBpZiAodHlwZW9mIHRoaXMubWFya3VwUmVwbGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICBjb25zdCByZXBsYWNlVHJpZXMgPSBbXG4gICAgICAgIHRoaXMubWFya3VwUmVwbGFjZSxcbiAgICAgICAgYFxcJCR7dGhpcy5tYXJrdXBSZXBsYWNlfWAsXG4gICAgICAgIGBcXCQke3RoaXMubWFya3VwTWVudGlvbi5ncm91cHNbdGhpcy5tYXJrdXBSZXBsYWNlXX1gLFxuICAgICAgXTtcbiAgICAgIGZvciAoY29uc3QgYXR0ZW1wdCBvZiByZXBsYWNlVHJpZXMpIHtcbiAgICAgICAgcmVzdWx0ID0gY29udGVudC5yZXBsYWNlKHRoaXMubWFya3VwTWVudGlvbi5yZWdFeCwgYXR0ZW1wdCk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IGF0dGVtcHQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMubWFya3VwUmVwbGFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFya3VwUmVwbGFjZShjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfTtcbn1cbiJdfQ==