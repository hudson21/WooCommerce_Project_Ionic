import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';

import * as WC from 'woocommerce-api';/*Llamamos al plugin de WooCommerce */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce:any;/* Declaramos una variable para manipular el plugin de WooCommerce*/
  products: any[];/* Declaramos una variable para manipular los productos*/
  page:number;/* Tenemos una variable para las páginas*/
  moreProducts:any[];/* Tenemos una variable para cargar más productos*/
  
  @ViewChild('productSlides') productSlides:Slides;/* Estamos haciendo referencia a la propiedad 
  #productSlides declarada en el home.html*/

  constructor(public navCtrl: NavController) {

    this.page=2;/* Inicializamos la variable de page con el número 2*/

    /* Hacemos la conexión con el token generado desde el plugin de WooCommerce para podernos conectar 
    con la respectiva API*/
    this.WooCommerce = WC ({
      url: "http://localhost/wordpress", /* Esta es la dirección local de donde está alojado el servidor de
      WooCommerce*/

      /* Estos dos parámetros son generados para un usuario en específico */
      consumerKey:"ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret:"cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });
    this.loadMoreProducts(null);/*Cargamos el método de loadMoreProducts */
 
    /* Hacemos la sincronización con los productos de la tienda a través de la variable inicializada de 
    WooCommerce*/
    this.WooCommerce.getAsync("products").then((data) =>{/*Si hacemos la sincronización con los productos 
      entonces todo se guarda en una variable llamada data*/
      console.log(JSON.parse(data.body));/*Esta variable la mostramos en la consola del navegador para ver
      si los parámetros se pasaron correctamente */
      this.products = JSON.parse(data.body).products;/* Se asigna a la variable de products los resultados
      que hay dentro del data.body */
    },(err)=>{
      console.log(err);
    }) 
 }

 ionViewDidLoad(){
  setInterval(()=> {

    if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
      this.productSlides.slideTo(0);

    this.productSlides.slideNext();
  }, 3000)
}
/* Tenemos el método que nos permite cargar mas productos dentro de la página de home.ts*/
loadMoreProducts(event){

  if(event==null){/*Si la variable event es igual a null */
   this.page=2; /*Entonces que se cargue la página 2 */
   this.moreProducts=[];/*Llamamos a la variable de moreProducts para inicializarla en 0 */
  }
   else
   this.page ++; /*Sino incrementamos la página a un valor mas */
  
  /* Hacemos la sincronización de nuevo pero con los productos nuevos que se estan cargando*/
  this.WooCommerce.getAsync("products?page=" + this.page).then((data) =>{
    console.log(JSON.parse(data.body));
    this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

    if(event!=null){
      event.complete();
    }

    if(JSON.parse(data.body).products.length < 10){
      event.enable(false);
    }
  },(err)=>{
    console.log(err);
  }) 

}
/*A través de este método se moverá a la página de product-details.html */
openProductPage(product){
  this.navCtrl.push(ProductDetailsPage,{"product":product});
}

}
