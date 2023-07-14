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
    constructor(element, host) {
        this.element = element;
        this.host = host;
        this._destroyed = new Subject();
    }
    ngOnInit() {
        this.host.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(value => this.onChange(value));
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
}
NgMentionsAccessorDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsAccessorDirective, deps: [{ token: i0.ElementRef }, { token: i1.NgMentionsComponent }], target: i0.ɵɵFactoryTarget.Directive });
NgMentionsAccessorDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.4", type: NgMentionsAccessorDirective, selector: "ng-mentions", host: { listeners: { "change": "onChange($event)", "touch": "onTouched()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }], exportAs: ["ngMentions"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsAccessorDirective, decorators: [{
            type: Directive,
            args: [{
                    exportAs: 'ngMentions',
                    selector: 'ng-mentions',
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgMentionsAccessorDirective), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgMentionsComponent }]; }, propDecorators: { onChange: [{
                type: HostListener,
                args: ['change', ['$event']]
            }], onTouched: [{
                type: HostListener,
                args: ['touch']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMtaW5wdXQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21lbnRpb25zLWlucHV0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUV6RDs7R0FFRztBQU1ILE1BQU0sT0FBTywyQkFBMkI7SUFLdEMsWUFBb0IsT0FBbUIsRUFBVSxJQUF5QjtRQUF0RCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFGbEUsZUFBVSxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO0lBRXFCLENBQUM7SUFFOUUsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxFQUFPO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFPO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDbEMsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUdELFFBQVEsQ0FBQyxLQUFhO1FBQ3BCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFHRCxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7O3dIQTlDVSwyQkFBMkI7NEdBQTNCLDJCQUEyQixxSEFGM0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDOzJGQUV2RywyQkFBMkI7a0JBTHZDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxhQUFhO29CQUN2QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztpQkFDbkg7bUlBb0NDLFFBQVE7c0JBRFAsWUFBWTt1QkFBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBUWxDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEhvc3RMaXN0ZW5lciwgT25EZXN0cm95LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ01lbnRpb25zQ29tcG9uZW50fSBmcm9tICcuL21lbnRpb25zLmNvbXBvbmVudCc7XG5cbi8qKlxuICogVGhlIE5nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZSBkaXJlY3RpdmUgaXMgdXNlZCB0byBpbmRpY2F0ZSB0aGUgaW5wdXQgZWxlbWVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIGV4cG9ydEFzOiAnbmdNZW50aW9ucycsXG4gIHNlbGVjdG9yOiAnbmctbWVudGlvbnMnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZSksIG11bHRpOiB0cnVlfV1cbn0pXG5leHBvcnQgY2xhc3MgTmdNZW50aW9uc0FjY2Vzc29yRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcHJpdmF0ZSBfb25DaGFuZ2U6IChfOiBzdHJpbmcpID0+IHZvaWQ7XG4gIHByaXZhdGUgX29uVG91Y2g6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX2Rlc3Ryb3llZDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGhvc3Q6IE5nTWVudGlvbnNDb21wb25lbnQpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5ob3N0LnZhbHVlQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUodmFsdWUgPT4gdGhpcy5vbkNoYW5nZSh2YWx1ZSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaCA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5ob3N0LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICB0aGlzLmhvc3QudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjaGFuZ2UnLCBbJyRldmVudCddKVxuICBvbkNoYW5nZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd0b3VjaCcpXG4gIG9uVG91Y2hlZCgpIHtcbiAgICBpZiAodGhpcy5fb25Ub3VjaCkge1xuICAgICAgdGhpcy5fb25Ub3VjaCgpO1xuICAgIH1cbiAgfVxufVxuIl19