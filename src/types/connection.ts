import { Observable } from "rxjs";

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


export interface Connection<T = number[]> {
  get status(): ConnectionStatus;
  readonly output$: Observable<DataRecievedEvent<T> | ConnectionStatusEvent>;
  connect(): void;
  disconnect(): void;
  send(data: T): Promise<void>;
}
