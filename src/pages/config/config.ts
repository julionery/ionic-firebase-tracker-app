import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {PerfilPage} from "../perfil/perfil";
import {InstitucionalPage} from "../institucional/institucional";
import {EmpresaPage} from "../empresa/empresa";
import {ServicosPage} from "../servicos/servicos";
import {NossaFrotaPage} from "../nossa-frota/nossa-frota";
import {FaleConoscoPage} from "../fale-conosco/fale-conosco";

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-config',
    templateUrl: 'config.html',
})
export class ConfigPage {

    constructor(public navCtrl: NavController,
                private modalCtrl: ModalController,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfigPage');
    }

    openFacebook() {

    }

    openInstagram() {

    }

    openSite(){

    }

    look_perfil() {
        let modal: any;
        modal = this.modalCtrl.create(PerfilPage);
        modal.present();
    }

    look_institucional() {
        let modal: any;
        modal = this.modalCtrl.create(InstitucionalPage);
        modal.present();
    }

    look_empresa() {
        let modal: any;
        modal = this.modalCtrl.create(EmpresaPage);
        modal.present();
    }

    look_servicos() {
        let modal: any;
        modal = this.modalCtrl.create(ServicosPage);
        modal.present();
    }

    look_nossaFrota() {
        let modal: any;
        modal = this.modalCtrl.create(NossaFrotaPage);
        modal.present();
    }

    look_faleConcosco() {
        let modal: any;
        modal = this.modalCtrl.create(FaleConoscoPage);
        modal.present();
    }

}
