import { Directive, Input } from '@angular/core';
import { markupToRegExp } from './util/utils';
import * as i0 from "@angular/core";
/**
 * The Highlighted Pattern Directive
 */
export class NgHighlighterPatternDirective {
    constructor() {
        this.format = (content) => {
            if (typeof this.markupReplace === 'string') {
                let result;
                const replaceTries = [this.markupReplace, `\$${this.markupReplace}`, `\$${this.markupMention.groups[this.markupReplace]}`];
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
    }
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
}
NgHighlighterPatternDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgHighlighterPatternDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgHighlighterPatternDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.4", type: NgHighlighterPatternDirective, selector: "ng-highlighter-pattern", inputs: { className: "className", markup: "markup", markupReplace: "markupReplace" }, exportAs: ["ngHighlighterPattern"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgHighlighterPatternDirective, decorators: [{
            type: Directive,
            args: [{ exportAs: 'ngHighlighterPattern', selector: 'ng-highlighter-pattern' }]
        }], propDecorators: { className: [{
                type: Input
            }], markup: [{
                type: Input
            }], markupReplace: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQW1DLE1BQU0sZUFBZSxDQUFDO0FBQ2pGLE9BQU8sRUFBZ0IsY0FBYyxFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUUzRDs7R0FFRztBQUVILE1BQU0sT0FBTyw2QkFBNkI7SUFEMUM7UUFxQ1csV0FBTSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7WUFDcEMsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssUUFBUSxFQUFFO2dCQUMxQyxJQUFJLE1BQU0sQ0FBQztnQkFDWCxNQUFNLFlBQVksR0FDZCxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRyxLQUFLLE1BQU0sT0FBTyxJQUFJLFlBQVksRUFBRTtvQkFDbEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQzVELElBQUksTUFBTSxLQUFLLE9BQU8sRUFBRTt3QkFDdEIsTUFBTTtxQkFDUDtpQkFDRjtnQkFFRCxPQUFPLE1BQU0sQ0FBQzthQUNmO2lCQUFNLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBRTtnQkFDbkQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3BDO1lBRUQsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQyxDQUFBO0tBQ0Y7SUFuQ0MsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxRQUFRLElBQUksT0FBTyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsS0FBYTtRQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzFFLENBQUM7OzBIQWxDVSw2QkFBNkI7OEdBQTdCLDZCQUE2QjsyRkFBN0IsNkJBQTZCO2tCQUR6QyxTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBQzs4QkFLdEUsU0FBUztzQkFBakIsS0FBSztnQkFJRyxNQUFNO3NCQUFkLEtBQUs7Z0JBUUcsYUFBYTtzQkFBckIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkluaXQsIFNpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXJrdXBNZW50aW9uLCBtYXJrdXBUb1JlZ0V4cH0gZnJvbSAnLi91dGlsL3V0aWxzJztcblxuLyoqXG4gKiBUaGUgSGlnaGxpZ2h0ZWQgUGF0dGVybiBEaXJlY3RpdmVcbiAqL1xuQERpcmVjdGl2ZSh7ZXhwb3J0QXM6ICduZ0hpZ2hsaWdodGVyUGF0dGVybicsIHNlbGVjdG9yOiAnbmctaGlnaGxpZ2h0ZXItcGF0dGVybid9KVxuZXhwb3J0IGNsYXNzIE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAvKipcbiAgICogT3B0aW9uYWwuIENTUyBDbGFzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGhpZ2hsaWdodGVkIGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoKSBjbGFzc05hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBtYXJrdXAgdXNlZCB0byBmb3JtYXQgYSBtZW50aW9uXG4gICAqL1xuICBASW5wdXQoKSBtYXJrdXA6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoaXMgY2FuIGVpdGhlciBiZSB0aGUgbmFtZSBvZiB0aGUgaXRlbSB0YWtlbiBmcm9tIHBhcnQgb2YgdGhlIG1hcmt1cCwgb3IgaXRcbiAgICogY2FuIGJlIGEgZnVsbHkgZm9ybWVkIEhUTUwgbWFya3VwIHdpdGggUmVnRXhwIHBsYWNlcnMuXG4gICAqIE9wdGlvbmFsbHksIHRoaXMgY2FuIGFsc28gYmUgYSBjdXN0b20gZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmb3JtYXQgdGhlIG1hdGNoZWQgdGV4dFxuICAgKiBhbmQgcmV0dXJuZWQgdG8gYmUgZGlzcGxheWVkLiBObyBvdGhlciB0cmFuc2Zvcm1hdGlvbiB3aWxsIGJlIGRvbmUgdG8gdGhlIHRleHQgYW5kIG5vXG4gICAqIG1hdGNoaW5nIGluZm9ybWF0aW9uIGlzIHBhc3NlZCB0aGUgdG8gZnVuY3Rpb24sIGp1c3QgdGhlIG1hdGNoZWQgdGV4dC5cbiAgICovXG4gIEBJbnB1dCgpIG1hcmt1cFJlcGxhY2U6IHN0cmluZ3woKGNvbnRlbnQ6IHN0cmluZykgPT4gc3RyaW5nKTtcblxuICBwcml2YXRlIG1hcmt1cE1lbnRpb246IE1hcmt1cE1lbnRpb247XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWFya3VwKSB7XG4gICAgICB0aGlzLm1hcmt1cE1lbnRpb24gPSBtYXJrdXBUb1JlZ0V4cCh0aGlzLm1hcmt1cCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWFya3VwJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLm1hcmt1cE1lbnRpb24gPSBtYXJrdXBUb1JlZ0V4cCh0aGlzLm1hcmt1cCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2godmFsdWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLm1hcmt1cE1lbnRpb24gPyB0aGlzLm1hcmt1cE1lbnRpb24ucmVnRXguZXhlYyh2YWx1ZSkgOiBudWxsO1xuICB9XG5cbiAgcmVhZG9ubHkgZm9ybWF0ID0gKGNvbnRlbnQ6IHN0cmluZykgPT4ge1xuICAgIGlmICh0eXBlb2YgdGhpcy5tYXJrdXBSZXBsYWNlID09PSAnc3RyaW5nJykge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGNvbnN0IHJlcGxhY2VUcmllcyA9XG4gICAgICAgICAgW3RoaXMubWFya3VwUmVwbGFjZSwgYFxcJCR7dGhpcy5tYXJrdXBSZXBsYWNlfWAsIGBcXCQke3RoaXMubWFya3VwTWVudGlvbi5ncm91cHNbdGhpcy5tYXJrdXBSZXBsYWNlXX1gXTtcbiAgICAgIGZvciAoY29uc3QgYXR0ZW1wdCBvZiByZXBsYWNlVHJpZXMpIHtcbiAgICAgICAgcmVzdWx0ID0gY29udGVudC5yZXBsYWNlKHRoaXMubWFya3VwTWVudGlvbi5yZWdFeCwgYXR0ZW1wdCk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IGF0dGVtcHQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMubWFya3VwUmVwbGFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFya3VwUmVwbGFjZShjb250ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxufVxuIl19