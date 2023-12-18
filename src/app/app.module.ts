import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './public/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomePageClientComponent } from './private/home-page-client/home-page-client.component';
import { NotificationBarComponent } from './shared/notification-bar/notification-bar.component';
import { HeaderComponent } from './shared/header/header.component';
import { MessageApplicationComponent } from './private/message-application/message-application.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {NgxPaginationModule} from 'ngx-pagination';


//LE MODULE DE MON APPLICATION , CA CONTIENT TOUT LES IMPORTS NECESSAIRES AINSI QUE LES COMPONENTS DE L'APP

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomePageClientComponent,
    NotificationBarComponent,
    HeaderComponent,
    MessageApplicationComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
