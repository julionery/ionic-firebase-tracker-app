import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ViewController} from 'ionic-angular';

import {ViewChild} from '@angular/core';
import {Slides} from 'ionic-angular';
import {AlertController} from 'ionic-angular';

import {UsuarioProvider} from '../../providers/usuario/usuario';
import {HomePage} from '../home/home';
import {AngularFirestore} from "angularfire2/firestore";
import {UniqueDeviceID} from '@ionic-native/unique-device-id';

//Interfaces
import {Frota} from "../../interfaces/frota";
import {Cliente} from "../../interfaces/cliente";
import {Rota} from "../../interfaces/rota";
import {LocalStorage} from "../../providers/banco/localStorage";
import {Usuario} from "../../interfaces/usuario";
import {UsuarioFB} from "../../providers/firebase/usuarioFB";

@IonicPage()
@Component({
    selector: 'page-login',
    //templateUrl: 'login.html',
    template: `
        <ion-header>
            <ion-navbar color="primary">
                <ion-title>
                    <img width="32" height="32" src="assets/imgs/logoLeft.png"/>
                    <label>Tracker Bus</label>
                </ion-title>
            </ion-navbar>
        </ion-header>
        <ion-content padding>

            <ion-list>

                <ion-item *ngIf="uID == ''">
                    <ion-label floating>User ID</ion-label>
                    <ion-input [(ngModel)]="usuario.codigo" type="text"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label floating>Nome</ion-label>
                    <ion-input [(ngModel)]="usuario.nome" type="text"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label floating>Telefone</ion-label>
                    <ion-input [(ngModel)]="usuario.telefone" type="text"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label floating>Endereço</ion-label>
                    <ion-textarea [(ngModel)]="usuario.endereco" type="text"></ion-textarea>
                </ion-item>

            </ion-list>
        </ion-content>
        <ion-footer>
            <ion-toolbar>
                <ion-buttons>
                    <button ion-button icon-left (click)="verificaUsuario(usuario)">
                        <ion-icon name="archive"></ion-icon>
                        Verificar
                    </button>
                </ion-buttons>
                <ion-buttons end>
                    <button ion-button icon-right (click)="addUsuario(usuario)">
                        Continuar
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                    </button>
                </ion-buttons>
            </ion-toolbar>
        </ion-footer>
    `
})

export class LoginPage {

    @ViewChild(Slides) slides: Slides;
    db: AngularFirestore;

    rotas: Rota[] = [];
    usuario: Usuario[] = [];
    uID: string;

    codigo: string;
    codigo_cliente: string;
    codigo_frota: string;
    codigo_rota: string;

    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                private _usuarioProv: UsuarioProvider,
                private _usuarioFB: UsuarioFB,
                private _sql: LocalStorage,
                private uniqueDeviceID: UniqueDeviceID) {
        this.uniqueDeviceID.get()
            .then((uuid: any) => {
                this.uID = uuid;
            })
            .catch((error: any) => {
                this.uID = "";
                console.log(error)
            });

        this._sql.getStorage('codigo')
            .then(function (existe) {
                if (existe != false) {
                    this.codigo = existe;
                    if (this.codigo != "" && this.codigo != null)
                        this.pushPage();
                }
            });

    }

    mostrarInput() {

        this.alertCtrl.create({
            title: 'Informe o código!',
            inputs: [{
                name: 'usuario',
                placeholder: 'Usuário...'
            }],
            buttons: [{
                text: 'Cancelar',
                role: 'cancel'
            }, {
                text: 'Acessar',
                handler: data => {
                    this.verificarUsuario(data.usuario)
                }
            }]
        }).present();

    }

    verificaUsuario(usuario) {
        if (!usuario.codigo)
            usuario.codigo = this.uID;

        this.verificarUsuario(usuario.codigo);
    }

    addUsuario(usuario) {
        if (!usuario.codigo)
            usuario.codigo = this.uID;

        this._usuarioFB.setUsuario(usuario).then(data => {
            if (data) {
                this.pushPage();
            } else {
                this.alertCtrl.create({
                    title: "Ooooppss!",
                    subTitle: "<br />Falha ao cadastrar o usuário!",
                    buttons: ["OK"]
                }).present();
            }
        });
    }


    verificarUsuario(codigo: string) {

        if (codigo == "") {
            this.alertCtrl.create({
                title: "Ooooppss!",
                subTitle: "<br />Informe o User ID!",
                buttons: ["OK"]
            }).present();
            return;
        }

        let loading = this.loadingCtrl.create({
            content: 'Verificando...'
        });

        loading.present();

        this._usuarioProv.verificaUsuario(codigo)
            .then(existe => {

                loading.dismiss();

                if (existe) {
                    this.pushPage();
                } else {
                    this.alertCtrl.create({
                        title: 'Usuário incorreto!',
                        subTitle: 'Fale com o administrador e tente novamente!',
                        buttons: ['Aceitar']
                    }).present();
                }
            })
    }

    pushPage() {
        this.navCtrl.push(LoginPage2);
    }
}

