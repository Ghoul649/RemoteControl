import { Component, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, booleanAttribute } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

function toArray(val: string | string[]): string[]{
  return typeof val === 'string' ? [val] : val;
}

type Axis = 'x' | 'y'

@Directive({
  selector: 'app-stick-axis',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: StickAxisDirective,
    multi: true
  }]
})
export class StickAxisDirective implements ControlValueAccessor, OnInit, OnDestroy {
  @Input({
    alias: 'horizontal',
    transform: booleanAttribute
  })
  set _hAxis(val: boolean){
    this.axis = val ? 'x' : 'y'
  }

  @Input({
    alias: 'vertical',
    transform: booleanAttribute
  })
  set _vAxis(val: boolean){
    this.axis = val ? 'y' : 'x'
  }

  set axis(axis: Axis){
    if(this._initialized && axis !== this._axis){
      this._changeAxis(axis);
    }
    this._axis = axis;
  }
  get axis(){
    return this._axis;
  }
  private _axis: Axis = 'x';

  @Input({ alias: 'negative-key', transform: toArray }) negativeKey?: string[];
  @Input({ alias: 'positive-key', transform: toArray }) positiveKey?: string[];

  @Input()
  set value(val: number){
    this.writeValue(Math.max(Math.min(val, 1), -1));
    this.onChange?.(this._value);
  }
  get value(){
    return this._value;
  }

  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  get enabled(){
    return !this.disabled;
  }

  private _value: number = 0;

  public onChange?: (val: number) => void;
  public onTouched?: () => void;

  private _keyDownHandler = (e: KeyboardEvent) => this._onKeydown(e);
  private _keyUpHandler = (e: KeyboardEvent) => this._onKeyup(e);

  private _initialized = false;

  constructor(
    private _stick: StickComponent
  ){
    window.addEventListener('keydown', this._keyDownHandler);
    window.addEventListener('keyup', this._keyUpHandler);
  }

  ngOnInit(): void {
    this._setParentAxis();

    this._initialized = true;
  }

  private _changeAxis(newAxis: Axis){
    if (newAxis === 'x'){
      delete this._stick.yAxis;
    } else {
      delete this._stick.xAxis;
    }
    this._setParentAxis();
  }

  private _setParentAxis(){
    if(this.axis === 'x' ? this._stick.xAxis : this._stick.yAxis){
      throw new Error(`Duplicate axis ${this.axis}`);
    }
    if (this.axis === 'x'){
      this._stick.xAxis = this;
    } else {
      this._stick.yAxis = this;
    }
  }

  ngOnDestroy(): void {

  }

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _onKeydown(e: KeyboardEvent){
    if(this.positiveKey?.includes(e.key)){
      //this._writeValue(1);
      return;
    }
    if(this.negativeKey?.includes(e.key)){
      //this._writeValue(-1);
      return;
    }
  }

  private _onKeyup(e: KeyboardEvent){
    if(this.positiveKey?.includes(e.key) || this.negativeKey?.includes(e.key)){
      //this._writeValue(0);
      return;
    }
  }
}

@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrl: './stick.component.scss'
})
export class StickComponent implements OnDestroy {
  get viewX(){
    return this.xAxis?.value ?? 0;
  }
  get viewY(){
    return this.yAxis?.value ?? 0;
  }

  xAxis?: StickAxisDirective;
  yAxis?: StickAxisDirective;

  private _dragUnlisten?: () => void;
  private _touchUnlisten?: () => void;

  constructor(
    private _ref: ElementRef<HTMLElement>
  ){}

  ngOnDestroy(): void {

  }

  onTouchStart(e: TouchEvent){
    if (this._touchUnlisten || e.changedTouches.length === 0){
      return;
    }

    const mainTouch = e.changedTouches.item(0)!;
    navigator.vibrate(50);

    const startX = mainTouch.clientX;
    const startY = mainTouch.clientY;
    const startValX = this.xAxis?.value ?? 0;
    const startValY = this.yAxis?.value ?? 0

    const moveHandler = (e: TouchEvent) => {
      let touch: Touch | undefined;
      for(let i = 0; i < e.changedTouches.length; i++){
        const t = e.changedTouches.item(i)!;
        if (t.identifier === mainTouch.identifier){
          touch = t;
          break;
        }
      }
      if(!touch){
        return;
      }
      e.preventDefault();
      const width = this._ref.nativeElement.clientWidth;
      const height = this._ref.nativeElement.clientHeight;

      if (this.xAxis?.enabled){
        this.xAxis.value = startValX + 2 * (touch.clientX - startX) / width;
      }

      if (this.yAxis?.enabled){
        this.yAxis.value = startValY - 2 * (touch.clientY - startY) / height;
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      let touch: Touch | undefined;
      for(let i = 0; i < e.changedTouches.length; i++){
        const t = e.changedTouches.item(i)!;
        if (t.identifier === mainTouch.identifier){
          touch = t;
        }
      }
      if (touch){
        unlisten();
      }
    };

    const unlisten = () => {
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('touchend', touchEndHandler);
      delete this._touchUnlisten;
    }
    this._touchUnlisten = unlisten;

    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('touchend', touchEndHandler);
  }

  onStickMouseDown(e: MouseEvent){
    e.preventDefault();
    const startX = e.x;
    const startY = e.y;
    const startValX = this.xAxis?.value ?? 0;
    const startValY = this.yAxis?.value ?? 0

    this._dragUnlisten?.();
    delete this._dragUnlisten;

    const moveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const width = this._ref.nativeElement.clientWidth;
      const height = this._ref.nativeElement.clientHeight;

      if (this.xAxis?.enabled){
        this.xAxis.value = startValX + 2 * (e.x - startX) / width;
      }

      if (this.yAxis?.enabled){
        this.yAxis.value = startValY - 2 * (e.y - startY) / height;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      unlisten();
    };

    const unlisten = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      delete this._dragUnlisten;
    }
    this._dragUnlisten = unlisten;

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', mouseUpHandler);

  }
}
