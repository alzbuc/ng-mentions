import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
import { NgHighlighterComponent } from './highlighter.component';
import { NgMentionsAccessorDirective } from './mentions-input.directive';
import { NgMentionsComponent } from './mentions.component';
import { HighlightedDirective } from './util/highlight.directive';
import { NgMentionsListComponent } from './util/mentions-list.component';
import * as i0 from "@angular/core";
export { NgHighlighterComponent } from './highlighter.component';
export { NgHighlighterPatternDirective } from './highlighter-pattern.directive';
export { NgMentionsAccessorDirective } from './mentions-input.directive';
export { NgMentionsComponent } from './mentions.component';
const EXPORT_DIRECTIVES = [
    NgMentionsComponent,
    NgMentionsAccessorDirective,
    NgHighlighterComponent,
    NgHighlighterPatternDirective,
];
const DECLARATIONS = [
    NgMentionsComponent, NgMentionsAccessorDirective, NgMentionsListComponent, HighlightedDirective,
    NgHighlighterComponent, NgHighlighterPatternDirective
];
export class NgMentionsModule {
}
NgMentionsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgMentionsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsModule, declarations: [NgMentionsComponent, NgMentionsAccessorDirective, NgMentionsListComponent, HighlightedDirective,
        NgHighlighterComponent, NgHighlighterPatternDirective], imports: [CommonModule, FormsModule], exports: [NgMentionsComponent,
        NgMentionsAccessorDirective,
        NgHighlighterComponent,
        NgHighlighterPatternDirective] });
NgMentionsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsModule, imports: [[CommonModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: NgMentionsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, FormsModule],
                    exports: EXPORT_DIRECTIVES,
                    declarations: DECLARATIONS
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQzlFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOztBQUV2RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUM5RSxPQUFPLEVBQUMsMkJBQTJCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUN2RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV6RCxNQUFNLGlCQUFpQixHQUFHO0lBQ3hCLG1CQUFtQjtJQUNuQiwyQkFBMkI7SUFDM0Isc0JBQXNCO0lBQ3RCLDZCQUE2QjtDQUM5QixDQUFDO0FBQ0YsTUFBTSxZQUFZLEdBQUc7SUFDbkIsbUJBQW1CLEVBQUUsMkJBQTJCLEVBQUUsdUJBQXVCLEVBQUUsb0JBQW9CO0lBQy9GLHNCQUFzQixFQUFFLDZCQUE2QjtDQUN0RCxDQUFDO0FBT0YsTUFBTSxPQUFPLGdCQUFnQjs7NkdBQWhCLGdCQUFnQjs4R0FBaEIsZ0JBQWdCLGlCQVQzQixtQkFBbUIsRUFBRSwyQkFBMkIsRUFBRSx1QkFBdUIsRUFBRSxvQkFBb0I7UUFDL0Ysc0JBQXNCLEVBQUUsNkJBQTZCLGFBSXpDLFlBQVksRUFBRSxXQUFXLGFBWHJDLG1CQUFtQjtRQUNuQiwyQkFBMkI7UUFDM0Isc0JBQXNCO1FBQ3RCLDZCQUE2Qjs4R0FZbEIsZ0JBQWdCLFlBSmhCLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQzsyRkFJM0IsZ0JBQWdCO2tCQUw1QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFlBQVksRUFBRSxZQUFZO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7TmdIaWdobGlnaHRlclBhdHRlcm5EaXJlY3RpdmV9IGZyb20gJy4vaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUnO1xuaW1wb3J0IHtOZ0hpZ2hsaWdodGVyQ29tcG9uZW50fSBmcm9tICcuL2hpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5pbXBvcnQge05nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZX0gZnJvbSAnLi9tZW50aW9ucy1pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHtOZ01lbnRpb25zQ29tcG9uZW50fSBmcm9tICcuL21lbnRpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQge0hpZ2hsaWdodGVkRGlyZWN0aXZlfSBmcm9tICcuL3V0aWwvaGlnaGxpZ2h0LmRpcmVjdGl2ZSc7XG5pbXBvcnQge05nTWVudGlvbnNMaXN0Q29tcG9uZW50fSBmcm9tICcuL3V0aWwvbWVudGlvbnMtbGlzdC5jb21wb25lbnQnO1xuXG5leHBvcnQge05nSGlnaGxpZ2h0ZXJDb21wb25lbnR9IGZyb20gJy4vaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcbmV4cG9ydCB7TmdIaWdobGlnaHRlclBhdHRlcm5EaXJlY3RpdmV9IGZyb20gJy4vaGlnaGxpZ2h0ZXItcGF0dGVybi5kaXJlY3RpdmUnO1xuZXhwb3J0IHtOZ01lbnRpb25zQWNjZXNzb3JEaXJlY3RpdmV9IGZyb20gJy4vbWVudGlvbnMtaW5wdXQuZGlyZWN0aXZlJztcbmV4cG9ydCB7TmdNZW50aW9uc0NvbXBvbmVudH0gZnJvbSAnLi9tZW50aW9ucy5jb21wb25lbnQnO1xuXG5jb25zdCBFWFBPUlRfRElSRUNUSVZFUyA9IFtcbiAgTmdNZW50aW9uc0NvbXBvbmVudCxcbiAgTmdNZW50aW9uc0FjY2Vzc29yRGlyZWN0aXZlLFxuICBOZ0hpZ2hsaWdodGVyQ29tcG9uZW50LFxuICBOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZSxcbl07XG5jb25zdCBERUNMQVJBVElPTlMgPSBbXG4gIE5nTWVudGlvbnNDb21wb25lbnQsIE5nTWVudGlvbnNBY2Nlc3NvckRpcmVjdGl2ZSwgTmdNZW50aW9uc0xpc3RDb21wb25lbnQsIEhpZ2hsaWdodGVkRGlyZWN0aXZlLFxuICBOZ0hpZ2hsaWdodGVyQ29tcG9uZW50LCBOZ0hpZ2hsaWdodGVyUGF0dGVybkRpcmVjdGl2ZVxuXTtcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZV0sXG4gICAgZXhwb3J0czogRVhQT1JUX0RJUkVDVElWRVMsXG4gICAgZGVjbGFyYXRpb25zOiBERUNMQVJBVElPTlNcbn0pXG5leHBvcnQgY2xhc3MgTmdNZW50aW9uc01vZHVsZSB7XG59XG4iXX0=