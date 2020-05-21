import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { PatientLocationPage } from '../pages/patient-location/patient-location';
import { LastKnownWellPage } from '../pages/last-known-well/last-known-well';
import { ImagingRequiredPage } from '../pages/imaging-required/imaging-required';
import { TreatmentPage } from '../pages/treatment/treatment';
import { MapPage } from '../pages/map/map';
import { EvtOptionsPage } from '../pages/evt-options/evt-options';
import { ComponentsTimerComponent } from '../components/components-timer/components-timer';
import { SpinnerComponent } from '../components/spinner/spinner';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AgmCoreModule } from '@agm/core';
import { HelpPage } from '../pages/help/help';
import { ImagingPage } from '../pages/imaging/imaging';
import { TPaQuestionPage } from '../pages/t-pa-question/t-pa-question';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataServiceProvider } from '../providers/data-service';
import { AngularFirestore } from 'angularfire2/firestore';
import { HttpClientModule} from "@angular/common/http";
import { WeatherService } from '../pages/patient-location/weather';
import { RoutingProvider } from '../providers/routing';

@NgModule({
  declarations: [
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    MapPage,
    ComponentsTimerComponent,
    SpinnerComponent,
    HelpPage,
    ImagingPage,
    TPaQuestionPage,
    EvtOptionsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2GRIwOatzPmiamkpv3znVK8hi9g4lGoU',
      libraries: ['geometry','places']
    }),
     AngularFireModule.initializeApp({
     apiKey: "AIzaSyB6NmY0iFundTq06rk3mpc5Wk7LwbWdUw0",
     authDomain: "degree-project-database.firebaseapp.com",
     databaseURL: "https://degree-project-database.firebaseio.com",
     projectId: "degree-project-database",
     storageBucket: "degree-project-database.appspot.com",
     messagingSenderId: "527765428487",
     appId: "1:527765428487:web:57170a630f65e0bc8b4da2",
     measurementId: "G-ML39B2PXC4"
     }),
     AngularFireDatabaseModule,
     AngularFireAuthModule,
     HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PatientLocationPage,
    LastKnownWellPage,
    ImagingRequiredPage,
    TreatmentPage,
    MapPage,
    HelpPage,
    ImagingPage,
    TPaQuestionPage,
    EvtOptionsPage
  ],
  providers: [
    DataServiceProvider,
    StatusBar,
    SplashScreen,
    Geolocation,
    AngularFirestore,
    HttpClientModule,
    WeatherService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RoutingProvider
  ]
})
export class AppModule {}
