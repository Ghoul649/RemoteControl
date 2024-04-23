import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { routes } from "./app.routes";
import { SharedModule } from "modules/shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { MatCommonModule } from "@angular/material/core";


@NgModule({
  imports: [
    BrowserModule,
    MatCommonModule,
    SharedModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  declarations: [
    AppComponent
  ],
  providers: [

  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
