import { Component } from "@angular/core";
import { SerialConnection } from "../../services/serial-connection";
import { ControllerService } from "./services/controller-service";
import { FakeConnection } from "../../services/fake-connection";

@Component({
  selector: 'app-c-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss'
})
export class ControlComponent {
  public readonly control = new ControllerService(() => new FakeConnection());


  constructor(){

  }

  async connect(){
    await this.control.startConnection();
  }

  async connectBluetooth(){
    const filters = Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map<BluetoothLEScanFilter>(c => ({namePrefix: c}))
      .concat({name: ''});

    const device = await navigator.bluetooth.requestDevice({
      filters: filters,
      optionalServices: ['generic_access']
    });

  }
}
