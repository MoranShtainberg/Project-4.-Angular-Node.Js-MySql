import { Component, Input, OnInit } from '@angular/core';
import { DataUserMainService } from 'src/app/services/data-user-main.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-right',
  templateUrl: './main-right.component.html',
  styleUrls: ['./main-right.component.css']
})
export class MainRightComponent implements OnInit {

  @Input() public has_token_expired_question: boolean;
  @Input() public f_n:string
         
  constructor(
    public _data_main: DataUserMainService,
    public _r:Router    
  ) { }

  ngOnInit(): void {
   this._data_main.numberOfProducts();
   this._data_main.numberOfpaidCarts();
   this._data_main.openCartDate();
   this._data_main.lastOrderDate();   

    console.log("token in localStorag !!!: "+!!!localStorage.token);
    console.log("_data_main.open_cart_date_result: "+this._data_main.open_cart_date_result);
    
  }//onInit

}//class
