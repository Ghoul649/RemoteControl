import { BehaviorSubject, Observable, Subject, Subscription, debounce, interval, map, of, startWith, switchMap } from "rxjs";
import { Byte, ByteString, toByte } from "types/byte";

export type ControlOptions<I, M> = {
  mapFn: (val: I) => M;
  mapOutputFn: (val: M) => number[] | number;
  throttle?: (val: M, prev: M | undefined) => number | undefined;
  repeat?: (val: M) => number | undefined;
}

export class BaseControl<I, M> {
  private _controlId: Byte;
  constructor(
    public readonly controlId: ByteString,
    private readonly input$: Observable<I>,
    private readonly _controlOptions: ControlOptions<I, M>
  ){
    this._controlId = toByte(this.controlId);
  }

  createOutput(): Observable<number[]> {
    let mapped$ = this.input$.pipe(
      map(this._controlOptions.mapFn)
    );


    if (this._controlOptions.throttle){
      const throttleFn = this._controlOptions.throttle;
      let lastEmitted: M | undefined = undefined;
      let lastTimeout: {
        timerId: number;
        promise: Promise<void>;
      } | undefined = undefined;

      mapped$ = mapped$.pipe(
        debounce(val => {
          const throttleTime = throttleFn(val, lastEmitted);
          if (throttleTime === undefined){
            lastTimeout && window.clearTimeout(lastTimeout.timerId);
            lastTimeout = undefined;
            return Promise.resolve();
          }

          if (lastTimeout != null){
            return lastTimeout.promise;
          }

          let timerId: number = 0;
          const promise = new Promise<void>(res => {
            timerId = window.setTimeout(() => {
              lastTimeout = undefined;
              res();
            }, throttleTime);
          });

          lastTimeout = {
            promise,
            timerId
          };

          return promise;
        })
      )
    }

    if (this._controlOptions.repeat){
      const repeatFn = this._controlOptions.repeat;

      mapped$ = mapped$.pipe(
        switchMap(val => {
          const repeatTime = repeatFn(val);
          if (repeatTime === undefined){
            return of(val);
          }
          return interval(repeatTime).pipe(
            startWith(val),
            map(() => val)
          );
        })
      )
    }

    return mapped$.pipe(
      map(val => {
        const mappedOutput = this._controlOptions.mapOutputFn(val);
        if(Array.isArray(mappedOutput)){
          return [this._controlId as number, ...mappedOutput];
        }
        return [this._controlId as number, mappedOutput];
      })
    );
  }
}

export class Control<I, M> extends BaseControl<I, M> {
  protected readonly _value$: BehaviorSubject<I>;

  public get value(){
    return this._value$.value;
  }

  public set value(val:I){
    this._value$.next(val);
  }

  constructor(controlId: ByteString, initValue: I, options: ControlOptions<I, M>){
    const value$ = new BehaviorSubject(initValue);
    super(controlId, value$, options);
    this._value$ = value$;
  }
}

export class ByteValueControl extends Control<number, number> {
  constructor(controlId: ByteString, initValue: number = 0, signed: boolean = true, repeat: number | undefined = undefined){
    const options: ControlOptions<number, number> = {
      mapFn: signed ? (x => Math.floor(x * 127 + 127)) : (x => Math.floor(x * 255)),
      mapOutputFn: x => x,
      throttle: (x, p) => {
        if (p === undefined){
          return undefined;
        }
        const dif = Math.abs(x - p);

        if (dif > 50){
          return undefined;
        }

        return 200;
      }
    };

    if(repeat !== undefined){
      options.repeat = signed ? (x => x === 127 ? undefined : repeat) : (x => x === 0 ? undefined : repeat);
    }

    super(controlId, initValue, options);
  }
}
