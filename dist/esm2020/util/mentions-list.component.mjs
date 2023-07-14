import { Component, ElementRef, EventEmitter, HostBinding, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { getCaretCoordinates, getElementStyle } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgMentionsListComponent {
    constructor() {
        this.activeIndex = -1;
        this.itemSelected = new EventEmitter();
        this.show = false;
        this.dropUp = false;
        this._top = 0;
        this._left = 0;
    }
    get top() {
        return this._top + this.adjustTop + 'px';
    }
    get left() {
        return this._left + 'px';
    }
    get noItems() {
        return !Array.isArray(this.items) || this.items.length === 0;
    }
    get selectedItem() {
        return this.activeIndex >= 0 && this.items[this.activeIndex] !== undefined ? this.items[this.activeIndex] : null;
    }
    ngOnInit() {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    }
    onItemClick(event, activeIndex, item) {
        event.preventDefault();
        console.log(item);
        if (item) {
            this.activeIndex = activeIndex;
            this.itemSelected.emit(item);
        }
    }
    selectFirstItem() {
        this.activeIndex = 0;
        this.resetScroll();
    }
    selectPreviousItem() {
        if (this.activeIndex > 0) {
            this.activeIndex--;
        }
        this.scrollToActiveItem();
    }
    selectNextItem() {
        if (this.activeIndex < this.items.length - 1) {
            this.activeIndex++;
            this.scrollToActiveItem();
        }
    }
    selectLastItem() {
        this.activeIndex = this.items.length > 0 ? this.items.length - 1 : 0;
        this.scrollToActiveItem();
    }
    position() {
        const element = this.textAreaElement;
        const coords = getCaretCoordinates(element, element.selectionStart);
        this._top = coords.top;
        this._left = coords.left + element.offsetLeft;
        this.list.nativeElement.scrollTop = 0;
    }
    resetScroll() {
        this.list.nativeElement.scrollTop = 0;
    }
    transformItem(item) {
        return this.displayTransform(item) || item;
    }
    get adjustTop() {
        let adjust = 0;
        if (!this.dropUp) {
            const computedFontSize = getElementStyle(this.textAreaElement, 'fontSize');
            adjust = parseInt(computedFontSize, 10) + this.textAreaElement.offsetTop;
        }
        return adjust;
    }
    scrollToActiveItem() {
        const element = this.list.nativeElement;
        if (this.activeIndex === 0) {
            element.scrollTop = 0;
        }
        else {
            const activeElement = element.querySelector('li.active');
            if (activeElement) {
                element.scrollTop = activeElement.offsetTop;
            }
        }
    }
}
NgMentionsListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgMentionsListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: NgMentionsListComponent, selector: "mentions-list", host: { properties: { "class.show": "this.show", "class.drop-up": "this.dropUp", "style.top": "this.top", "style.left": "this.left", "class.no-items": "this.noItems" } }, viewQueries: [{ propertyName: "defaultItemTemplate", first: true, predicate: ["defaultItemTemplate"], descendants: true, static: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true, static: true }], ngImport: i0, template: `
      <ng-template #defaultItemTemplate let-item="item">
          {{transformItem(item)}}
      </ng-template>
      <ul #list class="dropdown-menu scrollable-menu">
          <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
              <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
                  <ng-template [ngTemplateOutlet]="itemTemplate"
                               [ngTemplateOutletContext]="{item:item,index:i}"></ng-template>
              </a>
          </li>
      </ul>
  `, isInline: true, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mentions-list', template: `
      <ng-template #defaultItemTemplate let-item="item">
          {{transformItem(item)}}
      </ng-template>
      <ul #list class="dropdown-menu scrollable-menu">
          <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
              <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
                  <ng-template [ngTemplateOutlet]="itemTemplate"
                               [ngTemplateOutletContext]="{item:item,index:i}"></ng-template>
              </a>
          </li>
      </ul>
  `, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"], encapsulation: ViewEncapsulation.None }]
        }], propDecorators: { defaultItemTemplate: [{
                type: ViewChild,
                args: ['defaultItemTemplate', { static: true }]
            }], list: [{
                type: ViewChild,
                args: ['list', { static: true }]
            }], show: [{
                type: HostBinding,
                args: ['class.show']
            }], dropUp: [{
                type: HostBinding,
                args: ['class.drop-up']
            }], top: [{
                type: HostBinding,
                args: ['style.top']
            }], left: [{
                type: HostBinding,
                args: ['style.left']
            }], noItems: [{
                type: HostBinding,
                args: ['class.no-items']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMtbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC9tZW50aW9ucy1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUVYLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxlQUFlLEVBQUMsTUFBTSxTQUFTLENBQUM7OztBQXlCN0QsTUFBTSxPQUFPLHVCQUF1QjtJQXZCcEM7UUE2QkUsZ0JBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNSLGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFJakMsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNWLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFNUMsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULFVBQUssR0FBRyxDQUFDLENBQUM7S0FpR25CO0lBL0ZDLElBQ0ksR0FBRztRQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFDSSxPQUFPO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxTQUFTLENB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QUM7UUFDdkQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQWdCLENBQUM7WUFDeEUsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQzthQUM3QztTQUNGO0lBQ0gsQ0FBQzs7b0hBL0dVLHVCQUF1Qjt3R0FBdkIsdUJBQXVCLHVjQXJCeEI7Ozs7Ozs7Ozs7OztHQVlUOzJGQVNVLHVCQUF1QjtrQkF2Qm5DLFNBQVM7K0JBQ0UsZUFBZSxZQUNmOzs7Ozs7Ozs7Ozs7R0FZVCxtcEJBT2MsaUJBQWlCLENBQUMsSUFBSTs4QkFXYSxtQkFBbUI7c0JBQXBFLFNBQVM7dUJBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNiLElBQUk7c0JBQXRDLFNBQVM7dUJBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQkFDQyxJQUFJO3NCQUFyQyxXQUFXO3VCQUFDLFlBQVk7Z0JBQ1ksTUFBTTtzQkFBMUMsV0FBVzt1QkFBQyxlQUFlO2dCQU14QixHQUFHO3NCQUROLFdBQVc7dUJBQUMsV0FBVztnQkFNcEIsSUFBSTtzQkFEUCxXQUFXO3VCQUFDLFlBQVk7Z0JBTXJCLE9BQU87c0JBRFYsV0FBVzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uSW5pdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2dldENhcmV0Q29vcmRpbmF0ZXMsIGdldEVsZW1lbnRTdHlsZX0gZnJvbSAnLi91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21lbnRpb25zLWxpc3QnLFxuICB0ZW1wbGF0ZTogYFxuICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0SXRlbVRlbXBsYXRlIGxldC1pdGVtPVwiaXRlbVwiPlxuICAgICAgICAgIHt7dHJhbnNmb3JtSXRlbShpdGVtKX19XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPHVsICNsaXN0IGNsYXNzPVwiZHJvcGRvd24tbWVudSBzY3JvbGxhYmxlLW1lbnVcIj5cbiAgICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGl0ZW0gb2YgaXRlbXM7IGxldCBpID0gaW5kZXhcIiBbY2xhc3MuYWN0aXZlXT1cImFjdGl2ZUluZGV4ID09PSBpXCI+XG4gICAgICAgICAgICAgIDxhIGhyZWYgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaSwgaXRlbSlcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7aXRlbTppdGVtLGluZGV4Oml9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICA8L3VsPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9tZW50aW9ucy1saXN0LnNjc3MnXSxcbiAgc3R5bGVzOiBbXG4gICAgJ21lbnRpb25zLWxpc3Quc2hvdyB7ZGlzcGxheTogYmxvY2s7fSBtZW50aW9ucy1saXN0Lm5vLWl0ZW1zIHtkaXNwbGF5OiBub25lO30nLFxuICAgICdtZW50aW9ucy1saXN0IC5zY3JvbGxhYmxlLW1lbnUge2Rpc3BsYXk6IGJsb2NrO2hlaWdodDogYXV0bzttYXgtaGVpZ2h0OjMwMHB4O292ZXJmbG93OmF1dG87fScsXG4gICAgJ21lbnRpb25zLWxpc3QgbGkuYWN0aXZlIHtiYWNrZ3JvdW5kOiAjZjdmN2Y5O30nXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTmdNZW50aW9uc0xpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBwdWJsaWMgaXRlbXM6IGFueVtdO1xuICBwdWJsaWMgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBwdWJsaWMgZGlzcGxheVRyYW5zZm9ybTogKC4uLl86IHN0cmluZ1tdKSA9PiBzdHJpbmc7XG4gIHB1YmxpYyB0ZXh0QXJlYUVsZW1lbnQ6IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG5cbiAgYWN0aXZlSW5kZXggPSAtMTtcbiAgcmVhZG9ubHkgaXRlbVNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2RlZmF1bHRJdGVtVGVtcGxhdGUnLCB7c3RhdGljOiB0cnVlfSkgZGVmYXVsdEl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnbGlzdCcsIHtzdGF0aWM6IHRydWV9KSBsaXN0OiBFbGVtZW50UmVmO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnNob3cnKSBwdWJsaWMgc2hvdyA9IGZhbHNlO1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmRyb3AtdXAnKSBwdWJsaWMgZHJvcFVwID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfdG9wID0gMDtcbiAgcHJpdmF0ZSBfbGVmdCA9IDA7XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS50b3AnKVxuICBnZXQgdG9wKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RvcCArIHRoaXMuYWRqdXN0VG9wICsgJ3B4JztcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpXG4gIGdldCBsZWZ0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xlZnQgKyAncHgnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uby1pdGVtcycpXG4gIGdldCBub0l0ZW1zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhQXJyYXkuaXNBcnJheSh0aGlzLml0ZW1zKSB8fCB0aGlzLml0ZW1zLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW0oKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVJbmRleCA+PSAwICYmIHRoaXMuaXRlbXNbdGhpcy5hY3RpdmVJbmRleF0gIT09IHVuZGVmaW5lZCA/IHRoaXMuaXRlbXNbdGhpcy5hY3RpdmVJbmRleF0gOiBudWxsO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLml0ZW1UZW1wbGF0ZSkge1xuICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSB0aGlzLmRlZmF1bHRJdGVtVGVtcGxhdGU7XG4gICAgfVxuICB9XG5cbiAgb25JdGVtQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGl2ZUluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coaXRlbSk7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBhY3RpdmVJbmRleDtcbiAgICAgIHRoaXMuaXRlbVNlbGVjdGVkLmVtaXQoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNlbGVjdEZpcnN0SXRlbSgpIHtcbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gMDtcbiAgICB0aGlzLnJlc2V0U2Nyb2xsKCk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0UHJldmlvdXNJdGVtKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZUluZGV4ID4gMCkge1xuICAgICAgdGhpcy5hY3RpdmVJbmRleC0tO1xuICAgIH1cbiAgICB0aGlzLnNjcm9sbFRvQWN0aXZlSXRlbSgpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdE5leHRJdGVtKCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZUluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICB0aGlzLmFjdGl2ZUluZGV4Kys7XG4gICAgICB0aGlzLnNjcm9sbFRvQWN0aXZlSXRlbSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RMYXN0SXRlbSgpIHtcbiAgICB0aGlzLmFjdGl2ZUluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGggPiAwID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogMDtcbiAgICB0aGlzLnNjcm9sbFRvQWN0aXZlSXRlbSgpO1xuICB9XG5cbiAgcHVibGljIHBvc2l0aW9uKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLnRleHRBcmVhRWxlbWVudDtcbiAgICBjb25zdCBjb29yZHMgPSBnZXRDYXJldENvb3JkaW5hdGVzKGVsZW1lbnQsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpO1xuICAgIHRoaXMuX3RvcCA9IGNvb3Jkcy50b3A7XG4gICAgdGhpcy5fbGVmdCA9IGNvb3Jkcy5sZWZ0ICsgZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgIHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gIH1cblxuICBwdWJsaWMgcmVzZXRTY3JvbGwoKSB7XG4gICAgdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgfVxuXG4gIHB1YmxpYyB0cmFuc2Zvcm1JdGVtKGl0ZW06IGFueSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BsYXlUcmFuc2Zvcm0oaXRlbSkgfHwgaXRlbTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IGFkanVzdFRvcCgpOiBudW1iZXIge1xuICAgIGxldCBhZGp1c3QgPSAwO1xuICAgIGlmICghdGhpcy5kcm9wVXApIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkRm9udFNpemUgPSBnZXRFbGVtZW50U3R5bGUodGhpcy50ZXh0QXJlYUVsZW1lbnQsICdmb250U2l6ZScpO1xuICAgICAgYWRqdXN0ID0gcGFyc2VJbnQoY29tcHV0ZWRGb250U2l6ZSwgMTApICsgdGhpcy50ZXh0QXJlYUVsZW1lbnQub2Zmc2V0VG9wO1xuICAgIH1cblxuICAgIHJldHVybiBhZGp1c3Q7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbFRvQWN0aXZlSXRlbSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHRoaXMuYWN0aXZlSW5kZXggPT09IDApIHtcbiAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGkuYWN0aXZlJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAoYWN0aXZlRWxlbWVudCkge1xuICAgICAgICBlbGVtZW50LnNjcm9sbFRvcCA9IGFjdGl2ZUVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19