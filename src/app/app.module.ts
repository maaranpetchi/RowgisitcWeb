import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TermsandconditionComponent } from './Components/termsandcondition/termsandcondition.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; // For Firestore database
import { environment } from 'src/Environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { ContactusComponent } from './Components/contactus/contactus.component';


import { FirestoreModule } from '@angular/fire/firestore'; // Import the correct module


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ContactusComponent,
    TermsandconditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    ReactiveFormsModule,
    HttpClientModule,
    NgxDocViewerModule,
    provideFirebaseApp( ()=> initializeApp(environment.firebaseConfig)),
    provideFirestore(()=> getFirestore()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireModule  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }