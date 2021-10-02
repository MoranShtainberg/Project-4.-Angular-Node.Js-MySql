import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataCartService } from 'src/app/services/data-cart.service';

@Component({
  selector: 'app-dialog-market',
  templateUrl: './dialog-market.component.html',
  styleUrls: ['./dialog-market.component.css']
})
export class DialogMarketComponent implements OnInit {
  
  public input_quantity:number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public _data_cart:DataCartService
  ) { }

  increase(){
    this.input_quantity += 1
  };

  decrease(){
    this.input_quantity -= 1
  };
  
  ngOnInit(): void {
  }

}
