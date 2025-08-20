import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ✅ Imports do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Proprietario } from '../../models/proprietario';
import { ProprietarioService } from '../../services/proprietario.service';
import { Paginacao } from '../../models/paginacao';
import { CpfMaskPipe } from '../../pipes/cpf-mask.pipe';
import { TelefoneMaskPipe } from '../../pipes/telefone-mask.pipe';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-proprietario',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginator,
    CpfMaskPipe,
    TelefoneMaskPipe,
    NgxMaskDirective,
    // ✅ Adicione os módulos do Angular Material
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [provideNgxMask()],
  standalone: true, // ✅ Adicionado para ser usado em módulos standalones
  templateUrl: './proprietario.component.html',
  styleUrl: './proprietario.component.scss',
})
export class ProprietarioComponent {
  // ... outras propriedades
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'acao'];
  dialogRef!: MatDialogRef<any>; // ✅ Mantenha a referência do modal

  // ✅ ADICIONE ESTE CÓDIGO AQUI
private exibirSnackBar(message: string, type: 'success' | 'danger') {
  this.snackBar.open(message, 'Fechar', {
    duration: 3000,
    panelClass: type === 'success' ? ['success-snackbar'] : ['danger-snackbar']
  });
}

  lista: Proprietario[] = [];
  proprietarioSelecionado!: Proprietario;

  // Variáveis para paginação
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

  // Referências para os templates de modal
  // ✅ Adicione a injeção do Angular Material
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  @ViewChild('modalProprietarioDetalhe')
  modalProprietarioDetalhe!: TemplateRef<any>;
  @ViewChild('modalConfirmacaoExclusao')
  modalConfirmacaoExclusao!: TemplateRef<any>;

  constructor() {
    this.listar();
  }

  // ✅ Método de listagem, ordenação e filtro
  listar() {
    let filtroNome: string | undefined = undefined;
    let filtroCpf: string | undefined = undefined;

    const rawFiltro = this.filtro?.trim();
    if (rawFiltro) {
      const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
      if (cpfRegex.test(rawFiltro)) {
        filtroCpf = rawFiltro.replace(/\D/g, '');
      } else {
        filtroNome = rawFiltro;
      }
    }

    this.proprietarioService
      .listar(
        this.page,
        this.size,
        this.colunaOrdenada,
        this.ordem,
        filtroNome,
        filtroCpf
      )
      .subscribe({
        next: (resposta: Paginacao<Proprietario>) => {
          this.lista = resposta.content;
          this.page = resposta.number;
          this.totalPages = resposta.totalPages;
          this.totalElements = resposta.totalElements;
        },
        error: () => alert('Erro ao listar proprietários!'),
      });
  }

  // ✅ Lógica de paginação
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

  // ✅ Aplica o filtro e limpa o campo
  aplicarFiltro() {
    this.page = 0;
    this.listar();
    this.filtro = ''; // Limpa o campo após a busca
  }

  // ✅ Lógica de ordenação
  ordenarPor(campo: keyof Proprietario) {
    if (this.colunaOrdenada === campo) {
      this.ordem = this.ordem === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenada = campo;
      this.ordem = 'asc';
    }
    this.listar();
  }

  // ✅ Novo método para abrir o modal de cadastro/edição
  abrirModal(template: TemplateRef<any>, data: any) {
    this.dialogRef = this.dialog.open(template, { data: data });
  }

  // ✅ Novo método para exibir o toast (SnackBar)
  private exibirToast(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['danger-snackbar'],
    });
  }

  // ✅ Modifique os métodos de CRUD para usar o MatDialog e MatSnackBar
  cadastrarModal() {
    this.proprietarioSelecionado = { id: 0, nome: '', cpf: '', telefone: '' };
    this.abrirModal(
      this.modalProprietarioDetalhe,
      this.proprietarioSelecionado
    );
  }

  editarModal(proprietario: Proprietario) {
    this.proprietarioSelecionado = { ...proprietario };
    this.abrirModal(
      this.modalProprietarioDetalhe,
      this.proprietarioSelecionado
    );
  }

  // ✅ Método de salvar
  salvarProprietario(proprietario: Proprietario) {
    if (
      !proprietario.nome?.trim() ||
      !proprietario.cpf?.trim() ||
      !proprietario.telefone?.trim()
    ) {
      return;
    }

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
          alert('Registro cadastrado com sucesso!');
          this.listar();
          this.dialog.closeAll();
        },
        error: (err) =>
          alert(`Erro ${err.status}: ${err.error?.mensagem || err.message}`),
      });
    } else {
      this.proprietarioService
        .atualizar(proprietario, proprietario.id!)
        .subscribe({
          next: (msg) => {
            alert(msg || 'Registro atualizado com sucesso!');
            this.listar();
            this.dialog.closeAll();
          },
          error: (err) => {
            const erroMsg = err?.error || 'Erro desconhecido!';
            alert(`Erro ${err.status || ''}: ${erroMsg}`);
          },
        });
    }
  }

  excluir(proprietario: Proprietario) {
    this.proprietarioSelecionado = proprietario;

    // ✅ Abre o modal de confirmação e armazena a referência
    this.dialogRef = this.dialog.open(this.modalConfirmacaoExclusao);

    // ✅ Assina o evento 'afterClosed()' do modal
    this.dialogRef.afterClosed().subscribe((resultado) => {
      // Se o resultado for 'true' (confirmado)
      if (resultado) {
        this.proprietarioService
          .excluir(this.proprietarioSelecionado.id!)
          .subscribe({
            next: (mensagem) => {
              this.exibirSnackBar(
                mensagem || 'Registro excluído com sucesso!',
                'success'
              );
              this.listar();
            },
            error: (error) => {
              this.exibirSnackBar('Erro ao excluir proprietário!', 'danger');
            },
          });
      }
    });
  }

 

  // ✅ Modifique o método de cancelamento
  cancelarModal() {
    // Para fechar o modal, chame o método close() da referência do modal
    if (this.dialogRef) {
      this.dialogRef.close(false); // ✅ Passa 'false' para indicar que não houve confirmação
    }
  }

  // ✅ Adicione este método na sua classe ProprietarioComponent
  handlePageEvent(e: PageEvent) {
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.listar();
  }

  // ✅ Modifique o método 'excluirConfirmado()' no HTML
  // Este método não existe mais no .ts, então vamos ajustar o HTML para fechar o modal com um valor.
  // Você precisa adicionar o código abaixo no seu HTML, dentro do ng-template #modalConfirmacaoExclusao
  // <button mat-button color="warn" (click)="dialogRef.close(true)">Excluir</button>
}