@Component({
    template: `
        <ion-header>
            <ion-navbar color="secondary">
                <ion-title>
                    <ion-label text-wrap>
                        Pronto para começar?
                    </ion-label>
                </ion-title>
            </ion-navbar>
        </ion-header>
        <ion-content style="text-align: center">
            <img src="assets/imgs/check.jpg"
                 style=" max-height: 50%; max-width: 60%; margin: 18px 0; padding-top: 13%"/>
            <ion-label text-wrap style="margin-top: 2.8rem; font-size: 18px;">
                Configurações ajustadas com sucesso!
                <br/>
                <br/> Empresa: {{cliente.nome}}
                <br/> Frota: {{frota.nome}}
                <br/> Rota: {{rota.nome}}
            </ion-label>
        </ion-content>
        <ion-footer (click)="iniciar()">
            <ion-toolbar color="primary" style="text-align: center;">
                <ion-title icon-right> CONTINUAR
                    <ion-icon name="arrow-forward" style="font-size: 20px;"></ion-icon>
                </ion-title>
            </ion-toolbar>
        </ion-footer>
    `
})

export class LoginPage5 {
    db: AngularFirestore;

    rota: Rota;
    frota: Frota;
    cliente: Cliente;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                db: AngularFirestore) {
        this.db = db;
        this.rota = this.navParams.get('rota');
        this.frota = this.navParams.get('frota');
        this.cliente = this.navParams.get('cliente');
    }

    iniciar() {
        this.navCtrl.setRoot(HomePage, {
            codigo_rota: this.rota.codigo,
            codigo_frota: this.frota.codigo,
            codigo_cliente: this.cliente.codigo
        });
    }
}

@Component({
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>
                    Rotas
                </ion-title>
            </ion-navbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-list-header>
                    Escolha uma rota para acompanhar!
                </ion-list-header>
                <ion-item *ngFor="let item of rotas" (click)="pushPage(item)">
                    <ion-label>{{ item.nome }}</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `
})

export class LoginPage4 {
    db: AngularFirestore;

    frota: Frota;
    cliente: Cliente;
    rotas: Rota[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _sql: LocalStorage,
                public loadingCtrl: LoadingController,
                db: AngularFirestore) {
        this.db = db;
        this.frota = this.navParams.get('frota');
        this.cliente = this.navParams.get('cliente');
        this.buscaRotas(this.frota.codigo);
    }

    buscaRotas(frota_codigo: string) {
        let loading = this.loadingCtrl.create({
            content: 'Carregando...'
        });
        loading.present();

        this.db.collection('rotas',
            ref => ref.where('frota_codigo', '==', frota_codigo)
                .where('status', '==', 'ativo')
                .orderBy('nome')).valueChanges()
            .subscribe((data: Rota[]) => {
                this.rotas = data;
                loading.dismiss();

                if (this.rotas.length == 1) {
                    this.pushPage(this.rotas[0]);
                }
            });
    }

    pushPage(_rota) {
        this._sql.setStorage('codigo_rota', _rota.codigo);
        this.navCtrl.push(LoginPage5, {
            rota: _rota,
            cliente: this.cliente,
            frota: this.frota
        });
    }
}


@Component({
    template: `
        <ion-header>
            <ion-navbar color="danger">
                <ion-title>
                    Frota
                </ion-title>
            </ion-navbar>
        </ion-header>
        <ion-content>
            <ion-list>

                <ion-list-header>
                    Agora, escolha um ônibus!
                </ion-list-header>
                <ion-item *ngFor="let item of frotas" (click)="pushPage(item)">
                    <ion-label>{{ item.nome }}</ion-label>
                </ion-item>

            </ion-list>
        </ion-content>
    `
})

export class LoginPage3 {
    db: AngularFirestore;

    cliente: Cliente;
    frotas: Frota[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public _sql: LocalStorage,
                public loadingCtrl: LoadingController,
                db: AngularFirestore) {
        this.db = db;
        this.cliente = this.navParams.get('cliente');
        this.buscaFrotas(this.cliente.codigo);
    }

    buscaFrotas(cliente_codigo: string) {
        var loading = this.loadingCtrl.create({
            content: 'Carregando...'
        });
        loading.present();

        this.db.collection('frota',
            ref => ref.where('cliente_codigo', '==', cliente_codigo)
                .where('status', '==', 'ativo')
                .orderBy('nome')).valueChanges()
            .subscribe((data: Frota[]) => {
                this.frotas = data;
                loading.dismiss();

                if (this.frotas.length == 1) {
                    this.pushPage(this.frotas[0]);
                }
            });
    }

    pushPage(_frota) {
        this._sql.setStorage('codigo_frota', _frota.codigo);
        this.navCtrl.push(LoginPage4, {
            frota: _frota,
            cliente: this.cliente
        });
    }
}


@Component({
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>
                    Empresas
                </ion-title>
            </ion-navbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-list-header>
                    Escolha um empresa!
                </ion-list-header>
                <ion-item *ngFor="let item of clientes" (click)="pushPage(item)">
                    <ion-label>{{ item.nome }}</ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `
})

export class LoginPage2 {

    clientes: Cliente[] = [];

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public _sql: LocalStorage,
                db: AngularFirestore) {
        var loading = this.loadingCtrl.create({
            content: 'Carregando...'
        });
        loading.present();

        db.collection('clientes', ref => ref.where('status', '==', 'ativo')
            .orderBy('nome')).valueChanges()
            .subscribe((data: Cliente[]) => {
                this.clientes = data;
                loading.dismiss();

                if (this.clientes.length == 1) {
                    this.pushPage(this.clientes[0]);
                }
            });
    }

    pushPage(_cliente) {
        this._sql.setStorage('codigo_cliente', _cliente.codigo);
        this.navCtrl.push(LoginPage3, {
            cliente: _cliente
        });
    }

}



