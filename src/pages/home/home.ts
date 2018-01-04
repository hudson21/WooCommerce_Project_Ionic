import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  WooCommerce:any;
  products: any[];
  page:number;
  moreProducts:any[];
  @ViewChild('productSlides') productSlides:Slides;

  constructor(public navCtrl: NavController) {

    this.page=2;
    this.WooCommerce = WC ({
      url: "http://localhost/wordpress",
      consumerKey:"ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret:"cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });
    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then((data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
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

loadMoreProducts(event){

  if(event==null){
   this.page=2;
   this.moreProducts=[];
  }
   else
   this.page ++;
  

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
openProductPage(product){
  this.navCtrl.push(ProductDetailsPage,{"product":product});
}

}
