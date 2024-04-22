import { BehaviorSubject, Observable, Subject } from "rxjs";

export enum ConnectionStatus {
  Disconnected,
  Connecting,
  Connected
}

export class ConnectionStatusEvent {
  constructor(
    public prevStatus: ConnectionStatus,
    public newStatus: ConnectionStatus
  ){}
}
export class DataRecievedEvent<T> {
  constructor(public data: T){}
}


export abstract class Connection<T = number[]> {
  private _status: ConnectionStatus = ConnectionStatus.Disconnected;
  public get status(): ConnectionStatus {
    return this._status;
  }
  protected readonly _output$ = new Subject<DataRecievedEvent<T> | ConnectionStatusEvent>();
  readonly output$ = this._output$.asObservable();
  abstract connect(): void;
  abstract disconnect(): void;
  abstract send(data: T): Promise<void>;
  protected _changeStatus(newStatus: ConnectionStatus){
    if(this._status === newStatus){
      return;
    }
    this._output$.next(new ConnectionStatusEvent(
      this._status,
      this._status = newStatus
    ));
  }
}
