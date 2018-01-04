import { Component,ViewChild } from '@angular/core'; //El ViewChild es para que no se vuelva a cargar
//Una página de nuevo si no se necesita
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';//Exportamos la página
//de categories

import * as WC from 'woocommerce-api';//importamos una variable de la API de WooCommerce

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  WooCommerce: any;//Declaramos una variable para para asignar la WC creada arriba
  categories: any[];//Declaramos una variable categories para manipular las categorías de los productos

  @ViewChild('content') childNavCtrl:NavController;//Esta variable es para navegar entre la página de HomePage
  // y la de productsByCategory

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //Aquí dentro del constructor se inicializan las variables
    this.homePage = HomePage
    this.categories = [];
    
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

      for (let i = 0; i < temp.length; i++) {
        if ( temp[i].id == 16 || temp[i].id == 21 || temp[i].id == 22 || temp[i].id == 23 ) {

          if(temp[i].slug =="clothing"){
            temp[i].icon ="shirt";
          }

          if(temp[i].slug =="music"){
            temp[i].icon ="musical-notes";
          }

          if(temp[i].slug =="posters"){
            temp[i].icon ="images";
          }

          if(temp[i].slug =="hoodies"){
            temp[i].icon ="md-shirt";
          }

         
          this.categories.push(temp[i]);
        }

      }
    }, (err) => {
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category){//Aquí abrimos la página de categorías
    this.childNavCtrl.setRoot(ProductsByCategoryPage,{ "category":category});
  }

}
