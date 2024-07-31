import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessGameComponent } from './chess-game/chess-game.component';

const routes: Routes = [
  {path:'chessgame',component:ChessGameComponent},
  { path: '', redirectTo: '/chessgame', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
