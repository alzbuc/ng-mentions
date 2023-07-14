import { ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewEncapsulation } from '@angular/core';
import { NgHighlightedValue } from './highlighted-value';
import { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
import { escapeHtml, Highlighted, isCoordinateWithinRect } from './util/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * The Highlighter Component
 */
export class NgHighlighterComponent {
    constructor(element, cdr) {
        this.element = element;
        this.cdr = cdr;
        /**
         * Event emitted when a highlighted item it clicked
         */
        this.itemClick = new EventEmitter();
        this.newLine = /\n/g;
        this.lines = [];
        this.highlightedElements = [];
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
                    formatter: pattern.format
                });
            }
        });
        const prevTags = [];
        const parts = [];
        [...tags].sort((tagA, tagB) => tagA.indices.start - tagB.indices.start).forEach((tag) => {
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
        this.highlightedElements = Array.from(this.element.nativeElement.getElementsByClassName('highlighted'))
            .map((element) => {
            const type = element.getAttribute('rel') || null;
            return new Highlighted(element, type);
        });
    }
}
NgHighlighterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgHighlighterComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
NgHighlighterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: NgHighlighterComponent, selector: "ng-highlighter", inputs: { text: "text" }, outputs: { itemClick: "itemClick" }, host: { listeners: { "click": "onItemClick($event)" } }, queries: [{ propertyName: "patterns", predicate: NgHighlighterPatternDirective }], exportAs: ["ngHighlighter"], usesOnChanges: true, ngImport: i0, template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>', isInline: true, directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgHighlighterComponent, decorators: [{
            type: Component,
            args: [{
                    exportAs: 'ngHighlighter',
                    selector: 'ng-highlighter',
                    template: '<div *ngFor="let line of lines" [innerHTML]="line"></div>',
                    preserveWhitespaces: false,
                    encapsulation: ViewEncapsulation.None
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hpZ2hsaWdodGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBRVQsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBRTlFLE9BQU8sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFDLE1BQU0sY0FBYyxDQUFDOzs7QUFFN0U7O0dBRUc7QUFRSCxNQUFNLE9BQU8sc0JBQXNCO0lBZ0JqQyxZQUFvQixPQUFtQixFQUFVLEdBQXNCO1FBQW5ELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQVh2RTs7V0FFRztRQUNPLGNBQVMsR0FBcUMsSUFBSSxZQUFZLEVBQXNCLENBQUM7UUFJdEYsWUFBTyxHQUFXLEtBQUssQ0FBQztRQUNqQyxVQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ2Isd0JBQW1CLEdBQWtCLEVBQUUsQ0FBQztJQUUwQixDQUFDO0lBRTNFLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM5QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBR0QsV0FB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XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ0hpZ2hsaWdodGVkVmFsdWV9IGZyb20gJy4vaGlnaGxpZ2h0ZWQtdmFsdWUnO1xuaW1wb3J0IHtOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZX0gZnJvbSAnLi9oaWdobGlnaHRlci1wYXR0ZXJuLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1RhZ30gZnJvbSAnLi91dGlsL2ludGVyZmFjZXMnO1xuaW1wb3J0IHtlc2NhcGVIdG1sLCBIaWdobGlnaHRlZCwgaXNDb29yZGluYXRlV2l0aGluUmVjdH0gZnJvbSAnLi91dGlsL3V0aWxzJztcblxuLyoqXG4gKiBUaGUgSGlnaGxpZ2h0ZXIgQ29tcG9uZW50XG4gKi9cbkBDb21wb25lbnQoe1xuICBleHBvcnRBczogJ25nSGlnaGxpZ2h0ZXInLFxuICBzZWxlY3RvcjogJ25nLWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGU6ICc8ZGl2ICpuZ0Zvcj1cImxldCBsaW5lIG9mIGxpbmVzXCIgW2lubmVySFRNTF09XCJsaW5lXCI+PC9kaXY+JyxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgTmdIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIC8qKlxuICAgKiBUZXh0IHZhbHVlIHRvIGJlIGhpZ2hsaWdodGVkXG4gICAqL1xuICBASW5wdXQoKSB0ZXh0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIHdoZW4gYSBoaWdobGlnaHRlZCBpdGVtIGl0IGNsaWNrZWRcbiAgICovXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2s6IEV2ZW50RW1pdHRlcjxOZ0hpZ2hsaWdodGVkVmFsdWU+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0hpZ2hsaWdodGVkVmFsdWU+KCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZSkgcGF0dGVybnM6IFF1ZXJ5TGlzdDxOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZT47XG5cbiAgcmVhZG9ubHkgbmV3TGluZTogUmVnRXhwID0gL1xcbi9nO1xuICBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBoaWdobGlnaHRlZEVsZW1lbnRzOiBIaWdobGlnaHRlZFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgndGV4dCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5wYXJzZUxpbmVzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRleHQgJiYgdGhpcy5wYXR0ZXJucykge1xuICAgICAgdGhpcy5wYXJzZUxpbmVzKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICBvbkl0ZW1DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IG1hdGNoZWRFbGVtZW50ID0gdGhpcy5nZXRNYXRjaGVkRWxlbWVudChldmVudCk7XG4gICAgaWYgKG1hdGNoZWRFbGVtZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjb250ZW50ID0gKDxIVE1MRWxlbWVudD5tYXRjaGVkRWxlbWVudC5lbGVtZW50KS5pbm5lclRleHQ7XG4gICAgICBsZXQgcmVsID0gbWF0Y2hlZEVsZW1lbnQuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpIHx8IG51bGw7XG4gICAgICBjb25zdCByZWxFbGVtZW50ID0gbWF0Y2hlZEVsZW1lbnQuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbcmVsXScpO1xuICAgICAgaWYgKHJlbEVsZW1lbnQpIHtcbiAgICAgICAgcmVsID0gcmVsRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpIHx8IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLml0ZW1DbGljay5lbWl0KG5ldyBOZ0hpZ2hsaWdodGVkVmFsdWUoY29udGVudCwgbWF0Y2hlZEVsZW1lbnQudHlwZSwgcmVsKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUxpbmVzKCkge1xuICAgIHRoaXMubGluZXMgPSB0aGlzLnRleHQuc3BsaXQodGhpcy5uZXdMaW5lKS5tYXAoKGxpbmU6IHN0cmluZykgPT4gdGhpcy5oaWdobGlnaHQobGluZSkpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB0aGlzLmNvbGxlY3RIaWdobGlnaHRlZEl0ZW1zKCk7XG4gIH1cblxuICBwcml2YXRlIGhpZ2hsaWdodChsaW5lOiBzdHJpbmcpIHtcbiAgICBpZiAobGluZS5sZW5ndGggPT09IDAgfHwgIXRoaXMucGF0dGVybnMpIHtcbiAgICAgIHJldHVybiAnJm5ic3A7JztcbiAgICB9XG5cbiAgICBjb25zdCB0YWdzOiBUYWdbXSA9IFtdO1xuICAgIGxldCBtYXRjaDtcbiAgICB0aGlzLnBhdHRlcm5zLmZvckVhY2goKHBhdHRlcm46IE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlKSA9PiB7XG4gICAgICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5tYXRjaChsaW5lKSkgIT09IG51bGwpIHtcbiAgICAgICAgdGFncy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBwYXR0ZXJuLmNsYXNzTmFtZSxcbiAgICAgICAgICBpbmRpY2VzOiB7c3RhcnQ6IG1hdGNoLmluZGV4LCBlbmQ6IG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RofSxcbiAgICAgICAgICBmb3JtYXR0ZXI6IHBhdHRlcm4uZm9ybWF0XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJldlRhZ3M6IFRhZ1tdID0gW107XG4gICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG4gICAgWy4uLnRhZ3NdLnNvcnQoKHRhZ0EsIHRhZ0IpID0+IHRhZ0EuaW5kaWNlcy5zdGFydCAtIHRhZ0IuaW5kaWNlcy5zdGFydCkuZm9yRWFjaCgodGFnOiBUYWcpID0+IHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkTGVuZ3RoID0gdGFnLmluZGljZXMuZW5kIC0gdGFnLmluZGljZXMuc3RhcnQ7XG4gICAgICBjb25zdCBjb250ZW50cyA9IGxpbmUuc2xpY2UodGFnLmluZGljZXMuc3RhcnQsIHRhZy5pbmRpY2VzLmVuZCk7XG4gICAgICBpZiAoY29udGVudHMubGVuZ3RoID09PSBleHBlY3RlZExlbmd0aCkge1xuICAgICAgICBjb25zdCBwcmV2SW5kZXggPSBwcmV2VGFncy5sZW5ndGggPiAwID8gcHJldlRhZ3NbcHJldlRhZ3MubGVuZ3RoIC0gMV0uaW5kaWNlcy5lbmQgOiAwO1xuICAgICAgICBjb25zdCBiZWZvcmUgPSBsaW5lLnNsaWNlKHByZXZJbmRleCwgdGFnLmluZGljZXMuc3RhcnQpO1xuICAgICAgICBwYXJ0cy5wdXNoKGVzY2FwZUh0bWwoYmVmb3JlKSk7XG4gICAgICAgIHBhcnRzLnB1c2goYDxzcGFuIGNsYXNzPVwiaGlnaGxpZ2h0ZWQgJHt0YWcudHlwZSB8fCAnJ31cIiByZWw9XCIke3RhZy50eXBlfVwiPiR7dGFnLmZvcm1hdHRlcihjb250ZW50cyl9PC9zcGFuPmApO1xuICAgICAgICBwcmV2VGFncy5wdXNoKHRhZyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCByZW1haW5pbmdTdGFydCA9IHByZXZUYWdzLmxlbmd0aCA+IDAgPyBwcmV2VGFnc1twcmV2VGFncy5sZW5ndGggLSAxXS5pbmRpY2VzLmVuZCA6IDA7XG4gICAgY29uc3QgcmVtYWluaW5nID0gbGluZS5zbGljZShyZW1haW5pbmdTdGFydCk7XG4gICAgcGFydHMucHVzaChlc2NhcGVIdG1sKHJlbWFpbmluZykpO1xuICAgIHBhcnRzLnB1c2goJyZuYnNwOycpO1xuXG4gICAgcmV0dXJuIHBhcnRzLmpvaW4oJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRNYXRjaGVkRWxlbWVudChldmVudDogTW91c2VFdmVudCk6IEhpZ2hsaWdodGVkIHtcbiAgICBjb25zdCBtYXRjaGVkID0gdGhpcy5oaWdobGlnaHRlZEVsZW1lbnRzLmZpbmQoXG4gICAgICAgIChlbDogSGlnaGxpZ2h0ZWQpOiBib29sZWFuID0+IGlzQ29vcmRpbmF0ZVdpdGhpblJlY3QoZWwuY2xpZW50UmVjdCwgZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSkpO1xuXG4gICAgcmV0dXJuIG1hdGNoZWQgPyBtYXRjaGVkIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgY29sbGVjdEhpZ2hsaWdodGVkSXRlbXMoKSB7XG4gICAgdGhpcy5oaWdobGlnaHRlZEVsZW1lbnRzID0gQXJyYXkuZnJvbSgoPEVsZW1lbnQ+dGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2hpZ2hsaWdodGVkJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyZWwnKSB8fCBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBIaWdobGlnaHRlZChlbGVtZW50LCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==