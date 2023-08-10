import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
import { NgHighlighterComponent } from './highlighter.component';
import { NgMentionsAccessorDirective } from './mentions-input.directive';
import { NgMentionsComponent } from './mentions.component';
import { HighlightedDirective } from './util/highlight.directive';
import { NgMentionsListComponent } from './util/mentions-list.component';
import * as i0 from "@angular/core";
export { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
export { NgHighlighterComponent } from './highlighter.component';
export { NgMentionsAccessorDirective } from './mentions-input.directive';
export { NgMentionsComponent } from './mentions.component';
const EXPORT_DIRECTIVES = [
    NgMentionsComponent,
    NgMentionsAccessorDirective,
    NgHighlighterComponent,
    NgHighlighterPatternDirective,
];
const DECLARATIONS = [
    NgMentionsComponent,
    NgMentionsAccessorDirective,
    NgMentionsListComponent,
    HighlightedDirective,
    NgHighlighterComponent,
    NgHighlighterPatternDirective,
];
export class NgMentionsModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsModule, declarations: [NgMentionsComponent,
            NgMentionsAccessorDirective,
            NgMentionsListComponent,
            HighlightedDirective,
            NgHighlighterComponent,
            NgHighlighterPatternDirective], imports: [CommonModule, FormsModule], exports: [NgMentionsComponent,
            NgMentionsAccessorDirective,
            NgHighlighterComponent,
            NgHighlighterPatternDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsModule, imports: [CommonModule, FormsModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.0", ngImport: i0, type: NgMentionsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule],
                    exports: EXPORT_DIRECTIVES,
                    declarations: DECLARATIONS,
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTdDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOztBQUV6RSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNoRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN6RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUUzRCxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLG1CQUFtQjtJQUNuQiwyQkFBMkI7SUFDM0Isc0JBQXNCO0lBQ3RCLDZCQUE2QjtDQUM5QixDQUFDO0FBQ0YsTUFBTSxZQUFZLEdBQUc7SUFDbkIsbUJBQW1CO0lBQ25CLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLHNCQUFzQjtJQUN0Qiw2QkFBNkI7Q0FDOUIsQ0FBQztBQVFGLE1BQU0sT0FBTyxnQkFBZ0I7dUdBQWhCLGdCQUFnQjt3R0FBaEIsZ0JBQWdCLGlCQWQzQixtQkFBbUI7WUFDbkIsMkJBQTJCO1lBQzNCLHVCQUF1QjtZQUN2QixvQkFBb0I7WUFDcEIsc0JBQXNCO1lBQ3RCLDZCQUE2QixhQUluQixZQUFZLEVBQUUsV0FBVyxhQWZuQyxtQkFBbUI7WUFDbkIsMkJBQTJCO1lBQzNCLHNCQUFzQjtZQUN0Qiw2QkFBNkI7d0dBaUJsQixnQkFBZ0IsWUFMakIsWUFBWSxFQUFFLFdBQVc7OzJGQUt4QixnQkFBZ0I7a0JBTjVCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsWUFBWSxFQUFFLFlBQVk7b0JBQzFCLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlIH0gZnJvbSAnLi9oaWdobGlnaHRlci1wYXR0ZXJuLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOZ0hpZ2hsaWdodGVyQ29tcG9uZW50IH0gZnJvbSAnLi9oaWdobGlnaHRlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdNZW50aW9uc0FjY2Vzc29yRGlyZWN0aXZlIH0gZnJvbSAnLi9tZW50aW9ucy1pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNZW50aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vbWVudGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IEhpZ2hsaWdodGVkRGlyZWN0aXZlIH0gZnJvbSAnLi91dGlsL2hpZ2hsaWdodC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNZW50aW9uc0xpc3RDb21wb25lbnQgfSBmcm9tICcuL3V0aWwvbWVudGlvbnMtbGlzdC5jb21wb25lbnQnO1xuXG5leHBvcnQgeyBOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZSB9IGZyb20gJy4vaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUnO1xuZXhwb3J0IHsgTmdIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcbmV4cG9ydCB7IE5nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZSB9IGZyb20gJy4vbWVudGlvbnMtaW5wdXQuZGlyZWN0aXZlJztcbmV4cG9ydCB7IE5nTWVudGlvbnNDb21wb25lbnQgfSBmcm9tICcuL21lbnRpb25zLmNvbXBvbmVudCc7XG5cbmNvbnN0IEVYUE9SVF9ESVJFQ1RJVkVTID0gW1xuICBOZ01lbnRpb25zQ29tcG9uZW50LFxuICBOZ01lbnRpb25zQWNjZXNzb3JEaXJlY3RpdmUsXG4gIE5nSGlnaGxpZ2h0ZXJDb21wb25lbnQsXG4gIE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlLFxuXTtcbmNvbnN0IERFQ0xBUkFUSU9OUyA9IFtcbiAgTmdNZW50aW9uc0NvbXBvbmVudCxcbiAgTmdNZW50aW9uc0FjY2Vzc29yRGlyZWN0aXZlLFxuICBOZ01lbnRpb25zTGlzdENvbXBvbmVudCxcbiAgSGlnaGxpZ2h0ZWREaXJlY3RpdmUsXG4gIE5nSGlnaGxpZ2h0ZXJDb21wb25lbnQsXG4gIE5nSGlnaGxpZ2h0ZXJQYXR0ZXJuRGlyZWN0aXZlLFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxuICBleHBvcnRzOiBFWFBPUlRfRElSRUNUSVZFUyxcbiAgZGVjbGFyYXRpb25zOiBERUNMQVJBVElPTlMsXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdNZW50aW9uc01vZHVsZSB7fVxuIl19