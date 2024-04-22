import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Connection, ConnectionStatus, ConnectionStatusEvent, DataRecievedEvent } from "types/connection";

export class SerialConnection implements Connection<number[]> {

  private _status: ConnectionStatus = ConnectionStatus.Disconnected;
  get status(): ConnectionStatus {
    return this._status;
  }

  private readonly _output$ = new Subject<DataRecievedEvent<number[]> | ConnectionStatusEvent>();
  readonly output$ = this._output$.asObservable();

  private _port?: SerialPort;
  private _writer?: WritableStreamDefaultWriter<Uint8Array>;


  constructor(
    public readonly baudRate: number = 9600
  ){

  }

  async connect() {
    if(this._port){
      await this.disconnect();
    }
    this._port = await navigator.serial.requestPort();
    this._changeStatus(ConnectionStatus.Connecting);
    await this._port.open({
      baudRate: this.baudRate
    });
    this._changeStatus(ConnectionStatus.Connected);
    this._writer = this._port.writable.getWriter();
    this._startReading();
  }

  private _changeStatus(newStatus: ConnectionStatus){
    if(this._status === newStatus){
      return;
    }
    this._output$.next(new ConnectionStatusEvent(
      this._status,
      this._status = newStatus
    ));
  }

  private async _startReading() {
    if(!this._port){
      throw new Error("Port is not set");
    }

    const reader = this._port.readable.getReader() as ReadableStreamDefaultReader<Uint8Array>;

    try {
      while(true){
        const result = await reader.read();
        //this.data$.next(result.value);
        if(result.value){
          this._output$.next(new DataRecievedEvent([...result.value]));
        }
        if(result.done){
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async disconnect() {
    if(!this._port){
      return;
    }
    await this._port.close();
    delete this._port;
  }

  async send(data: number[]): Promise<void> {
    await this._writer?.write(new Uint8Array(data));
  }

}
