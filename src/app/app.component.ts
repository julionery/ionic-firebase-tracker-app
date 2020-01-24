import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UsuarioProvider } from '../providers/usuario/usuario';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public _usuarioProv: UsuarioProvider) {
    platform.ready().then(() => {
      
      _usuarioProv.cargarStorage().then( existe => {

        statusBar.styleDefault();
        splashScreen.hide();

        if ( existe ) {
          this.rootPage = HomePage;
        }else {
          this.rootPage = LoginPage;
        }

      });

    });
  }
}

