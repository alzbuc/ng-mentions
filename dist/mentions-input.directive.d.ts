import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgMentionsComponent } from './mentions.component';
import * as i0 from "@angular/core";
/**
 * The NgMentionsAccessorDirective directive is used to indicate the input element.
 */
export declare class NgMentionsAccessorDirective implements OnInit, OnDestroy, ControlValueAccessor {
    private element;
    private host;
    private _onChange;
    private _onTouch;
    private _destroyed;
    constructor(element: ElementRef, host: NgMentionsComponent);
    ngOnInit(): void;
    ngOnDestroy(): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(value: string): void;
    onChange(value: string): void;
    onTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgMentionsAccessorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgMentionsAccessorDirective, "ng-mentions", ["ngMentions"], {}, {}, never>;
}
