import { Component, ElementRef, EventEmitter, HostBinding, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { getCaretCoordinates, getElementStyle } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgMentionsListComponent {
    items;
    itemTemplate;
    displayTransform;
    textAreaElement;
    activeIndex = -1;
    itemSelected = new EventEmitter();
    defaultItemTemplate;
    list;
    show = false;
    dropUp = false;
    _top = 0;
    _left = 0;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsListComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: NgMentionsListComponent, selector: "mentions-list", host: { properties: { "class.show": "this.show", "class.drop-up": "this.dropUp", "style.top": "this.top", "style.left": "this.left", "class.no-items": "this.noItems" } }, viewQueries: [{ propertyName: "defaultItemTemplate", first: true, predicate: ["defaultItemTemplate"], descendants: true, static: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true, static: true }], ngImport: i0, template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{ transformItem(item) }}
    </ng-template>
    <ul #list class="dropdown-menu scrollable-menu">
      <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
        <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
          <ng-template
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{ item: item, index: i }"
          ></ng-template>
        </a>
      </li>
    </ul>
  `, isInline: true, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mentions-list', template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{ transformItem(item) }}
    </ng-template>
    <ul #list class="dropdown-menu scrollable-menu">
      <li *ngFor="let item of items; let i = index" [class.active]="activeIndex === i">
        <a href class="dropdown-item" (click)="onItemClick($event, i, item)">
          <ng-template
            [ngTemplateOutlet]="itemTemplate"
            [ngTemplateOutletContext]="{ item: item, index: i }"
          ></ng-template>
        </a>
      </li>
    </ul>
  `, encapsulation: ViewEncapsulation.None, styles: ["mentions-list{position:absolute;display:none}mentions-list.drop-up{-webkit-transform:translateY(-100%);transform:translateY(-100%)}mentions-list.show{display:block}mentions-list.no-items{display:none}mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}mentions-list li.active{background:#f7f7f9}mentions-list .dropdown-menu,mentions-list .dropdown-menu li{list-style:none}\n", "mentions-list.show{display:block}mentions-list.no-items{display:none}\n", "mentions-list .scrollable-menu{display:block;height:auto;max-height:300px;overflow:auto}\n", "mentions-list li.active{background:#f7f7f9}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudGlvbnMtbGlzdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbC9tZW50aW9ucy1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUVYLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUM7OztBQTJCL0QsTUFBTSxPQUFPLHVCQUF1QjtJQUMzQixLQUFLLENBQVE7SUFDYixZQUFZLENBQW1CO0lBQy9CLGdCQUFnQixDQUE2QjtJQUM3QyxlQUFlLENBQXNCO0lBRTVDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNSLFlBQVksR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQUVmLG1CQUFtQixDQUFtQjtJQUNyRCxJQUFJLENBQWE7SUFDcEIsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNWLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFFNUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNULEtBQUssR0FBRyxDQUFDLENBQUM7SUFFbEIsSUFDSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUNJLE9BQU87UUFDVCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxP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QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQTRCLENBQUM7UUFDdkQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQWdCLENBQUM7WUFDeEUsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQzthQUM3QztTQUNGO0lBQ0gsQ0FBQzt1R0E5R1UsdUJBQXVCOzJGQUF2Qix1QkFBdUIsdWNBdkJ4Qjs7Ozs7Ozs7Ozs7Ozs7R0FjVDs7MkZBU1UsdUJBQXVCO2tCQXpCbkMsU0FBUzsrQkFDRSxlQUFlLFlBQ2Y7Ozs7Ozs7Ozs7Ozs7O0dBY1QsaUJBT2MsaUJBQWlCLENBQUMsSUFBSTs4QkFXZSxtQkFBbUI7c0JBQXRFLFNBQVM7dUJBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUNiLElBQUk7c0JBQXhDLFNBQVM7dUJBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFDRCxJQUFJO3NCQUFyQyxXQUFXO3VCQUFDLFlBQVk7Z0JBQ1ksTUFBTTtzQkFBMUMsV0FBVzt1QkFBQyxlQUFlO2dCQU14QixHQUFHO3NCQUROLFdBQVc7dUJBQUMsV0FBVztnQkFNcEIsSUFBSTtzQkFEUCxXQUFXO3VCQUFDLFlBQVk7Z0JBTXJCLE9BQU87c0JBRFYsV0FBVzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIE9uSW5pdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBnZXRDYXJldENvb3JkaW5hdGVzLCBnZXRFbGVtZW50U3R5bGUgfSBmcm9tICcuL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWVudGlvbnMtbGlzdCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0SXRlbVRlbXBsYXRlIGxldC1pdGVtPVwiaXRlbVwiPlxuICAgICAge3sgdHJhbnNmb3JtSXRlbShpdGVtKSB9fVxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPHVsICNsaXN0IGNsYXNzPVwiZHJvcGRvd24tbWVudSBzY3JvbGxhYmxlLW1lbnVcIj5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBpdGVtczsgbGV0IGkgPSBpbmRleFwiIFtjbGFzcy5hY3RpdmVdPVwiYWN0aXZlSW5kZXggPT09IGlcIj5cbiAgICAgICAgPGEgaHJlZiBjbGFzcz1cImRyb3Bkb3duLWl0ZW1cIiAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpLCBpdGVtKVwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbVRlbXBsYXRlXCJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW06IGl0ZW0sIGluZGV4OiBpIH1cIlxuICAgICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL21lbnRpb25zLWxpc3Quc2NzcyddLFxuICBzdHlsZXM6IFtcbiAgICAnbWVudGlvbnMtbGlzdC5zaG93IHtkaXNwbGF5OiBibG9jazt9IG1lbnRpb25zLWxpc3Qubm8taXRlbXMge2Rpc3BsYXk6IG5vbmU7fScsXG4gICAgJ21lbnRpb25zLWxpc3QgLnNjcm9sbGFibGUtbWVudSB7ZGlzcGxheTogYmxvY2s7aGVpZ2h0OiBhdXRvO21heC1oZWlnaHQ6MzAwcHg7b3ZlcmZsb3c6YXV0bzt9JyxcbiAgICAnbWVudGlvbnMtbGlzdCBsaS5hY3RpdmUge2JhY2tncm91bmQ6ICNmN2Y3Zjk7fScsXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE5nTWVudGlvbnNMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHVibGljIGl0ZW1zOiBhbnlbXTtcbiAgcHVibGljIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgcHVibGljIGRpc3BsYXlUcmFuc2Zvcm06ICguLi5fOiBzdHJpbmdbXSkgPT4gc3RyaW5nO1xuICBwdWJsaWMgdGV4dEFyZWFFbGVtZW50OiBIVE1MVGV4dEFyZWFFbGVtZW50O1xuXG4gIGFjdGl2ZUluZGV4ID0gLTE7XG4gIHJlYWRvbmx5IGl0ZW1TZWxlY3RlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAVmlld0NoaWxkKCdkZWZhdWx0SXRlbVRlbXBsYXRlJywgeyBzdGF0aWM6IHRydWUgfSkgZGVmYXVsdEl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnbGlzdCcsIHsgc3RhdGljOiB0cnVlIH0pIGxpc3Q6IEVsZW1lbnRSZWY7XG4gIEBIb3N0QmluZGluZygnY2xhc3Muc2hvdycpIHB1YmxpYyBzaG93ID0gZmFsc2U7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuZHJvcC11cCcpIHB1YmxpYyBkcm9wVXAgPSBmYWxzZTtcblxuICBwcml2YXRlIF90b3AgPSAwO1xuICBwcml2YXRlIF9sZWZ0ID0gMDtcblxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLnRvcCcpXG4gIGdldCB0b3AoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdG9wICsgdGhpcy5hZGp1c3RUb3AgKyAncHgnO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5sZWZ0JylcbiAgZ2V0IGxlZnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbGVmdCArICdweCc7XG4gIH1cblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5vLWl0ZW1zJylcbiAgZ2V0IG5vSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFBcnJheS5pc0FycmF5KHRoaXMuaXRlbXMpIHx8IHRoaXMuaXRlbXMubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUluZGV4ID49IDAgJiYgdGhpcy5pdGVtc1t0aGlzLmFjdGl2ZUluZGV4XSAhPT0gdW5kZWZpbmVkID8gdGhpcy5pdGVtc1t0aGlzLmFjdGl2ZUluZGV4XSA6IG51bGw7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXRlbVRlbXBsYXRlKSB7XG4gICAgICB0aGlzLml0ZW1UZW1wbGF0ZSA9IHRoaXMuZGVmYXVsdEl0ZW1UZW1wbGF0ZTtcbiAgICB9XG4gIH1cblxuICBvbkl0ZW1DbGljayhldmVudDogTW91c2VFdmVudCwgYWN0aXZlSW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IGFjdGl2ZUluZGV4O1xuICAgICAgdGhpcy5pdGVtU2VsZWN0ZWQuZW1pdChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0Rmlyc3RJdGVtKCkge1xuICAgIHRoaXMuYWN0aXZlSW5kZXggPSAwO1xuICAgIHRoaXMucmVzZXRTY3JvbGwoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RQcmV2aW91c0l0ZW0oKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSW5kZXggPiAwKSB7XG4gICAgICB0aGlzLmFjdGl2ZUluZGV4LS07XG4gICAgfVxuICAgIHRoaXMuc2Nyb2xsVG9BY3RpdmVJdGVtKCk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0TmV4dEl0ZW0oKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMuYWN0aXZlSW5kZXgrKztcbiAgICAgIHRoaXMuc2Nyb2xsVG9BY3RpdmVJdGVtKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNlbGVjdExhc3RJdGVtKCkge1xuICAgIHRoaXMuYWN0aXZlSW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aCA+IDAgPyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEgOiAwO1xuICAgIHRoaXMuc2Nyb2xsVG9BY3RpdmVJdGVtKCk7XG4gIH1cblxuICBwdWJsaWMgcG9zaXRpb24oKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMudGV4dEFyZWFFbGVtZW50O1xuICAgIGNvbnN0IGNvb3JkcyA9IGdldENhcmV0Q29vcmRpbmF0ZXMoZWxlbWVudCwgZWxlbWVudC5zZWxlY3Rpb25TdGFydCk7XG4gICAgdGhpcy5fdG9wID0gY29vcmRzLnRvcDtcbiAgICB0aGlzLl9sZWZ0ID0gY29vcmRzLmxlZnQgKyBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgfVxuXG4gIHB1YmxpYyByZXNldFNjcm9sbCgpIHtcbiAgICB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICB9XG5cbiAgcHVibGljIHRyYW5zZm9ybUl0ZW0oaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheVRyYW5zZm9ybShpdGVtKSB8fCBpdGVtO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgYWRqdXN0VG9wKCk6IG51bWJlciB7XG4gICAgbGV0IGFkanVzdCA9IDA7XG4gICAgaWYgKCF0aGlzLmRyb3BVcCkge1xuICAgICAgY29uc3QgY29tcHV0ZWRGb250U2l6ZSA9IGdldEVsZW1lbnRTdHlsZSh0aGlzLnRleHRBcmVhRWxlbWVudCwgJ2ZvbnRTaXplJyk7XG4gICAgICBhZGp1c3QgPSBwYXJzZUludChjb21wdXRlZEZvbnRTaXplLCAxMCkgKyB0aGlzLnRleHRBcmVhRWxlbWVudC5vZmZzZXRUb3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFkanVzdDtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsVG9BY3RpdmVJdGVtKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmxpc3QubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAodGhpcy5hY3RpdmVJbmRleCA9PT0gMCkge1xuICAgICAgZWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaS5hY3RpdmUnKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGlmIChhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gYWN0aXZlRWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=