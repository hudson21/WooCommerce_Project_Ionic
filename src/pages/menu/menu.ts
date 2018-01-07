import { Component, ViewChild } from '@angular/core'; //El ViewChild es para que no se vuelva a cargar
//Una página de nuevo si no se necesita
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';/*Exportamos la página de 
                                                                                        catagories */
import { SignupPage } from "../signup/signup";
import { LoginPage } from "../login/login";
import { Storage } from '@ionic/storage';
import { CartPage } from "../cart/cart";


import * as WC from 'woocommerce-api';//importamos una variable de la API de WooCommerce

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;//Declaramos una variable para para asignar la WC creada arriba
  categories: any[];//Declaramos una variable categories para manipular las categorías de los productos

  @ViewChild('content') childNavCtrl: NavController;//Esta variable es para navegar entre la página de HomePage
  // y la de productsByCategory

  loggedIn: boolean;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public modalCtrl: ModalController) {
    //Aquí dentro del constructor se inicializan las variables
    this.homePage = HomePage
    this.categories = [];
    this.user = {};

    /*La variable de WooCommerce tiene los parámetros de la
    url: donde está alojado el servidor
    consumerkey y consumerSecret para poder sincronizar la variable token de sincronización con la API
    */
    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret: "cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });
    //Dentro de WooCommerce.getAsync(products/categories) cargamos todos los documentos dentro de un JSON
    //se le asigna el resultado del JSON.parse(data.body).produc_categories a una variable temp
    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      /*Hacemos un for dentro de la variable temp que tiene alojado el contenido del data.body*/
      for (let i = 0; i < temp.length; i++) {
        /*Si dentro del for encontramos una variable temp[i].id que sea igual a 16, 21, 22, 23
        Hacemos un push para que se muestren dichos items con esos id en la página de menu*/
        if (temp[i].id == 16 || temp[i].id == 21 || temp[i].id == 22 || temp[i].id == 23) {

          /*Si dentro de estos items encontramos algunos que tengan en su propiedad de slug 
          los siguientes nombres, se les asigna un respectivo ícono*/
          if (temp[i].slug == "clothing") {
            temp[i].icon = "shirt";
          }

          if (temp[i].slug == "music") {
            temp[i].icon = "musical-notes";
          }

          if (temp[i].slug == "posters") {
            temp[i].icon = "images";
          }

          if (temp[i].slug == "hoodies") {
            temp[i].icon = "md-shirt";
          }


          this.categories.push(temp[i]);
        }

      }
    }, (err) => {
      console.log(err);
    })
  }

  ionViewDidEnter() { /*IonViewDidEnter es llamado cada vez que la página es mostrada al usuario (la navega) 
                      y se convierte en la página activa*/
    this.storage.ready().then(() => {
      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        if (userLoginInfo != null) {
          
          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        } else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }
      })
    })
  }

  openCategoryPage(category) {//Aquí abrimos la página de categorías
    this.childNavCtrl.setRoot(ProductsByCategoryPage, { "category": category });
  }

  openPage(pageName: string) {

    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }

    if (pageName == "cart") {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

    if (pageName == "login") {
      this.navCtrl.push(LoginPage);
    }

    if (pageName == "logout") {
      this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })

    }
  }


}
