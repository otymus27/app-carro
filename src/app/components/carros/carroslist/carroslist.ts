import {Component, ElementRef, inject, TemplateRef, ViewChild} from '@angular/core';
import {Carro} from '../../../models/carro';
import {RouterLink} from '@angular/router';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import {Carrosdetails} from '../carrosdetails/carrosdetails';

@Component({
  selector: 'app-carroslist',
  imports: [RouterLink, MdbModalModule, Carrosdetails], // ✅ Carrosdetails precisa estar aqui
  templateUrl: './carroslist.html',
  styleUrl: './carroslist.scss'
})
export class Carroslist {
  lista: Carro[]=[];

  //configuração de elementos para modal
   modalService = inject(MdbModalService);//para conseguir abrir a modal
   @ViewChild("modalCarroDetalhe") modalCarroDetalhe!: TemplateRef<any>;
   modalRef!: MdbModalRef<any>;
  carroSelecionado!: Carro;

  constructor() {
    this.lista = [
      new Carro(1, 'Fiesta', 'Ford', 'Preto', 2012),
      new Carro(2, 'FIT', 'Honda', 'Preto', 2013),
      new Carro(3, 'Astra', 'GM', 'Preto', 2014)
    ];
  }

  excluir(carro: Carro) {
    if (confirm('Deseja excluir este registro?')){
      let indice = this.lista.findIndex((elemento: Carro) => elemento.id === carro.id);
      this.lista.splice(indice, 1);
    }
  }

  CadastrarModal() {
    this.carroSelecionado = new Carro(0, '', '', '', new Date().getFullYear());
    this.modalRef=this.modalService.open(this.modalCarroDetalhe);
  }

  cancelarModal() {
    this.modalRef.close();
  }

  editarModal(carro: Carro) {
    this.carroSelecionado = { ...carro };
    this.modalRef = this.modalService.open(this.modalCarroDetalhe);
  }

  salvarCarro(carro: Carro) {
    if (carro.id > 0) {
      const index = this.lista.findIndex(c => c.id === carro.id);
      if (index >= 0) this.lista[index] = carro;
    } else {
      carro.id = this.lista.length > 0 ? Math.max(...this.lista.map(c => c.id)) + 1 : 1;
      this.lista.push(carro);
    }

    // ✅ Fecha o modal aqui, no componente pai
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
