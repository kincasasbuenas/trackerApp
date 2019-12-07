import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { LoginPage } from '../login/login';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lat: number;
  lng: number ;
  user:any ={};

  constructor(public navCtrl: NavController, public _ubicacion:UbicacionProvider, public _usuario:UsuarioProvider) {
    this._ubicacion.iniciarGeolocalizacion();
    this._ubicacion.iniciarConductor();
    this._ubicacion.conductor.valueChanges().subscribe(data=>{
      this.user = data;
    })
  }

  salir(){
    
    this._ubicacion.stopUbicacion();
    this._usuario.limpiarUsuario();
    this.navCtrl.setRoot(LoginPage);
  }

}
