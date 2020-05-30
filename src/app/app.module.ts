import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from "angularfire2/auth";
import { ToastaModule } from 'ngx-toasta';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './shared/core/core.module';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { MaterialModule } from './shared/modules/material.module';
import { CreateGameModalComponent } from './create-game-modal/create-game-modal.component';
import { CreateNameModalComponent } from './create-name-modal/create-name-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent,
    CreateGameModalComponent,
    CreateNameModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    CoreModule,
    ToastaModule.forRoot(),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [CreateGameModalComponent, CreateNameModalComponent],
  exports: [MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
