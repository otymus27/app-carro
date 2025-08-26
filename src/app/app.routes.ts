import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { Principal } from './components/layout/principal/principal';
import { ProprietarioComponent } from './components/proprietario/proprietario.component';
import { MarcaComponent } from './components/marca/marca.component';
import { CarroComponent } from './components/carro/carro.component';
import { HomeComponent } from './components/layout/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MarcaComponentRelatorio } from './components/relatorio/marca/relatorio.marca.component';

export const routes: Routes = [
  // Redireciona a rota base para a página de login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rota para o componente de login
  { path: 'login', component: Login },

  // Rota para o painel de administração (com sidebar, header, etc.)
  {
    path: 'admin',
    component: Principal,
    canActivate: [AuthGuard], // <-- Adicione esta linha
    children: [
      // Rota padrão para o componente 'Início'
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },

      // Rotas com submenus para Carros
      {
        path: 'carros',
        children: [
          // Rota para a lista de carros (Consulta)
          { path: '', component: CarroComponent },
          // Rota para gerenciar um carro (adição/edição)
          { path: 'gerenciar', component: CarroComponent },
        ],
      },

      // Rotas com submenus para Proprietarios
      {
        path: 'proprietarios',
        children: [
          { path: '', component: ProprietarioComponent },
          { path: 'gerenciar', component: ProprietarioComponent },
        ],
      },

      // Rotas com submenus para Marcas
      {
        path: 'marcas',
        children: [
          { path: 'consulta', component: MarcaComponentRelatorio },
          { path: 'gerenciar', component: MarcaComponent },
        ],
      },

      // Rotas com submenus para Marcas
      {
        path: 'usuarios',
        children: [
          { path: '', component: UsuarioComponent },
          { path: 'gerenciar', component: UsuarioComponent },
        ],
      },
    ],
  },

  // Rota wildcard para redirecionar URLs inválidas para a página de login
  { path: '**', redirectTo: 'login' },
];
