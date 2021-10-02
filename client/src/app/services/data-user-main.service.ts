import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class DataUserMainService {

  public num_of_prod_result:{}={}

  //fetch q3
  public num_of_paid_carts_result:{}={}

  //fetch q4
  public open_cart_date_result: Date |undefined;
  public resStatus_open_cart_date: number;

  //fetch q5
  public last_paid_cart_date_result: Date | undefined;
  public resStatus_last_paid_cart: number;

  //fetch q6
  public token = localStorage.token
  public token_after_decode:{}={}
  public is_token_exist_flag: boolean = true
  public has_token_expired_question:boolean
  public there_is_an_open_cart_flag:boolean = false
  public open_cart_obj_result:{} ={}

  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
      console.log(jwt_decode);
    }
    catch(Error){
      return null;
    }
  }

  constructor(
    public _r:Router
  ) { } 
  //-------------------------------------------------------1-POST: create a cart---------
  public async createCart(){
    try {
      const res = await fetch(`http://localhost:1000/api/userMain`,{
        method: 'POST',
        headers: {
          authorization: localStorage.token,
        },
      });
      this._r.navigateByUrl('/market');

    } catch (error) {
      console.log(error);
      
    }
  }
  //-------------------------------------------------------2-GET: numberOfProducts----------
  public async numberOfProducts(){
    try {
      const res = await fetch(`http://localhost:1000/api/userMain/numberOfProducts`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });
      const num_of_prod = await res.json();
      console.log(num_of_prod);

      this.num_of_prod_result = num_of_prod.NumberOfProducts

    } catch (error) {
      console.log(error);
      
    }
  }

  //-------------------------------------------------------3-GET numberOfpaidCarts---------
    public async numberOfpaidCarts(){
      try {
        const res = await fetch(`http://localhost:1000/api/userMain/numberOfpaidCarts`,{
          method: 'GET',
          headers: {
            authorization: localStorage.token,
          },
        });
        const num_of_paid_carts = await res.json();
        console.log(num_of_paid_carts);
  
        this.num_of_paid_carts_result = num_of_paid_carts.numberOfpaidCarts
  
      } catch (error) {
        console.log(error);
        
      }
    }

  //-----------------------------------------------------------4-GET openCartDate------------
  public async openCartDate(){
    try {
      const res = await fetch(`http://localhost:1000/api/userMain/openCartDate`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });
      const open_cart_date = await res.json();

      console.log(res.status);      
      if (res.status == 200) {
        this.resStatus_open_cart_date = 200
        this.open_cart_date_result = open_cart_date.cart_created_date;
      } 
      if (res.status == 400) {
        this.resStatus_open_cart_date = 400
      }
      console.log("ooppeenn: "+open_cart_date.cart_created_date);

    } catch (error) {
      console.log(error);
      
    }
  }
  //--------------------------------------------------5-GET-Last "Paid" cart date----------------
  public async lastOrderDate(){
    try {
      const res = await fetch(`http://localhost:1000/api/userMain/lastOrderDate`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });
      const last_paid_cart = await res.json();

      console.log(res.status);      
      if (res.status == 200) {
        this.resStatus_last_paid_cart = 200
        this.last_paid_cart_date_result = last_paid_cart.lastOrderDate;
      } 
      if (res.status == 400) {
        this.resStatus_last_paid_cart = 400
      }
      console.log("last paid date: "+last_paid_cart.lastOrderDate);

    } catch (error) {
      console.log(error);
      
    }
  } 
  //----------------------------------------6. GET: main left div's + resume Or Open btn's -------
  public async resumeOrOpen(){

    if (!!!localStorage.token) {
      this.is_token_exist_flag = false; // render loginDiv only (there is no token in the localStorage)  
      //this.has_token_expired_question =false;  // false -> don't render (there is no token in the localStorage)      
    } else {
      console.log("is_token_exist_flag: "+this.is_token_exist_flag);
      
      // decode token
        let tokenInfo = this.getDecodedAccessToken(this.token);
        this.token_after_decode = tokenInfo;          
        let expireDate = tokenInfo.exp; // get token expiration dateTime
        console.log(tokenInfo); // show decoded token object in console        
      
      //token expires?      
        if (expireDate*1000 < new Date().getTime()) {
          this.has_token_expired_question = true // -> token expired -> render loginDiv only
        } else {
          this.has_token_expired_question = false // token is valid -> render -> btnsDiv only
        }//ifElse 2
        console.log("has_token_expired_question: "+this.has_token_expired_question);      
    } //ifElse 1  

    // resume btn? OR start btn?
    try {
      const res = await fetch(`http://localhost:1000/api/userMain/resumeOrOpen`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });
      const open_cart_obj = await res.json();
      console.log("open_cart_obj");      
      console.log(open_cart_obj);
      this.open_cart_obj_result = open_cart_obj 
      
      if (open_cart_obj.user_id_open_cart_length == 1) {
        this.there_is_an_open_cart_flag = true;
      }
      console.log("there_is_an_open_cart_flag: "+this.there_is_an_open_cart_flag);
      

    } catch (error) {
      console.log(error);
      
    }
  }

  //-----------------------------------------------------------------------------------------

}
