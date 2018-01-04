import { Component } from '@angular/core';
import { NavController, NavParams, ToastController,ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { CartPage } from "../cart/cart";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage, public toastCtrl: ToastController, public modalCtrl:ModalController) {

    this.product = this.navParams.get('product');
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_81960301d688f0a2618001bc5a486f4cec448c1d",
      consumerSecret: "cs_eff058b319e84c87f2f55303a3bdef7a2bf5d635"
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);

    }, (err) => {
      console.log(err);
    })

  }

  addToCart(product) {

    this.storage.get("cart").then((data) => {

      if (data == null || data.length == 0) {
        data = [];

        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        })
      } else {

        let added = 0;

        for (let i = 0; i < data.length; i++) {

          if (product.id == data[i].product.id) {
            let qty = data[i].qty;

            console.log("Product is already in the cart");

            data[i].qty = qty + 1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }

        }

        if (added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });
        }
      }

      this.storage.set("cart", data).then(() => {
        console.log("Cart updated");
        console.log(data);

        this.toastCtrl.create({
          message: "Cart updated",
          duration: 3000
        }).present();
      })
    });
  }

  openCart(){
    this.modalCtrl.create(CartPage).present();
  }


}
