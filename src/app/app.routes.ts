import { Routes } from '@angular/router';
import { Carroslist } from './components/carros/carroslist/carroslist';
import {Login} from './components/layout/login/login';
import {Principal} from './components/layout/principal/principal';
import {Carrosdetails} from './components/carros/carrosdetails/carrosdetails';
import {Marcaslist} from './components/marcas/marcaslist/marcaslist';
import {Marcasdetails} from './components/marcas/marcasdetails/marcasdetails';

// rota para acessar carroslist
export const routes: Routes = [
  // caso acesse sem informar uma rota, será feito o redecionamento para rota de carros
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'admin', component: Principal, children: [
      { path: 'carros', component: Carroslist},
      { path: 'carros/new', component: Carrosdetails},
      { path: 'carros/edit/:id', component: Carrosdetails},
      { path: 'marcas', component: Marcaslist},
      { path: 'marcas/new', component: Marcasdetails},
      { path: 'marcas/edit/:id', component: Marcasdetails},
    ]},
  { path: 'carros', component: Carroslist }
];
