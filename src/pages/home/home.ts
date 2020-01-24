import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UbicacionProvider} from '../../providers/ubicacion/ubicacion';
import {LoginPage} from '../login/login';
import {UsuarioProvider} from '../../providers/usuario/usuario';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    lat: number;
    lng: number;

    user: any = {};

    constructor(public navCtrl: NavController,
                public _ubicacionProv: UbicacionProvider,
                public _usuarioProv: UsuarioProvider) {

        this._ubicacionProv.iniciarGeoLocalizacion();
        this._ubicacionProv.inicializarTaxista();

        this._ubicacionProv.taxista.valueChanges()
            .subscribe(data => {
                this.user = data;
            });
    }


    salir() {
        this._ubicacionProv.detenerUbicacion();
        this._usuarioProv.borrarUsuario();
        this.navCtrl.setRoot(LoginPage);
    }


    clickedMarker(nome:string){
        console.log(nome);
    }
}
