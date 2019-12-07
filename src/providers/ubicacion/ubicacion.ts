import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UsuarioProvider } from '../usuario/usuario';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class UbicacionProvider {

  conductor:AngularFirestoreDocument<any>;
  private  _watch: Subscription;

  constructor(private _geo:Geolocation, 
              public _user:UsuarioProvider, 
              private db:AngularFirestore) {

    //this.conductor = db.doc(`/usuarios/${_user.clave}`);

  }

  iniciarConductor(){
    this.conductor = this.db.doc(`/usuarios/${this._user.clave}`);
  }

  iniciarGeolocalizacion(){
    this._geo.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log(resp.coords);
      this.conductor.update({
        lat:resp.coords.latitude,
        lng:resp.coords.longitude,
        clave: this._user.clave
      });

      this._watch = this._geo.watchPosition().subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log('Watch: ',data.coords);
      this.conductor.update({
          lat:data.coords.latitude,
          lng:data.coords.longitude,
          clave: this._user.clave
        });
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  stopUbicacion(){
    try {
      this._watch.unsubscribe();
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    
  }

}
