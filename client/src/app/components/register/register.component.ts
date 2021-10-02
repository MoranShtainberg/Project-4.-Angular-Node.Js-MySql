import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataAuthService } from 'src/app/services/data-auth.service';
import { DataUserMainService } from 'src/app/services/data-user-main.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public myFormLeft:FormGroup
  public myFormRigth:FormGroup
  public biggest10cities:any = ['Jerusalem','Tel-Aviv','Haifa','Rishon LeZion','Petah Tikva','Ashdod','Netanya','Beer Sheva','Bnei Brak','Holon']
  public selected:string
  
  // public myFormRigth_valid:boolean
  public temp_Id_number:number
  public temp_username:string
  public temp_password:string

  constructor(
    public _fb: FormBuilder,
    public _data_auth: DataAuthService,
    public _data_user_main: DataUserMainService,
    public _r: Router
  ) { }

  ngOnInit(): void {
    this.myFormLeft = this._fb.group({
      Id_number:["",[Validators.required]],
      username:["",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password:["",Validators.required],
      confirm_password:["",Validators.required]
    });//myFormLeft 
    
    this.myFormRigth = this._fb.group({
      city:["",[Validators.required]],
      Street:["",Validators.required],
      first_name:["",Validators.required],
      last_name:["",Validators.required]
    });//myFormRigth
    // console.log("myFormRigth_valid: "+this.myFormRigth.valid);
    // this.myFormRigth_valid = this.myFormRigth.valid;

  }//ngOnInit

  public logmeOut(){
    localStorage.removeItem("token");
    this._r.navigateByUrl('/');    
    // location.reload();
  }

}
