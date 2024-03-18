import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TermsandconditionComponent } from './Components/termsandcondition/termsandcondition.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    TermsandconditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    NgxDocViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
