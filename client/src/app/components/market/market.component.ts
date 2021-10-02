import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { DataMarketService } from 'src/app/services/data-market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  public token = localStorage.token;
  public f_n:string;
  public isAdmin:boolean=false
  public has_token_expired_question:boolean;  

  logCartToggle(state){
    console.log(state);    
  };
   
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
    public _r:Router,
    public _data_market:DataMarketService
  ) { }

  ngOnInit(): void {
    this._data_market.getAllCategories();
    this._data_market.getMarketProducts('');

    console.log("!!!localStorage.token : "+!!!localStorage.token);

    if (!!!localStorage.token) {
      this.has_token_expired_question =false  // false -> don't render (there is no token in the localStorage)
      
    } else {
      // decode token
      let tokenInfo = this.getDecodedAccessToken(this.token); 
      this.f_n = tokenInfo.first_name;
      this.isAdmin = tokenInfo.isAdmin;
      let expireDate = tokenInfo.exp; // get token expiration dateTime
      //console.log(tokenInfo); // show decoded token object in console
      //console.log("isAdmin? (market): "+this.isAdmin); 
      
      //token expires?
       console.log(this.has_token_expired_question);

        if (expireDate*1000 < new Date().getTime()) {
          this.has_token_expired_question = !true // false -> don't render (token expires)
          //remove expierd token from localStorage
            localStorage.removeItem("token");
            this._r.navigateByUrl('/main');    
            //location.reload();

        } else {
          this.has_token_expired_question = !false // true -> render
        }//ifElse 2
    } //ifElse 1  
    
  }//ngOnInit

  public logmeOut(){
    localStorage.removeItem("token");
    this._r.navigateByUrl('/main');    
    // location.reload();
  }  

}
