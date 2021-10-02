import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataUserMainService } from 'src/app/services/data-user-main.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public token = localStorage.token
  public f_n:string
  public has_token_expired_question:boolean
  
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
    public _data_main: DataUserMainService
  ) { }
  
  ngOnInit(): void {
    console.log("!!!localStorage.token : "+!!!localStorage.token);

    if (!!!localStorage.token) {
      this.has_token_expired_question =false  // false -> don't render (there is no token in the localStorage)
      
    } else {
      // decode token
      let tokenInfo = this.getDecodedAccessToken(this.token); 
      this.f_n = tokenInfo.first_name;
      let expireDate = tokenInfo.exp; // get token expiration dateTime
      console.log(tokenInfo); // show decoded token object in console
      console.log(tokenInfo.first_name); 
      
      //token expires?
       console.log(this.has_token_expired_question);

        if (expireDate*1000 < new Date().getTime()) {
          this.has_token_expired_question = !true // false -> don't render (token expires)
          //remove expierd token from localStorage
            localStorage.removeItem("token");
            this._r.navigateByUrl('/main');    
            location.reload();

        } else {
          this.has_token_expired_question = !false // true -> render
        }//ifElse 2

    } //ifElse 1  
  }

  public logmeOut(){
    localStorage.removeItem("token");
    this._r.navigateByUrl('/main');    
    location.reload();
  }


}
