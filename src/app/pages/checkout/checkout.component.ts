import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  loggedObj: any = {};
  cartItems: any[]= [];
  checkoutObj: any = {
    "SaleId": 0,
    "CustId": 0,
    "SaleDate": new Date(),
    "TotalInvoiceAmount": 0,
    "Discount": 0,
    "PaymentNaration": "",
    "DeliveryAddress1": "",
    "DeliveryAddress2": "",
    "DeliveryCity": "",
    "DeliveryPinCode": "",
    "DeliveryLandMark": ""
  }

  constructor(private productSrv: ProductService) {
    const localData = localStorage.getItem('my_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
      this.getCartData(this.loggedObj.custId)
    }

    this.productSrv.itemRemoved.subscribe(isItemRemoved => {

      if(isItemRemoved) {
        this.cartItems = [];
      }
    });
  }

  ngOnInit(): void {

  }
  getCartData(id: number) {
    // this.productSrv.getAddtocartdataByCust(id).subscribe((res: any)=>{
    //   this.cartItems = res.data;
    // })

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

  placeOrder() {

    alert("Order Has Been Succefully Placed");
    this.cartItems = [];

    // this.checkoutObj.checkoutObj =  this.loggedObj.custId;
    // this.productSrv.PlaceOrder(this.checkoutObj).subscribe((res: any)=> {
    //   if(res.result) {
    //     this.productSrv.cartUpdated.next(true);
    //     alert("Order Has Been Succefully Placed")
    //     alert("Order Has Been Succefully Placed")
    //   } else {
    //     alert(res.message)
    //   }
    // })

    this.productSrv.itemRemoved.next(true);
  }
}
