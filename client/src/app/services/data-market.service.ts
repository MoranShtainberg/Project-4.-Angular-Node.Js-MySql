import { Injectable } from '@angular/core';
import CategoryTableModel from '../model/categories_table.model';
import ProductsTableModel from '../model/products_table.model';

@Injectable({
  providedIn: 'root'
})
export class DataMarketService {

  public categories_arr:CategoryTableModel[] = [];
  public market_products_arr:ProductsTableModel[] = [];
  
  constructor() { }
    //-------------------------------------------------------1-GET: all market products----------
    public async getMarketProducts(product_id){
      try {
        const res = await fetch(`http://localhost:1000/api/market/`+product_id,{
          method: 'GET',
          headers: {
            authorization: localStorage.token,
          },
        });
        const all_market_products_inJson = await res.json();
        // console.log("all_market_products_inJson");
        // console.log(all_market_products_inJson);  
        this.market_products_arr = all_market_products_inJson;  
      } catch (error) {
        console.log(error);        
      }
    }//getAllMarketProducts
    //-------------------------------------------------------2-GET: all_categories----------
      public async getAllCategories(){
        try {
          const res = await fetch(`http://localhost:1000/api/market/all_categories`,{
            method: 'GET',
            headers: {
              authorization: localStorage.token,
            },
          });
          const all_categories_inJson = await res.json();
          // console.log("all_categories_inJson");
          // console.log(all_categories_inJson);  
          this.categories_arr = all_categories_inJson;  
        } catch (error) {
          console.log(error);        
        }
      }//getAllCategories
    
    //---------3-Redundant - united with 1----------------------------------------------------
    
    
    //-------------------------------------------------------4-search (value_in_market)-------
    public async search_value_in_market(value_in_market:string){
      try {
        const res = await fetch(`http://localhost:1000/api/market`,{
          method:'PUT',
          headers:{
            authorization: localStorage.token,
            'content-type':'application/json'
          },
          body: JSON.stringify({value_in_market})
        });
  
        console.log(res.status);      
        const data = await res.json();            
        // console.log("res status 200");  
        // console.log(data);
        this.market_products_arr = data;               
        
        if (res.status == 200) {
        }           
  
      } catch (err) {
          console.log(err);      
      }
  }//pre_registration



}
