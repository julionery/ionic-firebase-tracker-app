import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {UbicacionProvider} from '../../providers/ubicacion/ubicacion';
import {LoginPage} from '../login/login';
import {UsuarioProvider} from '../../providers/usuario/usuario';
import {AngularFirestore} from "angularfire2/firestore";
import {FrotaPage} from "./frota";
import {ConfigPage} from "../config/config";
import {LocalStorage} from "../../providers/banco/localStorage";
import {Rota} from "../../interfaces/rota";
import {Frota} from "../../interfaces/frota";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    lat: number = 0;
    lng: number = 0;
    user: any = {};

    init = false;

    codigo: string;
    codigo_cliente: string;
    codigo_frota: string;
    codigo_rota: string;
    frotas: Frota[] = [];
    rota: Rota[] = [];
    siguiendoA: string = null;
    seguindoNome: string = null;
    seguindoData: string = null;
    seguindoRota: string = null;

    db: AngularFirestore;

    constructor(db: AngularFirestore,
                public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                public popoverCtrl: PopoverController,
                public _ubicacionProv: UbicacionProvider,
                public _sql: LocalStorage,
                public _usuarioProv: UsuarioProvider) {
        this.db = db;

        this._ubicacionProv.iniciarGeoLocalizacion();
        this._ubicacionProv.inicializarUsuario();

        this._ubicacionProv.usuario.valueChanges()
            .subscribe(data => {
                this.user = data;
            });

        this.codigo_cliente = this.navParams.get('codigo_cliente');
        this.codigo_frota = this.navParams.get('codigo_frota');
        this.codigo_rota = this.navParams.get('codigo_rota');

        if (this.codigo_cliente && this.codigo_frota && this.codigo_rota) {
            this._carregaItensMaps();
        }
        else {
            this._carregaStorage().then((resolve) => {
                if (resolve)
                    this._carregaItensMaps();
                else
                    this.navCtrl.push(LoginPage);
            });
        }

    }

    sair() {
        this._ubicacionProv.detenerUbicacion();
        this._usuarioProv.borrarUsuario();
        this.navCtrl.setRoot(LoginPage);
    }

    _carregaStorage() {
        return new Promise((resolve, reject) => {
            this._sql.getStorage('codigo').then((item) => {
                this.codigo = item.toString();

                this._sql.getStorage('codigo_cliente').then((item) => {
                    this.codigo_cliente = item.toString();

                    this._sql.getStorage('codigo_frota').then((item) => {
                        this.codigo_frota = item.toString();

                        this._sql.getStorage('codigo_rota').then((item) => {
                            this.codigo_rota = item.toString();

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

    _carregaItensMaps() {

        this.db.collection('frota',
            ref => ref.where('cliente_codigo', '==', this.codigo_cliente)
                .where('status', '==', 'ativo')
                .orderBy('nome')).valueChanges()
            .subscribe((data: Frota[]) => {
                this.frotas = data;

                if (!this.init) {
                    this.lat = data[0].lat;
                    this.lng = data[0].lng;
                    this.init = true;

                    data.forEach(frota => {
                        if (frota.codigo === this.codigo_frota) {
                            this.seguir(frota, this.codigo_rota);
                        }
                    });
                }

                if (this.siguiendoA) {
                    data.forEach(frota => {
                        if (frota.codigo === this.siguiendoA) {
                            this.lat = frota.lat;
                            this.lng = frota.lng;
                        }
                    });
                }
            });

    }

    verificaNuloVazio(valor: string) {
        if (valor != null && valor != "")
            return true;
        else
            return false;
    }

    presentPopover() {
        let popover = this.modalCtrl.create(FrotaPage, {codigo_cliente: this.codigo_cliente});
        popover.present();
        popover.onDidDismiss((data) => {
            if (data) {
                this.seguir(data.frota, data.rota.codigo);
            }
        })
    }

    seguirButton(frota: Frota) {
        this.seguir(frota, frota.rota_padrao);
    }

    seguir(frota: Frota, rota) {
        this.siguiendoA = frota.codigo;
        this.seguindoNome = frota.nome;
        this.seguindoData = frota.data_atualizacao;

        this.lat = frota.lat;
        this.lng = frota.lng;

        if (rota)
            this.addRota(frota, rota);
    }

    addRota(frota: Frota, rota) {
        this.siguiendoA = frota.codigo;
        this.rota = [];
        this.db.collection('rota_itens', ref => ref
            .where('frota_codigo', '==', this.siguiendoA)
            .where('rota_codigo', '==', rota))
            .valueChanges()
            .subscribe((data: Rota[]) => {
                this.rota = this.transform(data, 'ordem');
            });
    }

    dejarDeSeguir() {
        this.siguiendoA = null;
        this.seguindoNome = null;
        this.seguindoData = null;
        this.rota = [];
    }

    goToConf() {
        this.navCtrl.push(ConfigPage);
    }

    transform(array: any[], field: string): any[] {
        array.sort((a: any, b: any) => {
            if (a[field] < b[field]) {
                return -1;
            } else if (a[field] > b[field]) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}