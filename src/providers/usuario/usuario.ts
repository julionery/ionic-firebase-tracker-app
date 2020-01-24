import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class UsuarioProvider {

    chave: string;
    user: any = {};

    private doc: Subscription;

    constructor(private afDB: AngularFirestore,
                private platform: Platform,
                private storage: Storage) {
    }

    verificaUsuario(chave: string) {
        chave = chave.toLocaleLowerCase();
        return new Promise((resolve, reject) => {

            this.doc = this.afDB.doc(`/usuarios/${ chave }`)
                .valueChanges().subscribe(data => {

                    if (data) {
                        // correcto
                        this.chave = chave;
                        this.user = data;
                        this.guardarStorage();
                        resolve(true);
                    } else {
                        // incorrecto
                        resolve(false);
                    }
                })
        });
    }


    guardarStorage() {
        if (this.platform.is('cordova')) {
            // Celular
            this.storage.set('chave', this.chave);

        } else {
            // Escritorio
            localStorage.setItem('chave', this.chave);
        }
    }

    cargarStorage() {
        return new Promise((resolve, reject) => {
            if (this.platform.is('cordova')) {
                // Celular
                this.storage.get('chave').then(val => {
                    if (val) {
                        this.chave = val;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                // Escritorio
                if (localStorage.getItem('chave')) {
                    this.chave = localStorage.getItem('chave');
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    }


    borrarUsuario() {
        this.chave = null;
        if (this.platform.is('cordova')) {
            this.storage.remove('chave');
        } else {
            localStorage.removeItem('chave');
        }
        if(this.doc){
            this.doc.unsubscribe();
        }
    }


}
