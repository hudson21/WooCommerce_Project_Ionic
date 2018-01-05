import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser:any={};
  billing_shipping_same:boolean;
  WooCommerce: any;
  showCloseButton:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl:ToastController) {
    this.newUser.billing_address={};
    this.newUser.shipping_address={};
    this.billing_shipping_same=false;

    this.WooCommerce = WC ({
      url: "http://localhost/wordpress",
      consumerKey:"ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret:"cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping(){
    this.billing_shipping_same= !this.billing_shipping_same;
  }

  checkEmail(){
    let validEmail=false;
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)){
      //email looks valid
      this.WooCommerce.getAsync('customers/email/'+this.newUser.email).then((data)=>{
        let res=(JSON.parse(data.body));

        if(res.errors){
           validEmail = true;

           this.toastCtrl.create({
             message:"Congratulations. Email is good to go.",
             duration:3000,
           }).present();
        }else {
          validEmail=false;

          this.toastCtrl.create({
            message:"Email already registered. Please check.",
            showCloseButton:true
          }).present();
        }

        console.log(validEmail);
     })

    }else{
      validEmail=false;
      this.toastCtrl.create({
        message:"invalid Email. Please check.",
        showCloseButton:true
      }).present();
      console.log(validEmail);
    }

  }

}
