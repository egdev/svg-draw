import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SvgComponent } from './svg/svg.component';
import { SvgViewComponent } from './svg-view/svg-view.component';
import { SvgAdminComponent } from './svg-admin/svg-admin.component';


const routes: Routes = [
  { path: '', component: SvgViewComponent, pathMatch: 'full' },
  { path: 'edit', component: SvgAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
