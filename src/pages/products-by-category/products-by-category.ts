import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from '../product-details/product-details';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products:any[];
  page:number;
  category:any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.page=1;
    this.category=this.navParams.get("category");

    this.WooCommerce = WC ({
      url: "http://localhost/wordpress",
      consumerKey:"ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret:"cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) =>{
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    },(err)=>{
      console.log(err);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
    this.page++;
    console.log("Getting page" + this.page);
    this.WooCommerce.getAsync("products?filter[category]="+ this.category.slug + "&page="+
    this.page).then((data) => {
      let temp= (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if(temp.length < 10){
         event.enable(false);
      }
    })
  }

/* Este método es para abrir la página de ProductDetailsPage con la variable de navCtrl*/
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage,{"product":product});
  }

}
