import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgMentionsComponent } from './mentions.component';
import * as i0 from "@angular/core";
import * as i1 from "./mentions.component";
/**
 * The NgMentionsAccessorDirective directive is used to indicate the input element.
 */
export class NgMentionsAccessorDirective {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsAccessorDirective, deps: [{ token: i0.ElementRef }, { token: i1.NgMentionsComponent }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.0", type: NgMentionsAccessorDirective, selector: "ng-mentions", host: { listeners: { "change": "onChange($event)", "touch": "onTouched()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }], exportAs: ["ngMentions"], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsAccessorDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngMentions',
                    selector: 'ng-mentions',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }],
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgMentionsComponent }]; }, propDecorators: { onChange: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], onTouched: [{
                type: HostListener,
                args: ['touch']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMtaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21lbnRpb25zLWlucHV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNuRyxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQUUzRDs7R0FFRztBQU1ILE1BQU0sT0FBTywyQkFBMkI7SUFLbEI7SUFBNkI7SUFKekMsU0FBUyxDQUFzQjtJQUMvQixRQUFRLENBQWE7SUFDckIsVUFBVSxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO0lBRXhELFlBQW9CLE9BQW1CLEVBQVUsSUFBeUI7UUFBdEQsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFVLFNBQUksR0FBSixJQUFJLENBQXFCO0lBQUcsQ0FBQztJQUU5RSxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNyRyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBTztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBTztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBYTtRQUN0QixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN6QjtJQUNILENBQUM7SUFHRCxRQUFRLENBQUMsS0FBYTtRQUNwQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBR0QsU0FBUztRQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO3VHQTlDVSwyQkFBMkI7MkZBQTNCLDJCQUEyQixxSEFGM0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDOzsyRkFFekcsMkJBQTJCO2tCQUx2QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3JIO21JQW9DQyxRQUFRO3NCQURQLFlBQVk7dUJBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQVFsQyxTQUFTO3NCQURSLFlBQVk7dUJBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSG9zdExpc3RlbmVyLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOZ01lbnRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9tZW50aW9ucy5jb21wb25lbnQnO1xuXG4vKipcbiAqIFRoZSBOZ01lbnRpb25zQWNjZXNzb3JEaXJlY3RpdmUgZGlyZWN0aXZlIGlzIHVzZWQgdG8gaW5kaWNhdGUgdGhlIGlucHV0IGVsZW1lbnQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBleHBvcnRBczogJ25nTWVudGlvbnMnLFxuICBzZWxlY3RvcjogJ25nLW1lbnRpb25zJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdNZW50aW9uc0FjY2Vzc29yRGlyZWN0aXZlKSwgbXVsdGk6IHRydWUgfV0sXG59KVxuZXhwb3J0IGNsYXNzIE5nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgX29uQ2hhbmdlOiAoXzogc3RyaW5nKSA9PiB2b2lkO1xuICBwcml2YXRlIF9vblRvdWNoOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9kZXN0cm95ZWQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBob3N0OiBOZ01lbnRpb25zQ29tcG9uZW50KSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaG9zdC52YWx1ZUNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCh2YWx1ZSkgPT4gdGhpcy5vbkNoYW5nZSh2YWx1ZSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5ob3N0LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aGlzLmhvc3QudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudCddKVxuICBvbkNoYW5nZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaCcpXG4gIG9uVG91Y2hlZCgpIHtcbiAgICBpZiAodGhpcy5fb25Ub3VjaCkge1xuICAgICAgdGhpcy5fb25Ub3VjaCgpO1xuICAgIH1cbiAgfVxufVxuIl19