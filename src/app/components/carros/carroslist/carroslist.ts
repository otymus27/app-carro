import { Component } from '@angular/core';
import {Carro} from '../../../models/carro';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-carroslist',
  imports: [
    RouterLink
  ],
  templateUrl: './carroslist.html',
  styleUrl: './carroslist.scss'
})
export class Carroslist {
  lista: Carro[]=[];


  constructor() {


    this.lista.push(new Carro(1,'Fiesta','Ford','Preto',2012));
    this.lista.push(new Carro(2,'Honda','FIT','Preto',2013));
    this.lista.push(new Carro(3,'Astra','GM','Preto',2014));

    let carroNovo = history.state.carroNovo;
    let carroEditado = history.state.carroEditado;

    if(carroNovo!=null){
      carroNovo.id=555;
      this.lista.push(carroNovo)
    }

    if(carroEditado!=null){
      let indice = this.lista.findIndex(x => x.id == carroEditado.id);
      this.lista[indice] = carroEditado;
    }
  }

  excluir(carro: Carro) {
    if (confirm('Deseja excluir este registro?')){
      let indice = this.lista.findIndex((elemento: Carro) => elemento.id === carro.id);
      this.lista.splice(indice, 1);
    }
  }
}
