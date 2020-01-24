import {Injectable} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';

import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {UsuarioProvider} from '../usuario/usuario';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class UbicacionProvider {

    usuario: AngularFirestoreDocument<any>;
    private watch: Subscription;

    constructor(private afDB: AngularFirestore,
                private geolocation: Geolocation,
                public _usuarioProv: UsuarioProvider) {
    }

    inicializarUsuario() {
        this.usuario = this.afDB.doc(`/usuarios/${ this._usuarioProv.codigo }`);
    }

    iniciarGeoLocalizacion() {
        this.geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            this.usuario.update({
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
                codigo: this._usuarioProv.codigo,
                data_atualizacao: Date.now()
            });

            this.watch = this.geolocation.watchPosition()
                .subscribe((data) => {
                    // data can be a set of coordinates, or an error (if an error occurred).
                    // data.coords.latitude
                    // data.coords.longitude
                    this.usuario.update({
                        lat: data.coords.latitude,
                        lng: data.coords.longitude,
                        codigo: this._usuarioProv.codigo,
                        data_atualizacao: Date.now()
                    });
                });
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    detenerUbicacion() {
        try {
            this.watch.unsubscribe();
        } catch (e) {
            console.log(JSON.stringify(e));
        }
    }

}
