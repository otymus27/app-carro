import {Component, inject} from '@angular/core';
import { MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  usuario!:string;
  senha!: string;

  //aqui é uma injeção de dependencia parecido o autowired do java
  router = inject(Router);

  logar(): void {
    if (this.usuario == 'admin' && this.senha == '123') {
      //redirecionar para pagina
      this.router.navigate(['admin/carros']);
    }else {
      alert('Usuário ou senha invalidos!');
    }
  }

}
