import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SvgAdminComponent } from './svg-admin/svg-admin.component';
import { FrontComponent } from './front/front.component';


const routes: Routes = [
  { path: '', component: FrontComponent, pathMatch: 'full' },
  { path: 'edit', component: SvgAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
