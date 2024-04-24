import { NgModule } from "@angular/core";
import { ControlComponent } from "./control.component";
import { SharedModule } from "modules/shared/shared.module";
import { RouterModule } from "@angular/router";
import { routes } from "./control.routes";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions, MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { InputSettingsComponent } from "./components/input-settings/input-settings.component";
import { MatSliderModule } from "@angular/material/slider";


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule
  ],
  declarations: [
    ControlComponent,
    InputSettingsComponent
  ],
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      appearance: 'outline',
    } as MatFormFieldDefaultOptions
  }]
})
export class ControlModule {}
