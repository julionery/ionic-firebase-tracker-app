import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Usuario} from "../../interfaces/usuario";

@Injectable()
export class UsuarioFB {

    usuarioCollection: AngularFirestoreCollection<Usuario>;
    private usuario = {
        codigo: "",
        nome: "",
        telefone: "",
        endereco: "",
        status: "",
        tipo: "",
        lat: 0,
        lng: 0,
        data_atualizacao: 0,
        codigo_cliente: "",
        codigo_frota: "",
        codigo_rota: ""
    };

    constructor(private afDB: AngularFirestore) {
        this.usuarioCollection = afDB.collection<Usuario>('usuarios');
    }

    setUsuario(usuarioI: Usuario) {
        return new Promise((resolve, reject) => {
            this.usuario.codigo = usuarioI.codigo;
            this.usuario.nome = usuarioI.nome;
            this.usuario.telefone = usuarioI.telefone;
            this.usuario.endereco = usuarioI.endereco;
            this.usuario.lat = 0;
            this.usuario.lng = 0;
            this.usuario.data_atualizacao = Date.now();
            this.usuario.codigo_cliente = "";
            this.usuario.codigo_frota = "";
            this.usuario.codigo_rota = "";
            this.usuario.status = "ativo";
            this.usuario.tipo = "user";

            this.usuarioCollection.doc(usuarioI.codigo).set(this.usuario)
                .then( data => {
                    resolve(true);
                }).catch(ex => {
                resolve(false);
            });
        });
    }

}
