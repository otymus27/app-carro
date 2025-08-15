import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
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
  router1 = inject(ActivatedRoute);


  //carro: Carro = new Carro(1,'Fiesta','Ford','Preto',2012);
  carro: Carro = new Carro(0, '', '', '', new Date().getFullYear());

  //acessar a variavel de rota
  constructor() {
    let id = this.router1.snapshot.params['id'];
    if (id>0){
      this.buscarPorId(id);
    }

  }

  buscarPorId(id: number){
    let carroRetornado: Carro = new Carro(1,'Fiesta','Ford','Preto',2012);
    this.carro = carroRetornado;
  }


  salvar(){
    if (this.carro.id > 0){
      alert('Registro atualizado com sucesso!');
      this.router.navigate(['admin/carros'],{state: {carroEditado: this.carro}});
    }else {
      alert("Registro salvo com sucesso!");
      //redirecionar para pagina
      this.router.navigate(['admin/carros'],{state: {carroNovo: this.carro}});
    }

  } ;

}
