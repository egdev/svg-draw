import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SvgComponent } from './svg/svg.component';


const routes: Routes = [
  //{ path: '', component: SvgComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
