import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: 'control',
    loadChildren: () => import("modules/control/control.module").then(module => module.ControlModule),
  },
  {
    path: '**',
    redirectTo: 'control'
  },
];
