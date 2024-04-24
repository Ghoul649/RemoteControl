import { BehaviorSubject, Subscription } from "rxjs";
import { Connection } from "types/connection";
import { ByteValueControl } from "./control";

export class ControllerService {

  public readonly controls = {
    velocity: new ByteValueControl('0x01', 0, true, 1000),
    stearingWheels: new ByteValueControl('0x02', 0, true)
  } as const;

  private _connection?: Connection<number[]>;
  public get connection() {
    return this._connection;
  }
  private _connectionBuilder?: () => Connection<number[]>;

  private _subscription?: Subscription;

  constructor(){}


  async startConnection(builder: () => Connection<number[]>){
    await this.stopConnection();

    const connection = builder();
    await connection.connect();

    this._connectionBuilder = builder;
    this._connection = connection;

    this._subscription = new Subscription();
    const keys = Object.keys(this.controls) as (keyof typeof this.controls)[];
    for (const key of keys) {
      const control = this.controls[key];
      const sub = control.createOutput().subscribe(result => this.connection?.send([0x00, ...result]));
      this._subscription.add(sub);
    }
  }

  async stopConnection(){
    this._subscription?.unsubscribe();
    delete this._subscription;
    delete this._connectionBuilder;

    if(this._connection){
      await this._connection.disconnect();
      delete this._connection;
    }
  }

}
