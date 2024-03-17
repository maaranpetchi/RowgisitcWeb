import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/Rowgistic', pathMatch: 'full' }, // 

  { path: 'Rowgistic', component: LandingPageComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
