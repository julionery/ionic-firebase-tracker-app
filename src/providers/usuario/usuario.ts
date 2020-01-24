import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {LoadingController, Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Subscription} from 'rxjs/Subscription';
import {LocalStorage} from "../banco/localStorage";

@Injectable()
export class UsuarioProvider {

    codigo: string;
    codigo_cliente: string;
    codigo_frota: string;
    codigo_rota: string;
    user: any = {};

    private doc: Subscription;

    constructor(private afDB: AngularFirestore,
                private loadingCtrl: LoadingController,
                private platform: Platform,
                private _sql: LocalStorage,
                private storage: Storage) {
    }

    verificaUsuario(codigo: string) {
        codigo = codigo.toLocaleLowerCase();
        return new Promise((resolve, reject) => {

            this.doc = this.afDB.doc(`/usuarios/${ codigo }`)
                .valueChanges().subscribe(data => {

                    if (data) {
                        // correcto
                        this.codigo = codigo;
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
            this.storage.set('codigo', this.codigo);

        } else {
            // Escritorio
            localStorage.setItem('codigo', this.codigo);
        }
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

    cargarStorage() {

        let loading = this.loadingCtrl.create({
            content: 'Carregando...'
        });

        loading.present();

        return new Promise((resolve, reject) => {
            this._sql.getStorage('codigo').then((item) => {
                this.codigo = item.toString();

                this._sql.getStorage('codigo_cliente').then((item) => {
                    this.codigo_cliente = item.toString();

                    this._sql.getStorage('codigo_frota').then((item) => {
                        this.codigo_frota = item.toString();

                        this._sql.getStorage('codigo_rota').then((item) => {
                            this.codigo_rota = item.toString();
                            loading.dismiss();

                            if (this.verificaNuloVazio(this.codigo) && this.verificaNuloVazio(this.codigo_cliente) && this.verificaNuloVazio(this.codigo_frota) && this.verificaNuloVazio(this.codigo_rota)) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    });
                });
            });
        });
    }

    verificaNuloVazio(valor: string) {
        if (valor != null && valor != "")
            return true;
        else
            return false;
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
