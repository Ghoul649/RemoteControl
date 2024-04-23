import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { StickAxisDirective, StickComponent } from "./components/two-axis-stick/stick.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    StickComponent,
    StickAxisDirective
  ],
  providers: [],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,



    StickComponent,
    StickAxisDirective
  ]
})
export class SharedModule {}
