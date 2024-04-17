import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { ConnectionSelectorComponent } from "./components/connection-selector/connection-selector.component";
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    MatCommonModule,
    MatCardModule,
    MatRippleModule
  ],
  declarations: [
    AppComponent,
    ConnectionSelectorComponent
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
