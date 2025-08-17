import { Routes } from '@angular/router';
import {Login} from './components/layout/login/login';
import {Principal} from './components/layout/principal/principal';
import { ProprietarioComponent } from './components/proprietario/proprietario.component';
import { MarcaComponent } from './components/marca/marca.component';
import { CarroComponent } from './components/carro/carro.component';

// rota para acessar carroslist
export const routes: Routes = [
  // caso acesse sem informar uma rota, será feito o redecionamento para rota de carros
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'admin', component: Principal, children: [
      { path: 'carros', component: CarroComponent},     
      { path: 'proprietarios', component: ProprietarioComponent},
      { path: 'marcas', component: MarcaComponent},
  ]},
  
];
