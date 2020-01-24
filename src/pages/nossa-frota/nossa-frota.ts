import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ModalController} from 'ionic-angular';
import {GalleryModal} from 'ionic-gallery-modal';
import {AngularFirestore} from "angularfire2/firestore";
import {Cliente} from "../../interfaces/cliente";

/**
 * Generated class for the NossaFrotaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-nossa-frota',
    templateUrl: 'nossa-frota.html',
})
export class NossaFrotaPage {
    galeria: Cliente[] = [];

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                db: AngularFirestore) {
        var loading = this.loadingCtrl.create({
            content: 'Carregando...'
        });
        loading.present();

        db.collection('fotos_frota', ref => ref.where('status', '==', 'ativo')
            .orderBy('ordem')).valueChanges()
            .subscribe((data: Cliente[]) => {
                this.galeria = data;
                console.log(data);
                loading.dismiss();
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NossaFrotaPage');
    }

}
