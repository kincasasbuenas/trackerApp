import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, LoadingController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private _user: UsuarioProvider) {
  }

  ionViewDidLoad() {
    this.slides.paginationType = 'progress';
    this.slides.lockSwipes(true);
    this.slides.freeMode=false;
  }

  mostrarInput(){
    this.alertCtrl.create({
      title:'Ingrese el usuario',
      inputs:[{
        name:'username',
        placeholder:'Username'
      }],
      buttons:[{
        text:'Cancelar',
        role:'cancel'
      },{
        text:'Ingresar',
        handler: data =>{
          this.verificarUsuario(data.username);
          
        }
      }]
    }).present();
  }

  verificarUsuario(clave:string){
    let loading= this.loadingCtrl.create({
      content:'Verificando'
    });


    loading.present();

    this._user.verificaUsuario(clave).then( existe =>{
        loading.dismiss();
        if (existe) {
          this.slides.lockSwipes(false);
          this.slides.freeMode=true;
          this.slides.slideNext();
          this.slides.lockSwipes(true);
          this.slides.freeMode=false;
        }else{
          this.alertCtrl.create({
            title:'Usuario incorrecto',
            subTitle:'Contacte con el Administrador o Intenta de nuevo',
            buttons:['Aceptar']
          }).present();
        }
    });

    // setTimeout(() => {
    //   loading.dismiss();
    // }, 3000);
  }

  ingresar(){
    this.navCtrl.setRoot(HomePage);
  }
}
