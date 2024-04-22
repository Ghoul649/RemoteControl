import { CommonModule } from "@angular/common";
import { Component, ContentChild, Directive, Input, OnDestroy, booleanAttribute } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

function toArray(val: string | string[]): string[]{
  return typeof val === 'string' ? [val] : val;
}

type Axis = 'v' | 'h'

@Directive({
  selector: 'axis[vertical],axis[horizontal]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: AxisDirective, multi: true }]
})
export class AxisDirective implements ControlValueAccessor, OnDestroy {
  @Input({ alias: 'vertical', transform: (val: any) => booleanAttribute(val) ? 'v' : 'h' }) axis: Axis = 'h';

  @Input({ alias: 'negative-key', transform: toArray }) negativeKey?: string[];
  @Input({ alias: 'positive-key', transform: toArray }) positiveKey?: string[];

  public onChange?: (val: number) => void;
  public onTouched?: () => void;

  isDisabled: boolean = false;

  private _keyDownHandler = (e: KeyboardEvent) => this._onKeydown(e);
  private _keyUpHandler = (e: KeyboardEvent) => this._onKeyup(e);

  constructor(
    private _stick: StickComponent
  ){
    window.addEventListener('keydown', this._keyDownHandler);
    window.addEventListener('keyup', this._keyUpHandler);
  }

  ngOnDestroy(): void {

  }

  writeValue(obj: any): void {
    this._stick.writeValue(obj, this.axis);
  }

  registerOnChange(fn: any): void {
    this._stick.registerOnChange(fn, this.axis);
  }

  registerOnTouched(fn: any): void {
    this._stick.registerOnTouched(fn, this.axis);
  }

  setDisabledState(isDisabled: boolean): void {
    this._stick.setDisabledState(isDisabled, this.axis);
  }

  private _onKeydown(e: KeyboardEvent){
    if(this.positiveKey?.includes(e.key)){
      this._writeValue(1);
      return;
    }
    if(this.negativeKey?.includes(e.key)){
      this._writeValue(-1);
      return;
    }
  }

  private _onKeyup(e: KeyboardEvent){
    if(this.positiveKey?.includes(e.key) || this.negativeKey?.includes(e.key)){
      this._writeValue(0);
      return;
    }
  }

  private _writeValue(val: number){
    this.axis === 'h' ? this._stick.setValue(val) : this._stick.setValue(undefined, val);
  }
}

@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrl: './stick.component.scss'
})
export class StickComponent {
  _viewX: number = 0;
  _viewY: number = 0;

  private _x: number = 0;
  private _y: number = 0;

  xAxis?: AxisDirective;
  yAxis?: AxisDirective;

  setValue(x?: number, y?: number){
    if(x !== undefined){
      this._x = x;
      this._viewX = x;
      this.xAxis?.onChange?.(x);
    }
    if(y != undefined){
      this._y = y;
      this._viewY = y;
      this.xAxis?.onChange?.(y);
    }

    if(y !== undefined || x !== undefined){
      //TODO: update _viewX and _viewY;
    }
  }

  constructor(){
    this.setValue(undefined, 0);
  }


  writeValue(obj: any, axis: Axis): void {
    //this._writeValue(obj);
  }

  registerOnChange(fn: any, axis: Axis): void {
    //this.onChange = fn;
  }

  registerOnTouched(fn: any, axis: Axis): void {
    //this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean, axis: Axis): void {
    //this.isDisabled = isDisabled;
  }
}
