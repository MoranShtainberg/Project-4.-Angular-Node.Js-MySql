import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import UsersTableModel from '../model/users_table.model';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {

  public login_data_arr:{} = {}
  public loginRes400:boolean=false;
  //--------------pre_registration-
  public myFormLeft_valid:boolean=false;
  public pre_registration_arr:{} = {};
  public pre_registationRes400:boolean = false;
  //--------------register--------
  public myFormRigth_valid:boolean=false;
  public register_arr:{}={};
  public registerRes400:boolean = false;

  public user: UsersTableModel | {} = {};

  public token:string;
  public token_after_decode:{}={}
  public is_admin_decode:boolean
  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
      //console.log(jwt_decode);
    }
    catch(Error){
      return null;
    }
  }

  constructor(
    public _r:Router,
    private _snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 3500});
  }

  //================================================================================
  //-----------------------------------------------------login----------------
  public async login(username:string, password:string){
    try {
      const res = await fetch(`http://localhost:1000/api/auth/login`,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body: JSON.stringify({username, password})
      });

      const data = await res.json();
      //console.log("res.status: "+res.status);      

      if (res.status==200) {
        localStorage.token = data.token;
        this.token = localStorage.token;
        // decode token
          let tokenInfo = this.getDecodedAccessToken(this.token);
          this.token_after_decode = tokenInfo;          
          this.is_admin_decode = tokenInfo.isAdmin; // get token expiration dateTime
          //console.log("is_admin_decode: "+this.is_admin_decode); // show if user is admin 
      }

     if (res.status==200 && this.is_admin_decode == true) {
       this._r.navigateByUrl('/market')
     } else if (res.status==200 && this.is_admin_decode == false) {
        //localStorage.token = data.token;
        // this._r.navigateByUrl('/main');
        window.location.reload();        
      } else {
        this.login_data_arr = data.err
        console.log(data.err);        
      }

      if (res.status == 400) {
        this.loginRes400 = true
      } else{
        this.loginRes400 = false
      }

    } catch (error) {
      console.log(error);
      
    }
  }
  //===========================================================================================

  //----------------------------------------------------- pre_registration----------------

  public async pre_registration(username:string, password:any, confirm_password:any, Id_number:number){
    try {
      const res = await fetch(`http://localhost:1000/api/auth/pre_registration`,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body: JSON.stringify({username, password, confirm_password, Id_number})
      });

      console.log(res.status);      
      
      if (res.status == 201) {
        this.myFormLeft_valid = true;     
        console.log("res status 201");  
        this.pre_registationRes400 = false;      
      }
      
      if (res.status == 400) {
        const data = await res.json();
        this.myFormLeft_valid = false;
        this.pre_registration_arr = data.err;
        this.pre_registationRes400 = true;
      }    

    } catch (err) {
        console.log(err);      
    }
  }//pre_registration
  //======================================================================================
  //-----------------------------------------------------register----------------
  //-------username, password, first_name, last_name, Id_number, city, street---
  public async register(username:string, 
                        password:any, 
                        first_name:string, 
                        last_name:string, 
                        Id_number:number, 
                        city:string, 
                        street:string){
    try {
      const res = await fetch(`http://localhost:1000/api/auth/register`,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body: JSON.stringify({username, password, first_name, last_name, Id_number, city, street})
      });

      console.log(res.status);      
      
      if (res.status == 201) {
        // this.myFormRigth_valid = true;     
        console.log("res status 201");
        // seccess msg
        this.openSnackBar('You registered successfully !!!👍. Please login','Dissmiss')
        this._r.navigateByUrl('/main');        
      }
      
      if (res.status == 400) {
        const data = await res.json();
        // this.myFormRigth_valid = false;
        this.register_arr = data.err;
        this.registerRes400 = true;
      }    

    } catch (err) {
        console.log(err);      
    }
  }

}
