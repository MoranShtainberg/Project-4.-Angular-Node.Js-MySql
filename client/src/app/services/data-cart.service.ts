import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import CartsTableModel from '../model/carts_table.model';
import ProductsTableModel from '../model/products_table.model';
import { DataMarketService } from './data-market.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataCartService {
  public cartProducts: CartsTableModel[]=[];
  //public single_product_details: ProductsTableModel;
  public single_product_details = new Subject<ProductsTableModel>();
  

  constructor(
    public _r:Router,
    public _data_market:DataMarketService
  ) { }

  //---------------------------------------------------------getCartSum-------------------------
    public getCartSum():number{
      return this.cartProducts.reduce((sum,cart)=>sum+(cart.price_in_usd*cart.quantity),0)
    };

  //-------------------------1-DELETE:  Delete all cart items----------------------------------
    public async delete_all_cart_items(){
      try {
        const res = await fetch(`http://localhost:1000/api/cart`,{
          method: 'DELETE',
          headers: {
            authorization: localStorage.token,
          },
        });
        this.getAllCart_idProducts();
        
      } catch (error) {
        console.log(error);        
      }
    }//delete_all_cart_items 
  //-------------------------2-DELETE: delete a single item from cart given product_id----------
    public async delete_a_single_item_from_cart(product_id){
      try {
        const res = await fetch(`http://localhost:1000/api/cart/`+product_id,{
          method: 'DELETE',
          headers: {
            authorization: localStorage.token,
          },
        });
        this.getAllCart_idProducts();
        
      } catch (error) {
        console.log(error);        
      }
    }//getAllMarketProducts
  //-----------------------------3.-get all (cart id) products---------------------------------
    public async getAllCart_idProducts(){
      try {
        const res = await fetch(`http://localhost:1000/api/cart/`,{
          method: 'GET',
          headers: {
            authorization: localStorage.token,
          },
        });

        if (res.status == 200) {
          const all_cart_id_products_inJson = await res.json();
            // console.log("all_cart_id_products_inJson");
            // console.log(all_cart_id_products_inJson);  
          this.cartProducts = all_cart_id_products_inJson;          
        }

        if (res.status == 400) {
          this._r.navigateByUrl('/main');
        }

      } catch (error) {
        console.log(error);        
      }
    }//getAllMarketProducts

  //------------------------------------------------4-GET: return single product details----single_product_details---
  public async singleProductDetails(product_id: number){
    try {
      const res = await fetch(`http://localhost:1000/api/cart/product_id/${product_id}`,{
        method: 'GET',
        headers: {
          authorization: localStorage.token,
        },
      });

      this.single_product_details.next((await res.json())[0]);   
    } catch (error) {
      console.log(error); 
    }
  }//singleProductDetails
  
  //---------5-add a product to (cart_items_bridge_table) given: product_id_ref, quantity---------------------------
    public async add_product_to_cart(product_id_ref:number, quantity:number){
      try {
        const res = await fetch(`http://localhost:1000/api/cart/add_product_to_cart`,{
          method:'POST',
          headers:{
            authorization: localStorage.token,
            'content-type':'application/json'
          },
          body: JSON.stringify({product_id_ref, quantity})
        });

        this.getAllCart_idProducts();             
        
      } catch (err) {
          console.log(err);      
      }
    }//add_product_to_cart
  //----------------6- ADMIN-create a product-POST------------------------------------------------------------------
  //--- product_name, category_id_ref, price_in_usd, price_type, picture_url-----

  public async create_a_product(product_name:string, category_id_ref:number, price_in_usd:number, price_type:string, picture_url:string){
    try {
      const res = await fetch(`http://localhost:1000/api/cart`,{
        method:'POST',
        headers:{
          authorization: localStorage.token,
          'content-type':'application/json'
        },
        body: JSON.stringify({product_name, category_id_ref, price_in_usd, price_type, picture_url})
      });

      //this.getAllCart_idProducts();  
      this._data_market.getMarketProducts('');           
      
    } catch (err) {
        console.log(err);      
    }
  }//create_a_product
  //----------------7-ADMIN -  edit a product-PUT-------------------------------------------------------------------
  public async edit_a_product(product_id:number, product_name:string, category_id_ref:number, price_in_usd:number, price_type:string, picture_url:string){
    try {
      const res = await fetch(`http://localhost:1000/api/cart`,{
        method:'PUT',
        headers:{
          authorization: localStorage.token,
          'content-type':'application/json'
        },
        body: JSON.stringify({product_id, product_name, category_id_ref, price_in_usd, price_type, picture_url})
      });
        
      this._data_market.getMarketProducts('');           
      
    } catch (err) {
        console.log(err);      
    }
  }//edit_a_product
  //-----------------------------------------------------------------------------------------------------------
}
