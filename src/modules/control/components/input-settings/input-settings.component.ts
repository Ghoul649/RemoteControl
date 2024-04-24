import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, NonNullableFormBuilder } from "@angular/forms";
import { InputSettings } from "types/forms/input-settings";

@Component({
  selector: 'app-input-settings',
  templateUrl: './input-settings.component.html',
  styleUrl: './input-settings.component.scss'
})
export class InputSettingsComponent implements OnInit {
  @Input({required: true}) value?: InputSettings;
  @Output() readonly applied = new EventEmitter<InputSettings>();

  form?: ReturnType<typeof this._buildForm>;

  constructor(
    private _fb: NonNullableFormBuilder
  ){}

  ngOnInit(): void {
    this.form = this._buildForm(this.value ?? {});
  }

  private _buildForm(value: InputSettings) {
    return this._fb.group<{
      [key in keyof InputSettings]: FormControl<InputSettings[key]>
    }>({
      joystickSize: this._fb.control(value.joystickSize)
    });
  }

  applySettings(){
    if(!this.form || this.form.invalid){
      return;
    }

    this.applied.emit(this.form.value);
  }
}
