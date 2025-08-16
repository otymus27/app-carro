import {Component, ElementRef, inject, TemplateRef, ViewChild} from '@angular/core';
import {Carro} from '../../../models/carro';
import {RouterLink} from '@angular/router';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import {Carrosdetails} from '../carrosdetails/carrosdetails';
import {CarroService} from '../../../services/carro.service';

@Component({
  selector: 'app-carroslist',
  imports: [ MdbModalModule, Carrosdetails], // ✅ Carrosdetails precisa estar aqui
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

   carroService = inject(CarroService);

  constructor() {
    this.listar();    
  }

 listar(): void {
    this.carroService.listar().subscribe({
      next: lista => { // quando o backend retornar o que se espera
        this.lista = lista;
      },
      error: error => { // quando ocorrer qualquer erro de comunicação com o backend
        alert('Algo errado no serviço listar!')
      }
    })
 }

 excluir(carro: Carro){
    this.carroService.excluir(carro.id).subscribe({
      next: mensagem => { // quando o backend retornar o que se espera
        mensagem = mensagem || 'Carro excluído com sucesso!';
        alert(mensagem);
        this.listar(); // Atualiza a lista após exclusão
      },
      error: error => { // quando ocorrer qualquer erro de comunicação com o backend
        alert('Algo errado no serviço excluir!')
      }
    })
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
