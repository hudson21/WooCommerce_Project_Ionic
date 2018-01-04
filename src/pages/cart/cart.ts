import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from "@ionic/storage";


@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartItems: any[] = [];/*Declaramos una variable para maniputar los items de nuestro cart*/ 
  total: any; /*Una variable total para sumar el precio de cada producto en el Cart*/
  showEmptyCartMessage: boolean = false; /*Una variable para verificar si hay o no items en el Cart*/

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
  public viewCtrl:ViewController) {

    this.total = 0.0; /*Inicializamos la variable total con 0.0*/

    this.storage.ready().then(() => { /*Si storage está listo entonces*/

      this.storage.get("cart").then((data) => {/*obtenemos los valores de la variable cart para pasarlos
        a la variable data*/
        this.cartItems = data; /*A la variable cartItems le será asignado lo que hay dentro del data*/
        console.log(this.cartItems); /*De esta manera podemos ver si hay o no datos dentro del cartItems*/

        if (this.cartItems.length > 0) { /*Si cartItems es mayor a 0*/

          this.cartItems.forEach((item, index) => {/*Se hace un forEach para leer todos los datos 
            de esta variable*/
            this.total = this.total + (item.product.price * item.qty)/*A la variable total se le asigna el 
            precio de todos los items en el Cart*/
          })

        } else {
          this.showEmptyCartMessage = true; /*Esta es solo una variable para comprobar si el cart 
          está vacío o no*/
        }
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  /*Esta función es para eliminar los items dentro del cart*/ 
  removeFromCart(item, i) {/*Recibe los valores de item y i*/

    let price = item.product.price; /*Se le asignan los valores a la variable price*/
    let qty = item.qty; /*Se le asignan valores a la variable qty*/

    this.cartItems.splice(i, 1);/*Este método remueve variables de un arreglo*/
    this.storage.set("cart", this.cartItems).then(() => {
    /*Con el storage.set(cart,this.cartItems) guardamos en el storage lo que queremos que se vea en el Cart*/
      this.total = this.total - (price * qty);/*Se quita lo que ya no esté en el Cart*/
    });

    if (this.cartItems.length == 0) {
      this.showEmptyCartMessage = true;
    }
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
