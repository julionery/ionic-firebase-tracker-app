import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {IonicStorageModule} from '@ionic/storage';

// Pages
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LoginPage, LoginPage2, LoginPage3, LoginPage4, LoginPage5} from '../pages/login/login';
import {ConfigPage} from "../pages/config/config";
import {FrotaPage} from "../pages/home/frota";
import {PerfilPage} from "../pages/perfil/perfil";
import {InstitucionalPage} from "../pages/institucional/institucional";
import {EmpresaPage} from "../pages/empresa/empresa";
import {ServicosPage} from "../pages/servicos/servicos";
import {NossaFrotaPage} from "../pages/nossa-frota/nossa-frota";
import {FaleConoscoPage} from "../pages/fale-conosco/fale-conosco";

// Providers
import {UsuarioProvider} from '../providers/usuario/usuario';
import {LocalStorage} from "../providers/banco/localStorage";
import {UsuarioFB} from "../providers/firebase/usuarioFB";

// Plugins
import {AgmCoreModule} from '@agm/core';
import {Geolocation} from '@ionic-native/geolocation';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

// Firebase
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {firebaseConfig} from '../config/firebase.config';
import {UbicacionProvider} from '../providers/ubicacion/ubicacion';


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        FrotaPage,
        ConfigPage,
        LoginPage,
        LoginPage2,
        LoginPage3,
        LoginPage4,
        LoginPage5,
        PerfilPage,
        InstitucionalPage,
        EmpresaPage,
        ServicosPage,
        NossaFrotaPage,
        FaleConoscoPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        ionicGalleryModal.GalleryModalModule,
        IonicStorageModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA-HXVa2jtkGfKtIJwisxgC46RaWqC1xuI'
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        FrotaPage,
        ConfigPage,
        LoginPage,
        LoginPage2,
        LoginPage3,
        LoginPage4,
        LoginPage5,
        PerfilPage,
        InstitucionalPage,
        EmpresaPage,
        ServicosPage,
        NossaFrotaPage,
        FaleConoscoPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UsuarioProvider,
        LocalStorage,
        UbicacionProvider,
        Geolocation,
        UniqueDeviceID,
        UsuarioFB,
        {provide: HAMMER_GESTURE_CONFIG,useClass: ionicGalleryModal.GalleryModalHammerConfig}
    ]
})
export class AppModule {
}
