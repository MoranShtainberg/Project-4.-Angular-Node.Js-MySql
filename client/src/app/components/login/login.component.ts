import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormControl, 
  FormGroupDirective,
  NgForm
 } from '@angular/forms';


import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { DataAuthService } from 'src/app/services/data-auth.service';
import { DataUserMainService } from 'src/app/services/data-user-main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public myForm:FormGroup;


  constructor(
    public _fb:FormBuilder,
    public _data_auth:DataAuthService,
    public _data_user_main: DataUserMainService,
    public _r:Router
  ) { }

  ngOnInit(): void {
    this._data_user_main.resumeOrOpen();

    this.myForm = this._fb.group({
      username:["",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:["",Validators.required]
    });


  }

}

