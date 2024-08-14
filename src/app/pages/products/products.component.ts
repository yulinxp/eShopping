import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  productsArray: any[] = [];
  categories: any[]= [];
  selectedCategory: string = '';
  loggedObj: any = {};

  constructor(private productSrv: ProductService) {
    const localData = localStorage.getItem('my_user');
    if(localData != null) {
      const parseObj =  JSON.parse(localData);
      this.loggedObj = parseObj;
    }

    this.productSrv.userHasLogin.subscribe(isLoggedIn => {

      const localData = localStorage.getItem('my_user');
      if(localData != null) {
        const parseObj =  JSON.parse(localData);
        this.loggedObj = parseObj;
      }
      // if (isLoggedIn) {
      //   console.log('User logged in');
      // } else {
      //   console.log('User logged out');
      // }
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategory();
  }
  loadProducts() {
    this.productSrv.getAllProducts().subscribe((data: any) =>{
      // this.productsArray = Res.data;
      this.productsArray = data;
    })
  }

  getAllProductsByCateogry(categoryName: string) {
    this.selectedCategory = categoryName;
    this.productSrv.getAllProductsByCateogry(categoryName).subscribe((Res: any) =>{
      this.productsArray = Res;
    })
  }

  loadCategory() {
    this.productSrv.getAllCategory().subscribe((data: any) =>{
      this.categories = data;
    })
  }

  addtocart(producId: number) {
    if(this.loggedObj.custId == undefined) {
      this.productSrv.showLogin.next(true);
    } else {
        const obj ={
          "userId": this.loggedObj.custId,
          "date": new Date(),
          "products": [
          {
            "productId": producId,
            "quantity": 1
          }
        ]
      }

      this.productSrv.addtoCart(obj).subscribe((res: any)=> {
        console.log(res);
        alert("Product Added to Cart");

        this.productSrv.cartUpdated.next(true);
      })
    }
   // debugger;

  }




}
