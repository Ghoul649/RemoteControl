import { Component } from "@angular/core";

@Component({
  selector: 'app-c-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss'
})
export class ControlComponent {
  constructor(){

  }



  async connect(){


    const port = await navigator.serial.requestPort();

    await port.open({
      baudRate: 9600,
    });
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
