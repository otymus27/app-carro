import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {Carro} from '../../../models/carro';

@Component({
  selector: 'app-carrosdetails',
  imports: [
    RouterLink,
    FormsModule,
    MdbFormsModule
  ],
  templateUrl: './carrosdetails.html',
  styleUrl: './carrosdetails.scss'
})
export class Carrosdetails {

  //aqui é uma injeção de dependencia parecido o autowired do java
  router = inject(Router);

  carro: Carro = new Carro();

  salvar(){
    alert("registro salvo")
    //redirecionar para pagina
    this.router.navigate(['admin/carros']);
  } ;

}
