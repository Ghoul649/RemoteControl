import { BehaviorSubject, Subscription } from "rxjs";
import { Connection } from "types/connection";
import { ByteValueControl } from "./control";

export class ControllerService<T extends Connection<number[]>> {

  public readonly controls = {
    velocity: new ByteValueControl('0x01', 0, true, 1000),
    stearingWheels: new ByteValueControl('0x02', 0, true)
  } as const;

  private _connection?: T;
  public get connection(): T | undefined {
    return this._connection;
  }

  private _subscription?: Subscription;

  constructor(private _connectionBuilder: () => T){}

  async startConnection(){
    this._subscription?.unsubscribe();
    if(this._connection){
      await this._connection.disconnect();
    }

    this._connection = this._connectionBuilder();

    await this._connection.connect();

    this._subscription = new Subscription();
    const keys = Object.keys(this.controls) as (keyof typeof this.controls)[];
    for (const key of keys) {
      const control = this.controls[key];
      const sub = control.createOutput().subscribe(result => this.connection?.send([0x00, ...result]));
      this._subscription.add(sub);
    }

  }

}
