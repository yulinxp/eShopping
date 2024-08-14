import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import {HttpResponse} from "@angular/common/http";
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eShopping';
  registerObj: any = {
    "CustId": 0,
    "Name": "",
    "MobileNo": "",
    "Password": ""
  }
  loginObj: any = {
    "username": "mor_2314",
    "password": "83r5^_"
  }
  loggedObj: any = {};
  cartItems: any[]= [];
  loginModelClass: string = '';

  constructor(private productSrv: ProductService) {

    const localData = localStorage.getItem('my_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
      this.getCartData(this.loggedObj.custId)
    }
    this.productSrv.cartUpdated.subscribe((res: boolean)=>{
      if(res) {
        this.getCartData(this.loggedObj.custId)
      }
    })
    this.productSrv.showLogin.subscribe((res: boolean)=>{
      if(res) {
         this.loginModelClass = 'show';
      }
    })
  }

  getCartData(id: number) {
    this.productSrv.getAddtocartdataByCust(id).subscribe((res: any) => {

      this.cartItems = [];

      if (res.length > 0) {
        const productsArray = res[0].products; // res[0] !!!!!!!
        console.log(productsArray);

        const cartId: number = res[0].id;

        productsArray.forEach((item: { productId: any; quantity: any; }) => {
          console.log(`Product ID: ${item.productId}, Quantity: ${item.quantity}`);

          this.productSrv.getSingleProductsById(item.productId).subscribe((res: any) => {

            const productDetails: any = {
              cartId : cartId,
              id: res.id,
              price: res.price,
              description: res.description,
              image: res.image
            };

            this.cartItems.push(productDetails);
          });
        });
      } else {
        console.log('No cart data available');
      }
      // this.cartItems = res.products;
    })
  }

  onRegister() {
    this.productSrv.register(this.registerObj).subscribe((res: any)=> {

      console.log(res);
        this.loggedObj = res.id;
        alert("User Creation Done")
    })
  }
  onLogin() {
    this.productSrv.login(this.loginObj).subscribe(  (res: any)=> {

        const decoded = jwtDecode(res.body.token);
        console.log(decoded);

        alert("User Login Success");

        this.loggedObj = this.loginObj;
        this.loggedObj.custId = decoded.sub;  //id
        console.log(this.loggedObj);

        this.loginModelClass = '';
        localStorage.setItem('my_user', JSON.stringify(this.loggedObj));
        // this.getCartData(this.loggedObj.custId)

        this.productSrv.userHasLogin.next(true);
    }
    )
  }
  removeItem(cartId: number) {
    this.productSrv.removeProductFromCart(cartId).subscribe((res: any)=> {
      if(res.id == cartId) {
        alert("Item Removed");

        this.cartItems = [];      //hack! because of fake API fake result
        //this.getCartData(this.loggedObj.custId);


      } else {
        alert(res.message)
      }
    })
  }

}
