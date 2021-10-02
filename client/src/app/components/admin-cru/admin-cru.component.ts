import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ProductsTableModel from 'src/app/model/products_table.model';
import { DataCartService } from 'src/app/services/data-cart.service';
import { DataMarketService } from 'src/app/services/data-market.service';


@Component({
  selector: 'app-admin-cru',
  templateUrl: './admin-cru.component.html',
  styleUrls: ['./admin-cru.component.css']
})
export class AdminCruComponent implements OnInit {
  fontStyleControl = new FormControl();

  public myForm:FormGroup;
  public priceType:any = ['Per unit','Per kilogram']
  public selected_price_type:string
  public selected_category:number;
 
  constructor(
    public _fb:FormBuilder,
    public _data_market:DataMarketService,
    public _data_cart:DataCartService
  ) { }

  resetForm(){
    this.myForm.reset();
  }
  reloadPage(){
    location.reload();
  }

  ngOnInit(): void {
    this._data_market.getAllCategories();    

    this.myForm = this._fb.group({
      product_name: ['', Validators.required],
      picture_url: ['', Validators.required],
      price_in_usd: ['', Validators.required],
      price_type: ['', Validators.required],
      category_id: ['', Validators.required],
      product_id: ""
    });

    this._data_cart.single_product_details.subscribe(
      (value) => {
        this.myForm.patchValue({
          'product_name': value.product_name,
          'picture_url':  value.picture_url,
          'price_in_usd': value.price_in_usd,
          'price_type':   value.price_type,
          'category_id':  value.category_id,
          'product_id':   value.product_id,
        });
      },
    );//subscribe

  }//ngOnInit

}
