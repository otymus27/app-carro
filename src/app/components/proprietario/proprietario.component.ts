import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { Proprietario } from '../../models/proprietario';
import { ProprietarioService } from '../../services/proprietario.service';
import { CpfMaskPipe } from '../../pipes/cpf-mask.pipe';
import { TelefoneMaskPipe } from '../../pipes/telefone-mask.pipe';

@Component({
  selector: 'app-proprietario',
  imports: [
    CommonModule,
    FormsModule, // necessário para [(ngModel)]
    MdbFormsModule,
    MdbModalModule,
    CpfMaskPipe, // importar pipe
    TelefoneMaskPipe,
    NgxMaskDirective, // precisa importar
  ],
  providers: [provideNgxMask()], // habilita
  templateUrl: './proprietario.component.html',
  styleUrl: './proprietario.component.scss',
})
export class ProprietarioComponent {
  lista: Proprietario[] = [];
  proprietarioSelecionado!: Proprietario;

  // Paginação
  page = 0;
  size = 5;
  totalPages = 0;
  totalElements = 0;

  // Filtro
  filtro: string = '';

  // Ordenação
  colunaOrdenada: keyof Proprietario = 'nome';
  ordem: 'asc' | 'desc' = 'asc';

  proprietarioService = inject(ProprietarioService);
  modalService = inject(MdbModalService);

  @ViewChild('modalProprietarioDetalhe')
  modalProprietarioDetalhe!: TemplateRef<any>;

  // ✅ Nova referência de template para o modal de confirmação
  @ViewChild('modalConfirmacaoExclusao') modalConfirmacaoExclusao!: TemplateRef<any>;

  modalRef!: MdbModalRef<any>;

  constructor() {
    this.listar();
  }

  listar() {
    // Detecta se o filtro é CPF ou nome
    let filtroNome: string | undefined;
    let filtroCpf: string | undefined;

    const rawFiltro = this.filtro?.trim();
    if (rawFiltro) {
      const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/; // padrão CPF
      if (cpfRegex.test(rawFiltro)) {
        filtroCpf = rawFiltro.replace(/\D/g, ''); // remove máscara
      } else {
        filtroNome = rawFiltro;
      }
    }

    this.proprietarioService
      .listar(this.page, this.size, this.colunaOrdenada, this.ordem, filtroNome, filtroCpf)
      .subscribe({
        next: (resposta) => {
          this.lista = resposta.content;
          this.page = resposta.number;
          this.totalPages = resposta.totalPages;
          this.totalElements = resposta.totalElements;
        },
        error: () => alert('Erro ao listar proprietários!'),
      });
  }

  irParaPagina(p: number) {
    this.page = p;
    this.listar();
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

  aplicarFiltro() {
    this.page = 0; // sempre volta para primeira página
    this.listar();
    this.filtro = ''; // limpa campo de filtro
  }

  ordenarPor(campo: keyof Proprietario) {
    if (this.colunaOrdenada === campo) {
      this.ordem = this.ordem === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenada = campo;
      this.ordem = 'asc';
    }
    this.listar();
  }

  cadastrarModal() {
    this.proprietarioSelecionado = { id: 0, nome: '', cpf: '', telefone: '' };
    this.modalRef = this.modalService.open(this.modalProprietarioDetalhe);
  }

  editarModal(proprietario: Proprietario) {
    this.proprietarioSelecionado = { ...proprietario };
    this.modalRef = this.modalService.open(this.modalProprietarioDetalhe);
  }

  cancelarModal() {
    this.modalRef.close();
  }

  salvarProprietario(proprietario: Proprietario) {
    // Validação front-end
    if (!proprietario.nome?.trim() || !proprietario.cpf?.trim() || !proprietario.telefone?.trim()) {
      return;
    }

    console.log('Proprietário a salvar:', proprietario);

    // Remove máscara antes de enviar
    const p = { ...proprietario };
    p.cpf = p.cpf.replace(/\D/g, '');
    p.telefone = p.telefone ? p.telefone.replace(/\D/g, '') : '';

    const isNovoRegistro = !proprietario.id || proprietario.id <= 0;

    if (isNovoRegistro) {
      const novoRegistro: Partial<Proprietario> = {
        nome: proprietario.nome,
        cpf: p.cpf,
        telefone: p.telefone,
      };

      this.proprietarioService.cadastrar(novoRegistro).subscribe({
        next: () => {
          console.log('Retorno do backend:', novoRegistro);
          alert('Registro cadastrado com sucesso!');
          this.listar();
          this.modalRef.close();
        },
        error: (err) =>
          alert(`Erro ${err.status}: ${err.error?.mensagem || err.message}`),
      });
    } else {
      this.proprietarioService.atualizar(proprietario, proprietario.id!).subscribe({
        next: (msg) => {
          console.log('Retorno do backend:', proprietario);
          alert(msg || 'Registro atualizado com sucesso!');
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

  // ✅ Método que abre o modal de confirmação
  excluir(proprietario: Proprietario) {
    this.proprietarioSelecionado = proprietario;
    this.modalRef = this.modalService.open(this.modalConfirmacaoExclusao);
  }

  // ✅ Novo método chamado pelo modal
  excluirConfirmado() {
    // Primeiro, fecha o modal de confirmação
    this.modalRef.close();

    // Em seguida, chama o serviço de exclusão
    this.proprietarioService.excluir(this.proprietarioSelecionado.id!).subscribe({
      next: (mensagem) => {
        alert(mensagem || 'Registro excluído com sucesso!');
        this.listar();
      },
      error: (error) => {
        alert('Erro ao excluir proprietário!');
      },
    });
  }
}
