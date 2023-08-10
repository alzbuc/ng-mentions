import { ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewEncapsulation, } from '@angular/core';
import { NgHighlightedValue } from './highlighted-value';
import { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
import { escapeHtml, Highlighted, isCoordinateWithinRect } from './util/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * The Highlighter Component
 */
export class NgHighlighterComponent {
    element;
    cdr;
    /**
     * Text value to be highlighted
     */
    text;
    /**
     * Event emitted when a highlighted item it clicked
     */
    itemClick = new EventEmitter();
    patterns;
    newLine = /\n/g;
    lines = [];
    highlightedElements = [];
    constructor(element, cdr) {
        this.element = element;
        this.cdr = cdr;
    }
    ngOnChanges(changes) {
        if ('text' in changes) {
            this.parseLines();
        }
    }
    ngAfterContentInit() {
        if (this.text && this.patterns) {
            this.parseLines();
        }
    }
    onItemClick(event) {
        const matchedElement = this.getMatchedElement(event);
        if (matchedElement) {
            event.preventDefault();
            event.stopPropagation();
            const content = matchedElement.element.innerText;
            let rel = matchedElement.element.getAttribute('rel') || null;
            const relElement = matchedElement.element.querySelector('[rel]');
            if (relElement) {
                rel = relElement.getAttribute('rel') || null;
            }
            this.itemClick.emit(new NgHighlightedValue(content, matchedElement.type, rel));
        }
    }
    parseLines() {
        this.lines = this.text.split(this.newLine).map((line) => this.highlight(line));
        this.cdr.detectChanges();
        this.collectHighlightedItems();
    }
    highlight(line) {
        if (line.length === 0 || !this.patterns) {
            return '&nbsp;';
        }
        const tags = [];
        let match;
        this.patterns.forEach((pattern) => {
            while ((match = pattern.match(line)) !== null) {
                tags.push({
                    type: pattern.className,
                    indices: { start: match.index, end: match.index + match[0].length },
                    formatter: pattern.format,
                });
            }
        });
        const prevTags = [];
        const parts = [];
        [...tags]
            .sort((tagA, tagB) => tagA.indices.start - tagB.indices.start)
            .forEach((tag) => {
            const expectedLength = tag.indices.end - tag.indices.start;
            const contents = line.slice(tag.indices.start, tag.indices.end);
            if (contents.length === expectedLength) {
                const prevIndex = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
                const before = line.slice(prevIndex, tag.indices.start);
                parts.push(escapeHtml(before));
                parts.push(`<span class="highlighted ${tag.type || ''}" rel="${tag.type}">${tag.formatter(contents)}</span>`);
                prevTags.push(tag);
            }
        });
        const remainingStart = prevTags.length > 0 ? prevTags[prevTags.length - 1].indices.end : 0;
        const remaining = line.slice(remainingStart);
        parts.push(escapeHtml(remaining));
        parts.push('&nbsp;');
        return parts.join('');
    }
    getMatchedElement(event) {
        const matched = this.highlightedElements.find((el) => isCoordinateWithinRect(el.clientRect, event.clientX, event.clientY));
        return matched ? matched : null;
    }
    collectHighlightedItems() {
        this.highlightedElements = Array.from(this.element.nativeElement.getElementsByClassName('highlighted')).map((element) => {
            const type = element.getAttribute('rel') || null;
            return new Highlighted(element, type);
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgHighlighterComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.0", type: NgHighlighterComponent, selector: "ng-highlighter", inputs: { text: "text" }, outputs: { itemClick: "itemClick" }, host: { listeners: { "click": "onItemClick($event)" } }, queries: [{ propertyName: "patterns", predicate: NgHighlighterPatternDirective }], exportAs: ["ngHighlighter"], usesOnChanges: true, ngImport: i0, template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>', isInline: true, dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgHighlighterComponent, decorators: [{
            type: Component,
            args: [{
                    exportAs: 'ngHighlighter',
                    selector: 'ng-highlighter',
                    template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>',
                    preserveWhitespaces: false,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { text: [{
                type: Input
            }], itemClick: [{
                type: Output
            }], patterns: [{
                type: ContentChildren,
                args: [NgHighlighterPatternDirective]
            }], onItemClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hpZ2hsaWdodGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBRVQsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3pELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sY0FBYyxDQUFDOzs7QUFFL0U7O0dBRUc7QUFRSCxNQUFNLE9BQU8sc0JBQXNCO0lBZ0JiO0lBQTZCO0lBZmpEOztPQUVHO0lBQ00sSUFBSSxDQUFTO0lBQ3RCOztPQUVHO0lBQ08sU0FBUyxHQUFxQyxJQUFJLFlBQVksRUFBc0IsQ0FBQztJQUUvQyxRQUFRLENBQTJDO0lBRTFGLE9BQU8sR0FBVyxLQUFLLENBQUM7SUFDakMsS0FBSyxHQUFhLEVBQUUsQ0FBQztJQUNiLG1CQUFtQixHQUFrQixFQUFFLENBQUM7SUFFaEQsWUFBb0IsT0FBbUIsRUFBVSxHQUFzQjtRQUFuRCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBbUI7SUFBRyxDQUFDO0lBRTNFLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZ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QyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOZ0hpZ2hsaWdodGVkVmFsdWUgfSBmcm9tICcuL2hpZ2hsaWdodGVkLXZhbHVlJztcbmltcG9ydCB7IE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlIH0gZnJvbSAnLi9oaWdobGlnaHRlci1wYXR0ZXJuLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBUYWcgfSBmcm9tICcuL3V0aWwvaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBlc2NhcGVIdG1sLCBIaWdobGlnaHRlZCwgaXNDb29yZGluYXRlV2l0aGluUmVjdCB9IGZyb20gJy4vdXRpbC91dGlscyc7XG5cbi8qKlxuICogVGhlIEhpZ2hsaWdodGVyIENvbXBvbmVudFxuICovXG5AQ29tcG9uZW50KHtcbiAgZXhwb3J0QXM6ICduZ0hpZ2hsaWdodGVyJyxcbiAgc2VsZWN0b3I6ICduZy1oaWdobGlnaHRlcicsXG4gIHRlbXBsYXRlOiAnPGRpdiAqbmdGb3I9XCJsZXQgbGluZSBvZiBsaW5lc1wiIFtpbm5lckhUTUxdPVwibGluZVwiPjwvZGl2PicsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBOZ0hpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0IHtcbiAgLyoqXG4gICAqIFRleHQgdmFsdWUgdG8gYmUgaGlnaGxpZ2h0ZWRcbiAgICovXG4gIEBJbnB1dCgpIHRleHQ6IHN0cmluZztcbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGhpZ2hsaWdodGVkIGl0ZW0gaXQgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpIGl0ZW1DbGljazogRXZlbnRFbWl0dGVyPE5nSGlnaGxpZ2h0ZWRWYWx1ZT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nSGlnaGxpZ2h0ZWRWYWx1ZT4oKTtcblxuICBAQ29udGVudENoaWxkcmVuKE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlKSBwYXR0ZXJuczogUXVlcnlMaXN0PE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlPjtcblxuICByZWFkb25seSBuZXdMaW5lOiBSZWdFeHAgPSAvXFxuL2c7XG4gIGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIGhpZ2hsaWdodGVkRWxlbWVudHM6IEhpZ2hsaWdodGVkW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCd0ZXh0JyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnBhcnNlTGluZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudGV4dCAmJiB0aGlzLnBhdHRlcm5zKSB7XG4gICAgICB0aGlzLnBhcnNlTGluZXMoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uSXRlbUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgbWF0Y2hlZEVsZW1lbnQgPSB0aGlzLmdldE1hdGNoZWRFbGVtZW50KGV2ZW50KTtcbiAgICBpZiAobWF0Y2hlZEVsZW1lbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSAoPEhUTUxFbGVtZW50Pm1hdGNoZWRFbGVtZW50LmVsZW1lbnQpLmlubmVyVGV4dDtcbiAgICAgIGxldCByZWwgPSBtYXRjaGVkRWxlbWVudC5lbGVtZW50LmdldEF0dHJpYnV0ZSgncmVsJykgfHwgbnVsbDtcbiAgICAgIGNvbnN0IHJlbEVsZW1lbnQgPSBtYXRjaGVkRWxlbWVudC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tyZWxdJyk7XG4gICAgICBpZiAocmVsRWxlbWVudCkge1xuICAgICAgICByZWwgPSByZWxFbGVtZW50LmdldEF0dHJpYnV0ZSgncmVsJykgfHwgbnVsbDtcbiAgICAgIH1cbiAgICAgIHRoaXMuaXRlbUNsaWNrLmVtaXQobmV3IE5nSGlnaGxpZ2h0ZWRWYWx1ZShjb250ZW50LCBtYXRjaGVkRWxlbWVudC50eXBlLCByZWwpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlTGluZXMoKSB7XG4gICAgdGhpcy5saW5lcyA9IHRoaXMudGV4dC5zcGxpdCh0aGlzLm5ld0xpbmUpLm1hcCgobGluZTogc3RyaW5nKSA9PiB0aGlzLmhpZ2hsaWdodChsaW5lKSk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHRoaXMuY29sbGVjdEhpZ2hsaWdodGVkSXRlbXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlnaGxpZ2h0KGxpbmU6IHN0cmluZykge1xuICAgIGlmIChsaW5lLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5wYXR0ZXJucykge1xuICAgICAgcmV0dXJuICcmbmJzcDsnO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ3M6IFRhZ1tdID0gW107XG4gICAgbGV0IG1hdGNoO1xuICAgIHRoaXMucGF0dGVybnMuZm9yRWFjaCgocGF0dGVybjogTmdIaWdobGlnaHRlclBhdHRlcm5EaXJlY3RpdmUpID0+IHtcbiAgICAgIHdoaWxlICgobWF0Y2ggPSBwYXR0ZXJuLm1hdGNoKGxpbmUpKSAhPT0gbnVsbCkge1xuICAgICAgICB0YWdzLnB1c2goe1xuICAgICAgICAgIHR5cGU6IHBhdHRlcm4uY2xhc3NOYW1lLFxuICAgICAgICAgIGluZGljZXM6IHsgc3RhcnQ6IG1hdGNoLmluZGV4LCBlbmQ6IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoIH0sXG4gICAgICAgICAgZm9ybWF0dGVyOiBwYXR0ZXJuLmZvcm1hdCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcmV2VGFnczogVGFnW10gPSBbXTtcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICBbLi4udGFnc11cbiAgICAgIC5zb3J0KCh0YWdBLCB0YWdCKSA9PiB0YWdBLmluZGljZXMuc3RhcnQgLSB0YWdCLmluZGljZXMuc3RhcnQpXG4gICAgICAuZm9yRWFjaCgodGFnOiBUYWcpID0+IHtcbiAgICAgICAgY29uc3QgZXhwZWN0ZWRMZW5ndGggPSB0YWcuaW5kaWNlcy5lbmQgLSB0YWcuaW5kaWNlcy5zdGFydDtcbiAgICAgICAgY29uc3QgY29udGVudHMgPSBsaW5lLnNsaWNlKHRhZy5pbmRpY2VzLnN0YXJ0LCB0YWcuaW5kaWNlcy5lbmQpO1xuICAgICAgICBpZiAoY29udGVudHMubGVuZ3RoID09PSBleHBlY3RlZExlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IHByZXZJbmRleCA9IHByZXZUYWdzLmxlbmd0aCA+IDAgPyBwcmV2VGFnc1twcmV2VGFncy5sZW5ndGggLSAxXS5pbmRpY2VzLmVuZCA6IDA7XG4gICAgICAgICAgY29uc3QgYmVmb3JlID0gbGluZS5zbGljZShwcmV2SW5kZXgsIHRhZy5pbmRpY2VzLnN0YXJ0KTtcbiAgICAgICAgICBwYXJ0cy5wdXNoKGVzY2FwZUh0bWwoYmVmb3JlKSk7XG4gICAgICAgICAgcGFydHMucHVzaChgPHNwYW4gY2xhc3M9XCJoaWdobGlnaHRlZCAke3RhZy50eXBlIHx8ICcnfVwiIHJlbD1cIiR7dGFnLnR5cGV9XCI+JHt0YWcuZm9ybWF0dGVyKGNvbnRlbnRzKX08L3NwYW4+YCk7XG4gICAgICAgICAgcHJldlRhZ3MucHVzaCh0YWcpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGNvbnN0IHJlbWFpbmluZ1N0YXJ0ID0gcHJldlRhZ3MubGVuZ3RoID4gMCA/IHByZXZUYWdzW3ByZXZUYWdzLmxlbmd0aCAtIDFdLmluZGljZXMuZW5kIDogMDtcbiAgICBjb25zdCByZW1haW5pbmcgPSBsaW5lLnNsaWNlKHJlbWFpbmluZ1N0YXJ0KTtcbiAgICBwYXJ0cy5wdXNoKGVzY2FwZUh0bWwocmVtYWluaW5nKSk7XG4gICAgcGFydHMucHVzaCgnJm5ic3A7Jyk7XG5cbiAgICByZXR1cm4gcGFydHMuam9pbignJyk7XG4gIH1cblxuICBwcml2YXRlIGdldE1hdGNoZWRFbGVtZW50KGV2ZW50OiBNb3VzZUV2ZW50KTogSGlnaGxpZ2h0ZWQge1xuICAgIGNvbnN0IG1hdGNoZWQgPSB0aGlzLmhpZ2hsaWdodGVkRWxlbWVudHMuZmluZCgoZWw6IEhpZ2hsaWdodGVkKTogYm9vbGVhbiA9PlxuICAgICAgaXNDb29yZGluYXRlV2l0aGluUmVjdChlbC5jbGllbnRSZWN0LCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIG1hdGNoZWQgPyBtYXRjaGVkIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY29sbGVjdEhpZ2hsaWdodGVkSXRlbXMoKSB7XG4gICAgdGhpcy5oaWdobGlnaHRlZEVsZW1lbnRzID0gQXJyYXkuZnJvbShcbiAgICAgICg8RWxlbWVudD50aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnaGlnaGxpZ2h0ZWQnKSxcbiAgICApLm1hcCgoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgncmVsJykgfHwgbnVsbDtcblxuICAgICAgcmV0dXJuIG5ldyBIaWdobGlnaHRlZChlbGVtZW50LCB0eXBlKTtcbiAgICB9KTtcbiAgfVxufVxuIl19