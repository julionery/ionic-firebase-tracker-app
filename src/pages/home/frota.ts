import {Component} from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";
import {ModalController, NavParams, ViewController} from "ionic-angular";
import {LocalStorage} from "../../providers/banco/localStorage";
import {Frota} from "../../interfaces/frota";
import {Rota} from "../../interfaces/rota";

@Component({
    selector: 'page-frota',
    template: `
        <ion-header>
            <ion-navbar>
                <ion-title>
                    <label>Frota</label>
                </ion-title>
                <ion-buttons right>
                    <button style="color: white" ion-button icon-only (click)="sair()">
                        <ion-icon name="close"></ion-icon>
                    </button>
                </ion-buttons>
            </ion-navbar>

            <ion-item-group *ngFor="let group of groupedRotas">
                <ion-item-divider (click)="abrir(group.frota.codigo)"
                                  style="color: black; padding-bottom: 5px; padding-top: 5px;">
                    <strong style="font-size: 18px">{{ group.frota.nome }}</strong><span style="font-size: 12px"> - Ult. Atualização: {{group.frota.data_atualizacao | date:'dd/MM/yyyy - HH:mm'}} </span>
                </ion-item-divider>
                <ion-row *ngIf="isClick && group.frota.codigo == this.codigo_frota">
                    <ion-item *ngFor="let rota of group.rotas" (click)="seguir(group.frota, rota)">{{rota.nome}}
                    </ion-item>
                </ion-row>
            </ion-item-group>
        </ion-header>
        <ion-content style="background: transparent" (click)="sair()"></ion-content>

    `
})
export class FrotaPage {
    lat: number;
    lng: number;
    init = false;

    isClick = false;
    groupedRotas = [];

    frotas: Frota[] = [];
    codigo_cliente: string = "";
    codigo_frota: string = "";
    rotas: Rota[] = [];
    siguiendoA: string = null;
    siguiendoNombre: string = null;

    constructor(public viewCtrl: ViewController,
                private modalCtrl: ModalController,
                private navParams: NavParams,
                _sql: LocalStorage,
                db: AngularFirestore) {

        this.codigo_cliente = this.navParams.get('codigo_cliente');

        db.collection('frota',
            ref => ref.where('cliente_codigo', '==', this.codigo_cliente)
                .where('status', '==', 'ativo')
                .orderBy('nome')).valueChanges()
            .subscribe((data: Frota[]) => {
                this.frotas = [];
                this.frotas = data;

                let sortedFrotas = this.frotas.sort();

                sortedFrotas.forEach((value, index) => {

                    db.collection('rotas',
                        ref => ref.where('frota_codigo', '==', value.codigo)
                            .where('status', '==', 'ativo')
                            .orderBy('nome')).valueChanges()
                        .subscribe((rotas: Rota[]) => {
                            let newGroup = {
                                frota: value,
                                rotas: []
                            };

                            if (rotas)
                                newGroup.rotas = rotas;
                            else
                                newGroup.rotas[0] = "Nenhuma rota cadastrada!";

                            this.groupedRotas.push(newGroup);
                        });
                });
            });
    }

    abrir(codigo) {
        if (this.codigo_frota == codigo || this.codigo_frota == "")
            this.isClick = !this.isClick;
        else
            this.isClick = true;

        this.codigo_frota = codigo;
    }

    seguir(frota: Frota, rota: Rota) {
        this.viewCtrl.dismiss({frota: frota, rota: rota});
    }

    sair() {
        this.viewCtrl.dismiss();
    }
}
