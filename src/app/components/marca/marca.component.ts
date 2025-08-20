import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MarcaService } from '../../services/marca.service';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { Marca } from '../../models/marca';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';

@Component({
  selector: 'app-marca',
  imports: [
    MdbModalModule,
    CommonModule,
    FormsModule, // ✅ necessário para [(ngModel)]
    MdbFormsModule, // ✅ necessário para mdbInput
  ],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.scss',
})
export class MarcaComponent {
  lista: Marca[] = [];

  //Configuração para paginação
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  irParaPagina(p: number) {
    this.page = p;
    this.listar(); // ou o método que carrega os dados
  }

  // Filtro de pesquisa por nome  
  filtroNome: string = '';
  get listaFiltrada(): Marca[] {
    if (!this.filtroNome) return this.lista;
    return this.lista.filter(m =>
      m.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }

  marcaSelecionada: Marca = { id: 0, nome: '' };

  marcaService = inject(MarcaService);
  modalService = inject(MdbModalService);
  @ViewChild('modalMarcaDetalhe') modalMarcaDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.listar();
  }

 listar() {
    this.marcaService.listar(this.page, this.size).subscribe({
      next: (resposta) => {
        this.lista = resposta.content;
        this.totalPages = resposta.totalPages;
        this.totalElements = resposta.totalElements; // pega a quantidade total
        this.page = resposta.number;
      },
      error: () => alert('Erro ao listar marcas!'),
    });
  }

  proximaPagina() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.listar();
    }
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page--;
      this.listar();
    }
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
    const isNovaMarca = !marca.id || marca.id <= 0;

    if (isNovaMarca) {
      // Cria registro sem id
      const novaMarca: Partial<Marca> = { nome: marca.nome };
      this.marcaService.save(novaMarca).subscribe({
        next: (res: Marca) => {
          alert(`Registro cadastrada com sucesso!`);
          this.listar(); // Atualiza a lista após cadastro
          this.modalRef?.close(); // aqui fecha o modal
        },
        error: (err) => {
          console.error('Erro ao salvar registro:', err);
          alert('Erro ao salvar registro');
        },
      });
    } else {
      // Atualiza marca existente - envia Marca completo
      this.marcaService.update(marca, marca.id!).subscribe({
        next: (msg) => {
          alert(msg || 'Operação realizada com sucesso!');
          this.listar();
          this.modalRef.close();
        },
        error: (err) => {
          const erroMsg = err?.error || 'Erro desconhecido!';
          alert(`Erro ${err.status || ''}: ${erroMsg}`);
        },
      });
    }
  }

  excluir(marca: Marca) {
    if (!confirm(`Deseja excluir ${marca.nome}?`)) return;
    this.marcaService.excluir(marca.id!).subscribe({
      next: (mensagem) => {
        // quando o backend retornar o que se espera
        mensagem = mensagem || 'Registro excluído com sucesso!';
        alert(mensagem);
        this.listar(); // Atualiza a lista após exclusão
      },
      error: (error) => {
        // quando ocorrer qualquer erro de comunicação com o backend
        alert('Algo errado no serviço excluir!');
      },
    });
  }
}
