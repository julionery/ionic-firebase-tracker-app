import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class LocalStorage {

    codigo: string;
    user: any = {};

    private doc: Subscription;

    constructor(private afDB: AngularFirestore,
                private platform: Platform,
                private storage: Storage) {
    }

    setStorage(chave: string, valor: string) {
        if (this.platform.is('cordova')) {
            // Celular
            this.storage.set(chave, valor);

        } else {
            // Escritorio
            localStorage.setItem(chave, valor);
        }
    }

    getStorage(chave: string) {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                // Celular
                this.storage.ready()
                    .then(() => {
                        this.storage.get(chave)
                            .then(item => {
                                console.log(item);
                                if (item)
                                    resolve(item);
                                else
                                    resolve("");
                            });
                    })
            } else {
                // Escritorio
                let item = localStorage.getItem(chave);
                if (item)
                    resolve(item);
                else
                    resolve("");
            }
        });
    }

    cargarStorage() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                // Celular
                this.storage.get('codigo').then(val => {
                    if (val) {
                        this.codigo = val;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                // Escritorio
                if (localStorage.getItem('codigo')) {
                    this.codigo = localStorage.getItem('codigo');
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    }


    borrarUsuario() {
        this.codigo = null;
        if (this.platform.is('cordova')) {
            this.storage.remove('codigo');
        } else {
            localStorage.removeItem('codigo');
        }
        this.doc.unsubscribe();
    }


}
