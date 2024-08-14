import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, Observable, Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartUpdated: Subject<boolean> = new Subject<boolean>();// prodocutComponent --appComponent

  showLogin: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://fakestoreapi.com/products';

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>("https://fakestoreapi.com/products");
  }
  getAllProductsByCateogry(categoryName: string): Observable<any[]> {
    return this.http.get<any[]>("https://fakestoreapi.com/products/category/"+ categoryName );
  }

  getSingleProductsById(id: number): Observable<any> {
    return this.http.get<any[]>("https://fakestoreapi.com/products/"+ id );
  }

  getAllCategory(): Observable<any[]> {
    return this.http.get<any[]>("https://fakestoreapi.com/products/categories");
  }

  register(obj: any) : Observable<any> {
    return this.http.post<any>("https://fakestoreapi.com/users", obj);
  }

  login(obj: any) : Observable<HttpResponse<any>> {
    return this.http.post<any>("https://fakestoreapi.com/auth/login", obj, { observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      console.error('Unauthorized access - 401');
      alert('Unauthorized access - 401');
      // Handle 401 error specifically
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  addtoCart(obj: any) : Observable<any> {
    return this.http.post<any>("https://fakestoreapi.com/carts", obj);
  }

  getAddtocartdataByCust(id: number): Observable<any[]> {
    return this.http.get<any[]>("https://fakestoreapi.com/carts/user/"+ id);
  }

  removeProductFromCart(cartId: number): Observable<any[]> {
    return this.http.get<any[]>("https://fakestoreapi.com/carts/"+ cartId);
  }

  PlaceOrder(obj: any) : Observable<any> {
    return this.http.post<any>("https://freeapi.miniprojectideas.com/api/amazon/PlaceOrder", obj);
  }
}
