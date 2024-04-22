import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Connection, ConnectionStatus, ConnectionStatusEvent, DataRecievedEvent } from "types/connection";

export class FakeConnection extends Connection<number[]> {

  constructor(
    public options?: {
      connectionTime?: number
    }
  ){
    super();
  }

  async connect() {
    console.log(`FakeConnection->connecting`);
    this._changeStatus(ConnectionStatus.Connecting);
    await new Promise((res) => setTimeout(res, this.options?.connectionTime ?? 2000));
    console.log(`FakeConnection->connected`);
    this._changeStatus(ConnectionStatus.Connected);
  }

  async disconnect() {
    console.log(`FakeConnection->disconnect`);
    this._changeStatus(ConnectionStatus.Disconnected);
  }

  async send(data: number[]): Promise<void> {
    console.log(`FakeConnection->send`, data.slice());
    await Promise.resolve();
  }

}
