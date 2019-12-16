import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgComponent } from './svg/svg.component';
import { SvgViewComponent } from './svg-view/svg-view.component';
import { SvgAdminComponent } from './svg-admin/svg-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgComponent,
    SvgViewComponent,
    SvgAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
