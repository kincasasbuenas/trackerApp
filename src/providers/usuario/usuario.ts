import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class UsuarioProvider {
  usuarios: Observable<any[]>;
  private _doc: Subscription; 
  clave: string;
  user:any = {};

  constructor(private db: AngularFirestore, private platform:Platform, private storage:Storage) {
   
  }

  verificaUsuario(clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve,reject)=>{
        this._doc = this.db.doc(`/usuarios/${clave}`).valueChanges().subscribe(data => {
          console.log(data);
          if(data){
            //correcto
            this.clave = clave;
            this.user = data;
            this.guardarStorage();
            resolve(true);
          }else{
            //incorrecto
            resolve(false);
          }
        })
    })
  }

  guardarStorage(){
    if(this.platform.is('cordova')){
      //celular
      this.storage.set('clave',this.clave);
    }else{
      localStorage.setItem('clave',this.clave);
    }
  }

  cargarStorage(){
    return new Promise((resolve, reject)=>{
      if(this.platform.is('cordova')){
        //celular
        this.storage.get('clave').then( val =>{
          if (val) {
            this.clave = val;
            resolve(true);
          }
          else{
            resolve(false);
          }
        })

      }else{
        //escritorio
        if(localStorage.getItem('clave')){
          this.clave= localStorage.getItem('clave');
          resolve(true);
        }
        else{
          resolve(false);
        }
      }
    })
  }

  limpiarUsuario(){
    this.clave = null;
    if(this.platform.is('cordova')){
      //celular
      this.storage.remove('clave');
    }else{
      //escritorio
      localStorage.removeItem('clave');
    }
    //para dejar de escuchar el objeto usuario.
    this._doc.unsubscribe();
  }
}
