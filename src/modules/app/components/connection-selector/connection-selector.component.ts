import { Component, EventEmitter, Output } from "@angular/core";
import { ConnectionMode } from "types/connection-mode";

@Component({
  selector: 'rc-connection-selector',
  templateUrl: './connection-selector.component.html',
  styleUrl: './connection-selector.component.scss'
})
export class ConnectionSelectorComponent {
  readonly options = [{
      id: ConnectionMode.Direct,
      name: "Direct",
      description: "Directly connect to the device via COM-Port and Video receiver",
      enabled: true
    },
    {
      id: ConnectionMode.Remote,
      name: "Remote",
      description: "Connect to the intermediate server",
      enabled: false
    }
  ];

  @Output() readonly connectionModeSelected = new EventEmitter<ConnectionMode>();

  onCardClicked(option: typeof this.options[number]){
    if(option.enabled){
      this.connectionModeSelected.emit(option.id);
    }
  }
}
