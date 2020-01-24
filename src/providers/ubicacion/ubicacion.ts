import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';

import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {UsuarioProvider} from '../usuario/usuario';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {

    taxista: AngularFirestoreDocument<any>;
    private watch: Subscription;

    constructor(private afDB: AngularFirestore,
                private geolocation: Geolocation,
                public _usuarioProv: UsuarioProvider) {

        // this.taxista = afDB.doc(`/usuarios/${ _usuarioProv.chave }`);
    }

    inicializarTaxista() {
        this.taxista = this.afDB.doc(`/usuarios/${ this._usuarioProv.chave }`);
    }

    iniciarGeoLocalizacion() {

        this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            this.taxista.update({
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
                chave: this._usuarioProv.chave,
                data_atualizacao: Date.now()
            });

            this.watch = this.geolocation.watchPosition()
                .subscribe((data) => {
                    // data can be a set of coordinates, or an error (if an error occurred).
                    // data.coords.latitude
                    // data.coords.longitude
                    this.taxista.update({
                        lat: data.coords.latitude,
                        lng: data.coords.longitude,
                        chave: this._usuarioProv.chave,
                        data_atualizacao: Date.now()
                    });

                    console.log(this.taxista);
                });
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    detenerUbicacion() {
        try {
            if(!this.watch.closed) {
                this.watch.unsubscribe();
            }
        } catch (e) {
            console.log(JSON.stringify(e));
        }
    }

}
