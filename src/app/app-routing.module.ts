import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './public/landing-page/landing-page.component';
import { HomePageClientComponent } from './private/home-page-client/home-page-client.component';
import { AuthGuard } from './auth.guard';
import { MessageApplicationComponent } from './private/message-application/message-application.component';

//IMPLEMENTATION DE LA SPA AVEC LE ROOTING 

//LES ROUTES JUSQU'ICI DE NOTRE APPLICATION
const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'login', component:LandingPageComponent},
  {path:'homePageClient',component:HomePageClientComponent,canActivate:[AuthGuard]},
  {path:'message/:id',component:MessageApplicationComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
