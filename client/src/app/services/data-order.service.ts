
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import CartsTableModel from '../model/carts_table.model';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataOrderService {
  public orders_per_deliveryDate: CartsTableModel[] = [];
  public userAddress = [];

  //------------------------------subject & observable - -------------------------
  public subject_cart_id = new Subject<object>();
  public simple_cart_id: number;

  keep_cart_id(c_id:object){
    this.subject_cart_id.next(c_id)
  }

  obs_cart_id():Observable<object>{
    return this.subject_cart_id.asObservable();
  }

  public moreThan3Dates = new Subject<number[]>();

  //------------------------------------------------------------------------------
  constructor(
    public _r:Router
  ) { }
    
    //-----------------------------1.-get dates where more than 3 per day---------
    public async numOfOrders_per_deliveryDate(){
      try {
        const res = await fetch(`http://localhost:1000/api/order/`,{
          method: 'GET',
          headers: {
            authorization: localStorage.token,
          },
        });

        if (res.status == 200) {
          const orders_per_deliveryDate_inJason = await res.json();

          this.orders_per_deliveryDate = orders_per_deliveryDate_inJason;
          
          const nonDeliveryTime = orders_per_deliveryDate_inJason.map(x=> (new Date(x.delivery_date).getTime()))

          this.moreThan3Dates.next(nonDeliveryTime.filter((value) => !isNaN(value)));
        }
      } catch (error) {
        console.log(error);        
      }
    }//numOfOrders_per_deliveryDate

  //--------------------------------2. PUT: order form submit-----------------------------------------  
    // order_date ,delivery_date, total_price, credit_card_4_last_digits, delivery_city, delivery_Street      
  public async order_submitting(order_date:Date ,delivery_date:Date, total_price:number, credit_card_4_last_digits:number, delivery_city:string, delivery_Street:string){
    try {
      const res = await fetch(`http://localhost:1000/api/order`,{
        method:'PUT',
        headers:{
          authorization: localStorage.token,
          'content-type':'application/json'
        },
        body: JSON.stringify({order_date ,delivery_date, total_price, credit_card_4_last_digits, delivery_city, delivery_Street})
      });
      
      const cart_id_in_json = await res.json();
      console.log("cart_id_in_json");      
      console.log(cart_id_in_json);
      console.log("cart_id_in_json.cart_id): "+cart_id_in_json.cart_id);

      this.simple_cart_id = cart_id_in_json.cart_id

      this.keep_cart_id(cart_id_in_json);
      console.log("this.subject_cart_id: "+ this.subject_cart_id);
      
      this._r.navigateByUrl('/thank_you');      
      
    } catch (err) {
        console.log(err);      
    }
  }//order_submitting
  //-----------------------------------3.-GET: user address---------------------------------------------------
  public async getUserAddress(){
    try {
      const res = await fetch(`http://localhost:1000/api/order/address`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });

      if (res.status == 200) {
        const getUserAddress_inJason = await res.json();
          console.log("getUserAddress_inJason");
          console.log(getUserAddress_inJason);  
        this.userAddress = getUserAddress_inJason;          
      }

    } catch (error) {
      console.log(error);        
    }
  }//numOfOrders_per_deliveryDate
  //---------------------------------------------------------------------------------------
}//export
