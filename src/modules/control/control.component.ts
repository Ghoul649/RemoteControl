import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SerialConnection } from "../../services/serial-connection";
import { ControllerService } from "./services/controller-service";
import { FakeConnection } from "../../services/fake-connection";
import nipplejs from "nipplejs";
import { Connection } from "types/connection";
import { InputSettings } from "types/forms/input-settings";
import { AUTO_STYLE, animate, state, style, transition, trigger } from "@angular/animations";


const defaultSettings: Required<InputSettings> = {
  joystickSize: 128
}

const inputSettingsKey = "inputSettings";

@Component({
  selector: 'app-c-control',
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  animations: [
    trigger("collapsed", [
      state('false', style({
        height: AUTO_STYLE,
        paddingBlock: '8px'
      })),
      state('true', style({
        height: '0px',
        paddingBlock: '0px'
      })),
      transition("false <=> true", [
        animate("250ms ease-out")
      ])
    ])
  ]
})
export class ControlComponent implements OnInit, OnDestroy {
  readonly connectionTypes = ['fake', 'serial', 'bluetooth'] as const;
  public readonly control = new ControllerService();

  @ViewChild('container', {static: true}) containerRef!: ElementRef<HTMLElement>;

  settings: Required<InputSettings>;
  connectionType?: typeof this.connectionTypes[number];
  hideHeader: boolean = false;
  disableAction: boolean = false;


  private _joystickManager?: nipplejs.JoystickManager;

  constructor(private _zone: NgZone){
    const storedValue = localStorage.getItem(inputSettingsKey);
    const storedSettings = storedValue ? JSON.parse(storedValue) : {};
    this.settings = {
      ...defaultSettings,
      ...storedSettings
    };
  }

  ngOnInit(): void {
    this._setupJoystick();
  }

  private _setupJoystick(){
    if(this._joystickManager){
      this._joystickManager.destroy();
      delete this._joystickManager;
    }

    this._joystickManager = nipplejs.create({
      zone: this.containerRef.nativeElement,
      color: "#fff5",
      dynamicPage: true,
      size: this.settings.joystickSize
    });


    this._joystickManager.on('move', (_, e) => {
      this.control.controls.velocity.value = e.vector.y;
      this.control.controls.stearingWheels.value = e.vector.x;
    });

    this._joystickManager.on('end', (_, e) => {
      this.control.controls.velocity.value = 0;
      this.control.controls.stearingWheels.value = 0;
    });
  }

  ngOnDestroy(): void {
    this._joystickManager?.destroy();
  }


  async connect(){
    if(!this.connectionType){
      return;
    }

    this.disableAction = true;

    try {
      let builder: () => Connection<number[]>;
      switch(this.connectionType){
        case "serial":
          builder = await this._serialConnection();
          break;

        case "fake":
          builder = await this._fakeConnection();
          break;

        case "bluetooth":
          builder = await this._bluetoothConnection();
          break;
      }

      await this.control.startConnection(builder);
    } finally {
      this.disableAction = false;
    }
  }

  async disconnect(){
    try {
      await this.control.stopConnection();
    } finally {
      this.disableAction = false;
    }
  }

  private async _fakeConnection(){
    return () => new FakeConnection();
  }

  private async _serialConnection(){
    return () => new SerialConnection();
  }

  private async _bluetoothConnection(){
    const filters = Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
      .map<BluetoothLEScanFilter>(c => ({namePrefix: c}))
      .concat({name: ''});

    const device = await navigator.bluetooth.requestDevice({
      filters: filters,
      optionalServices: ['generic_access']
    });
    throw new Error("not implemented");
    return null as any;
  }

  setInputSettings(settings: InputSettings){
    this.settings = {
      ...defaultSettings,
      ...settings
    };

    localStorage.setItem(inputSettingsKey, JSON.stringify(this.settings));
    this._setupJoystick();
  }
}
