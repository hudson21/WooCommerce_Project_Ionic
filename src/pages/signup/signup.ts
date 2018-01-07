import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import * as WC from 'woocommerce-api';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: any = {};/* Declaramos la variable que utilizamos en el ngModel*/
  billing_shipping_same: boolean;/*Declaramos una variable booleana */
  WooCommerce: any;/*Declaramos la variable para poder acceder a la API de WooCommerce */
  showCloseButton: boolean = false;/*Declaramos una variable para mostrar o no un botón */

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
  public alertCtrl:AlertController) {
    this.newUser.billing_address = {};/* Inicializamos los valores de las propiedades del objeto newUser*/
    this.newUser.shipping_address = {};/* Inicializamos los valores de las propiedades del objeto newUser*/
    this.billing_shipping_same = false;/* Inicializamos la variable que nos va a permitir deducir si los datos 
    de la dirección son los mismo que se van a poner en la dirección de envío*/

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret: "cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  /* Dentro de esta función solo cambiamos el estado de billing_shipping_same a su estado contrario*/
  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail() {
    let validEmail = false; /* Para validar el email*/
    /*Tenemos una expresión regular para comparar la estructura del email */
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /* Comparamos la expresión regular con el valor llenado por el usuario en el campo de email*/
    if (reg.test(this.newUser.email)) {
      //email looks valid
      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then((data) => {
        let res = (JSON.parse(data.body));

        if (res.errors) { /* El error debo de ver para que sirve*/
          validEmail = true;
          /* Con el toastCtrl podemos emitir mensajes en la pantalla del usuario */
          this.toastCtrl.create({
            message: "Congratulations. Email is good to go.",
            duration: 3000,
          }).present();
        } else {
          validEmail = false;

          this.toastCtrl.create({
            message: "Email already registered. Please check.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);
      })

    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "invalid Email. Please check.",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }

  }

  signup() {
    let customerData = {
      customer: {}
    }

    customerData.customer = {
      "email": this.newUser.email,
      "first_name": this.newUser.first_name,
      "last_name": this.newUser.last_name,
      "username": this.newUser.username,
      "password": this.newUser.password,
      "billing_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.billing_address.address_1,
        "address_2": this.newUser.billing_address.address_2,
        "city": this.newUser.billing_address.city,
        "state": this.newUser.billing_address.state,
        "postcode": this.newUser.billing_address.postcode,
        "country": this.newUser.billing_address.country,
        "email": this.newUser.email,
        "phone": this.newUser.billing_address.phone
      },
      "shipping_address": {
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "company": "",
        "address_1": this.newUser.shipping_address.address_1,
        "address_2": this.newUser.shipping_address.address_2,
        "city": this.newUser.shipping_address.city,
        "state": this.newUser.shipping_address.state,
        "postcode": this.newUser.shipping_address.postcode,
        "country": this.newUser.shipping_address.country
      }
    }

    if (this.billing_shipping_same) {
      this.newUser.shipping_address = this.newUser.shipping_address;
    }

    this.WooCommerce.postAsync('customers', customerData).then((data) => {
      let response=(JSON.parse(data.body));

      if(response.customer){
         this.alertCtrl.create({
           title:"Account created",
           message:"Your account has been  created successfully! Please login to proceed.",
           buttons:[{
             text:"Login",
             handler:()=>{

             }
           }]
         }).present();
      } else if(response.errors){
        this.toastCtrl.create({
          message: response.errors[0].message,
          showCloseButton:true
        }).present();
      }
    })
  }

}
