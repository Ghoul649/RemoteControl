import { BehaviorSubject, of, switchMap } from "rxjs";
import { Connection, ConnectionStatus } from "types/connection";

export class ControlService<T extends Connection<number[]>> {

  private readonly _velocity = new BehaviorSubject(0);
  public get velocity(){
    return this._velocity.value;
  }
  public set velocity(val: number){
    this._velocity.next(Math.max(Math.min(val, 1), -1));
  }

  constructor(private _connectionBuilder: () => T){}


}
