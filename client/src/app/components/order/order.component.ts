import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { DataCartService } from 'src/app/services/data-cart.service';
import { DataOrderService } from 'src/app/services/data-order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  //-------------------------------------form variables -------------------
  public myForm:FormGroup;
  public biggest10cities: any = ['Jerusalem','Tel-Aviv','Haifa','Rishon LeZion','Petah Tikva','Ashdod','Netanya','Beer Sheva','Bnei Brak','Holon']
  public selected: string

  public month_arr = ['01','02','03','04','05','06','07','08','09','10','11','12']
  public selected_mm: string;

  public year_arr = [21,22,23,24,25,26,27]
  public selected_yy: number;

  public OrderDateDate: Date;

  //----------------------------------token variables----------------------
  public token = localStorage.token;
  public has_token_expired_question:boolean;
  public f_n:string;  
  //----------------------------matDatepickerFilter data processing--------
  public minDate = new Date();
  //public testDate = new Date(2021, 11-1 ,15);
  //public testDateArr = []
  //public testDateArr = [ new Date(2021 ,11-1 ,4).getTime() ];  
  //, new Date(2021, 11-1, 23).getTime()
  //nonDeliveryTime_result;
  public nonDeliveryTime = [];
  
  public dateFilter = date => {
    const day = date.getDay();

    return day !== 6 && !this.nonDeliveryTime.find((dateValue) => {
      const date1 = new Date(date);
      const date2 = new Date(dateValue);

      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    });
  }
  // date.getTime() !== this.testDate.getTime()
  //!this.testDateArr.find(x=> x == time)
  //!this._data_order.nonDeliveryTime_result.find(x=> x == time)
 //----------------------------------------------------------------------
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
    public _data_cart:DataCartService,
    public _fb:FormBuilder,
    public _data_order: DataOrderService
  ) { }

  public logmeOut(){
    localStorage.removeItem("token");
    this._r.navigateByUrl('/');   
  }

  public street_db_click(){
    this.myForm.patchValue({
      delivery_Street: this._data_order.userAddress[0].street
    });
  }
  
  public city_db_click(){
    this.myForm.patchValue({
      delivery_city: this._data_order.userAddress[0].city
    });
  }
  //=====================================================ngOnInit===========================
  ngOnInit(): void {

    this._data_cart.getAllCart_idProducts();    
    this._data_order.numOfOrders_per_deliveryDate(); // orders_per_deliveryDate    
    this._data_order.getUserAddress(); // userAddress

    this._data_order.moreThan3Dates.subscribe(
      (value) => {
        if (!value) {
          this.nonDeliveryTime = [];
        } else {
          this.nonDeliveryTime = value;
        }
      },
    );
      
    this.OrderDateDate = new Date();

    this.myForm = this._fb.group({
      delivery_city:   ["",Validators.required],
      delivery_Street: ["",Validators.required],
      delivery_date:   ["",Validators.required],
      credit_card_4_last_digits: ["",[Validators.required, Validators.pattern("^[0-9]{12}$")]],
      mm: ["",[Validators.required, Validators.max(12)]],
      yy: ["",[Validators.required]],
      cvv:["",[Validators.required, Validators.min(100), Validators.max(999)]],
    })

    //------------------------------------------------------------token processing----------------------------
      console.log("!!!localStorage.token : "+!!!localStorage.token);

      if (!!!localStorage.token) {
        this.has_token_expired_question =false  // false -> don't render (there is no token in the localStorage)
        
      } else {
        // decode token
        let tokenInfo = this.getDecodedAccessToken(this.token); 
        this.f_n = tokenInfo.first_name;
        // this.isAdmin = tokenInfo.isAdmin;
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

          } else {
            this.has_token_expired_question = !false // true -> render
          }//ifElse 2
      } //ifElse 1 

  }//ngOnInit

}
