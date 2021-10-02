import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCartService } from 'src/app/services/data-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    public _data_cart:DataCartService,
    public _r:Router
  ) { }

  public currentURL = this._r.url;
  public input_search_order:string ='';

  ngOnInit(): void {
    this._data_cart.getAllCart_idProducts();
  }

}
