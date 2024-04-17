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
      baudRate: 9600
    });
  }
}
