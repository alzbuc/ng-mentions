import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NgMentionsComponent, NgMentionsModule } from './index';
import { createGenericTestComponent, createKeyEvent, expectResults, isBrowser } from './test/common';
import { Key } from './util/key';
import { NgMentionsListComponent } from './util/mentions-list.component';

@Component({ selector: 'test-cmp', template: '', styles: ['test-cmp {display: block;}'] })
class TestComponent {
  model: any = '';
  mentions: any = [];
}

const createTestComponent = (html: string) =>
  createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const isIE = isBrowser('ie');
const isIE10 = isBrowser('ie10');
const delayIE = isIE10 ? 6000 : 4000;

function createKeyDownEvent(key: Key) {
  const event = createKeyEvent({ key, type: 'keydown' });
  spyOn(event, 'preventDefault');
  spyOn(event, 'stopPropagation');
  return event;
}

function getNativeTextArea(element: HTMLElement): HTMLTextAreaElement {
  return <HTMLTextAreaElement>element.querySelector('textarea');
}

function getDropDown(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('mentions-list .dropdown-menu');
}

function changeTextArea(element: any, value: string, reset: boolean = false) {
  const input = getNativeTextArea(element);
  input.focus();
  if (!reset) {
    const evt = createKeyEvent({ key: value.charCodeAt(0), type: 'keydown', bubbles: true });
    triggerTextAreaEvent(element, evt);
    input.value += value;
  } else {
    input.value = value;
  }
  triggerTextAreaEvent(element, createKeyEvent({ type: 'input' }));
  input.setSelectionRange(input.value.length, input.value.length);
}

function triggerTextAreaEvent(element: any, event: any) {
  const input = getNativeTextArea(element);
  input.focus();
  input.dispatchEvent(event);
}

function getDebugInput(element: DebugElement): DebugElement {
  return element.query(By.directive(NgMentionsComponent));
}

function expectTextAreaValue(element: HTMLElement, value: string, exceptionFailOutput?: string) {
  expect(getNativeTextArea(element).value).toEqual(value, exceptionFailOutput);
}

function expectMentionListToBeHidden(element: DebugElement, hidden: boolean, exceptionFailOutput?: string) {
  const el = element.query(By.directive(NgMentionsListComponent));
  expect(el).toBeDefined(exceptionFailOutput);
  if (!hidden) {
    expect(el).not.toBeNull(exceptionFailOutput);
  } else {
    expect(el).toBeNull(exceptionFailOutput);
  }
}

function expectDropDownItems(element, expectedResults: string[]) {
  const dropDown = getDropDown(element);
  expect(dropDown).not.toBeNull();
  expectResults(dropDown, expectedResults);
}

function tickFixture(fixture: ComponentFixture<TestComponent>, millis?: number) {
  tick(millis);
  fixture.detectChanges();
}

