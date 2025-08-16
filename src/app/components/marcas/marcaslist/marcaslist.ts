import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Marca } from '../../../models/marca';
import { MarcaService } from '../../../services/marca.service';
import { MdbModalRef, MdbModalService, MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-marcaslist',
  imports: [
    MdbModalModule,
    CommonModule,
    FormsModule,       // ✅ necessário para [(ngModel)]
    MdbFormsModule     // ✅ necessário para mdbInput
  ],
  templateUrl: './marcaslist.html',
  styleUrl: './marcaslist.scss'
})
export class Marcaslist {

  lista: Marca[] = [];
  marcaSelecionada!: Marca;

  marcaService = inject(MarcaService);
  modalService = inject(MdbModalService);
  @ViewChild("modalMarcaDetalhe") modalMarcaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() { this.listar(); }

  listar() {
    this.marcaService.listar().subscribe({
      next: lista => this.lista = lista,
      error: () => alert('Erro ao listar marcas!')
    });
  }

  CadastrarModal() {
    this.marcaSelecionada = { id: 0, nome: '' };
    this.modalRef = this.modalService.open(this.modalMarcaDetalhe);
  }

  editarModal(marca: Marca) {
    this.marcaSelecionada = { ...marca };
    this.modalRef = this.modalService.open(this.modalMarcaDetalhe);
  }

  cancelarModal() {
    this.modalRef.close();
  }

  salvarMarca(marca: Marca) {

    console.log('Marca a salvar:', marca); // ✅ verifique todos os campos

    if (!marca.id || marca.id <= 0) {
    // marca nova
    const novaMarca = { ...marca }; // cria cópia
    delete novaMarca.id;            // remove id
    this.marcaService.save(novaMarca).subscribe({
      next: (msg) => {
        alert(msg);
        this.listar();
        this.modalRef.close();
      },
      error: (err) => alert(`Erro ${err.status}: ${err.error}`)
    });
  } else {
    // marca existente
    this.marcaService.update(marca, marca.id).subscribe({
      next: (msg) => {
        alert(msg);
        this.listar();
        this.modalRef.close();
      },
      error: (err) => alert(`Erro ${err.status}: ${err.error}`)
    });
  }
  }

  excluir(marca: Marca) {
    if (!confirm(`Deseja excluir ${marca.nome}?`)) return;
    this.marcaService.excluir(marca.id!).subscribe({
      next: mensagem => { // quando o backend retornar o que se espera
          mensagem = mensagem || 'Registro excluído com sucesso!';
          alert(mensagem);
          this.listar(); // Atualiza a lista após exclusão
        },
        error: error => { // quando ocorrer qualquer erro de comunicação com o backend
          alert('Algo errado no serviço excluir!')
        }
    });
  }

  
  

}
