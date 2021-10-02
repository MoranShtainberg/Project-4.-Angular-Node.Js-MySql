import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { MarketComponent } from './components/market/market.component';
import { OrderComponent } from './components/order/order.component';
import { RegisterComponent } from './components/register/register.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

const routes: Routes = [
  {path:"main", pathMatch:'full',component:MainComponent},
  {path:"register",component:RegisterComponent},
  {path:"market",component:MarketComponent},
  {path:"order",component:OrderComponent},
  {path:"thank_you",component:ThankYouComponent},
  {path:'',pathMatch:'full',redirectTo:"main"},
  {path:'**',pathMatch:'full',redirectTo:'main'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