describe('ng-mentions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NgMentionsModule, FormsModule, ReactiveFormsModule],
    });
  });

  describe('value accessor', () => {
    it('should format value', fakeAsync(() => {
      const plainTextValue = 'Test value with Mentions formatted\nAnd New Lines';
      const model = 'Test value with @[Mentions](type:1) formatted\nAnd @[New Lines](type:2)';

      const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');

      const el = fixture.nativeElement;
      const comp = fixture.componentInstance;

      expectTextAreaValue(el, '');

      const mentionComp: NgMentionsComponent = getDebugInput(fixture.debugElement).componentInstance;

      comp.model = model;
      fixture.detectChanges();
      tick();
      expect(comp.model).toBe(model);
      expect(mentionComp.displayContent).toEqual(plainTextValue);
    }));
  });

  it('should initialize', () => {
    const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');

    const originalValue = 'Test string @[Name](type:1)';
    fixture.componentInstance.model = originalValue;
    fixture.componentInstance.mentions = [{ display: 'Name2', type: 'type', id: 2 }];
    fixture.detectChanges();
    expect(fixture.componentInstance.model).toBe(originalValue);
    expect(fixture.componentInstance.mentions.length).toBe(1);
    expectMentionListToBeHidden(fixture.debugElement, true);
  });

  it('should select first mention on Enter', fakeAsync(() => {
    const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');

    const el = fixture.nativeElement;
    const comp = fixture.componentInstance;
    comp.mentions = [
      { display: 'item1', id: 1, type: 'type' },
      { display: 'item2', id: 2, type: 'type' },
      { display: 'item3', id: 3, type: 'type' },
    ];
    tickFixture(fixture);
    expect(comp.mentions.length).toEqual(3);
    tickFixture(fixture);

    const mentionComp: NgMentionsComponent = getDebugInput(fixture.debugElement).componentInstance;
    expect(mentionComp.mentions.length).toEqual(3);
    expectMentionListToBeHidden(fixture.debugElement, true);
    tickFixture(fixture);

    const triggerValue = '@';
    triggerTextAreaEvent(el, createKeyDownEvent(Key.Shift));
    tickFixture(fixture);
    changeTextArea(el, triggerValue);
    tickFixture(fixture, isIE ? delayIE : undefined);

    fixture.whenStable().then(() => {
      const mentionsList = fixture.debugElement.query(By.directive(NgMentionsListComponent));
      expect(mentionsList).toBeDefined();
      expect(mentionsList).not.toBeNull();
      expectMentionListToBeHidden(fixture.debugElement, false, 'MentionList should be shown');
      const mentionsListComp = mentionsList.componentInstance;
      expect(mentionsListComp.show).toBeTruthy('MentionList should be shown');
      expect(mentionsListComp.activeIndex).toBe(0, 'MentionList activeIndex should be 0');
      expect(mentionsListComp.selectedItem).not.toBeNull('MentionList selectedItem should not be null');
      expect(mentionsListComp.selectedItem.display).toEqual('item1');
      tickFixture(fixture);
      expectDropDownItems(el, ['+item1', 'item2', 'item3']);

      const event = createKeyDownEvent(Key.Enter);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);

      expect(mentionComp.displayContent).toEqual('item1');
      expect(comp.model).toEqual('@[item1](type:1)');
    });
  }));

  it('should display mentions list when open() is called', fakeAsync(() => {
    const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');

    const el = fixture.nativeElement;
    const comp = fixture.componentInstance;
    comp.mentions = [
      { display: 'item1', id: 1, type: 'type' },
      { display: 'item2', id: 2, type: 'type' },
      { display: 'item3', id: 3, type: 'type' },
    ];
    tickFixture(fixture);
    expect(comp.mentions.length).toEqual(3);
    tickFixture(fixture);

    const mentionComp: NgMentionsComponent = getDebugInput(fixture.debugElement).componentInstance;
    expect(mentionComp.mentions.length).toEqual(3);
    expectMentionListToBeHidden(fixture.debugElement, true);
    tickFixture(fixture);

    mentionComp.open();
    tickFixture(fixture, isIE ? delayIE : undefined);

    fixture.whenStable().then(() => {
      const mentionsList = fixture.debugElement.query(By.directive(NgMentionsListComponent));
      expect(mentionsList).toBeDefined();
      expect(mentionsList).not.toBeNull();
      expectMentionListToBeHidden(fixture.debugElement, false, 'MentionList should be shown');
      const mentionsListComp = mentionsList.componentInstance;
      expect(mentionsListComp.show).toBeTruthy('MentionList should be shown');
      expect(mentionsListComp.activeIndex).toBe(0, 'MentionList activeIndex should be 0');
      expect(mentionsListComp.selectedItem).not.toBeNull('MentionList selectedItem should not be null');
      expect(mentionsListComp.selectedItem.display).toEqual('item1');
      tickFixture(fixture);
      expectDropDownItems(el, ['+item1', 'item2', 'item3']);

      const event = createKeyDownEvent(Key.Enter);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);

      expect(mentionComp.displayContent).toEqual('item1');
      expect(comp.model).toEqual('@[item1](type:1)');
    });
  }));

  it('should make previous/next result active with up/down arrow keys', fakeAsync(() => {
    const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');

    const el = fixture.nativeElement;
    const comp = fixture.componentInstance;
    comp.mentions = [
      { display: 'item1', id: 1, type: 'type' },
      { display: 'item2', id: 2, type: 'type' },
      { display: 'item3', id: 3, type: 'type' },
    ];
    tickFixture(fixture);
    expect(comp.mentions.length).toEqual(3);
    tickFixture(fixture);

    const mentionComp: NgMentionsComponent = getDebugInput(fixture.debugElement).componentInstance;
    expect(mentionComp.mentions.length).toEqual(3);
    expectMentionListToBeHidden(fixture.debugElement, true);
    tickFixture(fixture);

    const triggerValue = '@';
    triggerTextAreaEvent(el, createKeyDownEvent(Key.Shift));
    tickFixture(fixture);
    changeTextArea(el, triggerValue);
    tickFixture(fixture, isIE ? delayIE : undefined);

    let event;
    fixture.whenStable().then(() => {
      const mentionsList = fixture.debugElement.query(By.directive(NgMentionsListComponent));
      expect(mentionsList).toBeDefined('MentionsList should be defined');
      expect(mentionsList).not.toBeNull('MentionsList should not be null');
      expectMentionListToBeHidden(fixture.debugElement, false, 'MentionList should be shown');
      const mentionsListComp = mentionsList.componentInstance;
      expect(mentionsListComp.show).toBeTruthy('MentionList should be shown');
      expect(mentionsListComp.activeIndex).toBe(0, 'MentionList activeIndex should be 0');
      expect(mentionsListComp.selectedItem).not.toBeNull('MentionList selectedItem should not be null');
      expect(mentionsListComp.selectedItem.display).toEqual('item1');
      tickFixture(fixture);
      expectDropDownItems(el, ['+item1', 'item2', 'item3']);

      // Down
      event = createKeyDownEvent(Key.ArrowDown);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mentionsListComp.activeIndex).toBe(1);

      // Up
      event = createKeyDownEvent(Key.ArrowUp);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mentionsListComp.activeIndex).toBe(0);

      // End
      event = createKeyDownEvent(Key.End);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mentionsListComp.activeIndex).toBe(2);

      // Home
      event = createKeyDownEvent(Key.Home);
      triggerTextAreaEvent(el, event);
      tickFixture(fixture);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mentionsListComp.activeIndex).toBe(0);
    });
  }));

  it('should remove mention on backspace into mention', fakeAsync(() => {
    const fixture = createTestComponent('<ng-mentions [mentions]="mentions" [(ngModel)]="model"></ng-mentions>');
    const comp = fixture.componentInstance;
    const mentionComp: NgMentionsComponent = getDebugInput(fixture.debugElement).componentInstance;

    const originalValue = '@[Name](type:1)';
    const plainTextValue = 'Nam';
    const expectedValue = '';
    fixture.componentInstance.model = originalValue;
    tickFixture(fixture);
    tickFixture(fixture);

    const textAreaElement = mentionComp.textAreaInputElement.nativeElement as HTMLTextAreaElement;
    const selection = textAreaElement.value.length - 1;
    textAreaElement.setSelectionRange(selection, selection);
    tickFixture(fixture);
    mentionComp.onSelect({ target: textAreaElement });
    tickFixture(fixture);
    mentionComp.onChange(plainTextValue);
    tickFixture(fixture);
    tickFixture(fixture);

    expect(mentionComp.displayContent).toEqual(expectedValue);
    expect(comp.model).toEqual(expectedValue);
  }));
});
