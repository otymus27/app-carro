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
    let carro: Carro = new Carro();

    carro.id = 1;
    carro.modelo = 'FIT';
    carro.marca = 'HONDA';
    carro.cor = "PRETO";
    carro.ano = 2012;

    let carro1: Carro = new Carro();
    carro1.id = 2;
    carro1.modelo = 'FUSION';
    carro1.marca = 'FORD';
    carro1.cor = "AZUL";
    carro1.ano = 2013;

    let carro2: Carro = new Carro();
    carro2.id = 3;
    carro2.modelo = 'ASTRA';
    carro2.marca = 'GM';
    carro2.cor = "BRANCO";
    carro2.ano = 2006;

    this.lista.push(carro);
    this.lista.push(carro1);
    this.lista.push(carro2);
  }

  excluir() {
    //implementar metodo aqui
  }
}
