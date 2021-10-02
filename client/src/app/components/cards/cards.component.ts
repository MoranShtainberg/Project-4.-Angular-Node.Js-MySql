import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import ProductsTableModel from 'src/app/model/products_table.model';
import { DataCartService } from 'src/app/services/data-cart.service';
import { DataMarketService } from 'src/app/services/data-market.service';
import { DialogMarketComponent } from '../dialog-market/dialog-market.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  @Input() prod:ProductsTableModel;
  @Input() isAdmin:boolean;
    
  //public inp_value:number

  constructor(
    public _data_market:DataMarketService,
    public dialog: MatDialog,
    public _data_cart:DataCartService
    ) { }
    
     //product_id:number, product_name:string, category_id_ref:number, price_in_usd:number, price_type:string, picture_url:string
    onCardClick(cardInfo){

      if (this.isAdmin == true) {
        console.log(this.isAdmin);
        this._data_cart.singleProductDetails(this.prod.product_id);                        
      };

      if (this.isAdmin == false) {
        //alert(cardInfo)
        let dialogRef = this.dialog.open(DialogMarketComponent,{
          width:'350px',height:'250px',
          data:{prod_name:this.prod.product_name, 
                prod_id:  this.prod.product_id}
        });
  
        dialogRef.afterClosed().subscribe(result =>{
          console.log('dialog result: '+result);        
        })        
      }
    }//onCardClick

  ngOnInit(): void {
    console.log("isAdmin? (cards): "+this.isAdmin);
  }

}
