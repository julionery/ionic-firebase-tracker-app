import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public _usuarioProv: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }

  mostrarInput(){

    this.alertCtrl.create({
      title: 'Informe o usuário!',
      inputs: [{
        name: 'usuario',
        placeholder: 'Usuário...'
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },{
        text: 'Acessar',
        handler: data => {
          this.verificarUsuario( data.usuario )
        }
      }]
    }).present();

  }

  verificarUsuario( chave: string ) {

    let loading = this.loadingCtrl.create({
      content: 'Verificando...'
    });

    loading.present();

    this._usuarioProv.verificaUsuario( chave )
          .then( existe => {

            loading.dismiss();

            if ( existe ) {

              this.slides.lockSwipes(false);
              this.slides.freeMode = true;
              this.slides.slideNext()
              this.slides.lockSwipes(true);
              this.slides.freeMode = false;

            } else{ 
              this.alertCtrl.create({
                title:'Usuário incorreto!',
                subTitle: 'Fale com o administrador e tente novamente!',
                buttons: ['Aceitar']
              }).present();
            }
          })
  }

  ingresar(){

    this.navCtrl.setRoot( HomePage );

  }

}
