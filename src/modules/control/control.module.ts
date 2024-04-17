import { NgModule } from "@angular/core";
import { ControlComponent } from "./control.component";
import { SharedModule } from "modules/shared/shared.module";
import { RouterModule } from "@angular/router";
import { routes } from "./control.routes";



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ControlComponent
  ],
  providers: []
})
export class ControlModule {}
