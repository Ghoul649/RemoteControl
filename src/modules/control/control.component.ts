import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SerialConnection } from "../../services/serial-connection";
import { ControllerService } from "./services/controller-service";
import { FakeConnection } from "../../services/fake-connection";
import nipplejs from "nipplejs";

@Component({
  selector: 'app-c-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss'
})
export class ControlComponent implements OnInit, OnDestroy {
  public readonly control = new ControllerService(() => new FakeConnection());

  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLElement>;

  private _joystickManager!: nipplejs.JoystickManager;

  constructor(private _zone: NgZone){

  }

  ngOnInit(): void {
    this._joystickManager = nipplejs.create({
      zone: this.containerRef.nativeElement,
      color: "#fff5",
      dynamicPage: true
    });

    this._joystickManager.on('move', (_, e) => {
      console.log(e);
      this.control.controls.stearingWheels.value = e.vector.x
    });

  }

  ngOnDestroy(): void {
    this._joystickManager.destroy();
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
