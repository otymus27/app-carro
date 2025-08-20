import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel e validação de template-driven forms

// ✅ Imports do Angular Material
import { MatButtonModule } from '@angular/material/button'; // Adicionado
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Explicitamente adicionado para clareza
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule, // ✅ CORRIGIDO: Deve ser MatPaginatorModule
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
    MatInputModule, // ✅ Adicionado explicitamente
    MatTableModule,
    MatPaginatorModule, // ✅ CORRIGIDO aqui
    CpfMaskPipe,
    TelefoneMaskPipe,
    NgxMaskDirective,
    MatButtonModule, // ✅ Adicionado
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [provideNgxMask()],
  standalone: true,
  templateUrl: './proprietario.component.html',
  styleUrl: './proprietario.component.scss',
})
export class ProprietarioComponent {
  // ✅ Propriedades da tabela e do modal
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'acao'];
  dialogRef!: MatDialogRef<any>; // Mantenha a referência do modal

  lista: Proprietario[] = [];
  // Garanta que proprietarioSelecionado sempre tenha uma estrutura inicial para evitar erros de renderização.
  // Pode ser um objeto vazio ou um objeto com valores padrão, dependendo da sua lógica.
  proprietarioSelecionado: Proprietario = { id: 0, nome: '', cpf: '', telefone: '' }; 

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

  // ✅ Injeção de serviços
  proprietarioService = inject(ProprietarioService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  // Referências para os templates de modal
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
        error: (err) => { // Use 'err' para capturar o erro completo
          console.error('Erro ao listar proprietários:', err); // Log para debug
          this.exibirSnackBar('Erro ao listar proprietários!', 'danger'); // Melhor UX
        },
      });
  }

  // ✅ Lógica de paginação
  handlePageEvent(e: PageEvent) {
    this.size = e.pageSize;
    this.page = e.pageIndex;
    this.listar();
  }

  // Métodos de paginação desnecessários se MatPaginator for usado corretamente
  // irParaPagina(p: number) {
  //   this.page = p;
  //   this.listar();
  // }
  // proximaPagina() {
  //   if (this.page < this.totalPages - 1) {
  //     this.page++;
  //     this.listar();
  //   }
  // }
  // paginaAnterior() {
  //   if (this.page > 0) {
  //     this.page--;
  //     this.listar();
  //   }
  // }

  // ✅ Aplica o filtro
  aplicarFiltro() {
    this.page = 0; // Reinicia a página ao aplicar novo filtro
    this.listar();
    // Você pode optar por limpar o filtro aqui ou manter o valor no campo de pesquisa
     this.filtro = ''; 
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
  private exibirSnackBar(message: string, type: 'success' | 'danger') {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['danger-snackbar'],
    });
  }

  // ✅ Modifique os métodos de CRUD para usar o MatDialog e MatSnackBar
  cadastrarModal() {
    // Sempre inicialize com um objeto completo para evitar erros de binding
    this.proprietarioSelecionado = { id: 0, nome: '', cpf: '', telefone: '' }; 
    this.abrirModal(
      this.modalProprietarioDetalhe,
      this.proprietarioSelecionado
    );
  }

  editarModal(proprietario: Proprietario) {
    // Faça uma cópia para evitar modificações diretas no objeto original da lista
    this.proprietarioSelecionado = { ...proprietario }; 
    this.abrirModal(
      this.modalProprietarioDetalhe,
      this.proprietarioSelecionado
    );
  }

  // ✅ Método de salvar
  salvarProprietario(proprietario: Proprietario) {
    // Validação básica antes de enviar
    if (
      !proprietario.nome?.trim() ||
      !proprietario.cpf?.trim() ||
      !proprietario.telefone?.trim()
    ) {
      this.exibirSnackBar('Por favor, preencha todos os campos obrigatórios.', 'danger');
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
          this.exibirSnackBar('Registro cadastrado com sucesso!', 'success');
          this.listar();
          this.dialog.closeAll(); // Fecha todos os modais abertos
        },
        error: (err) => {
          console.error('Erro ao cadastrar proprietário:', err);
          const mensagemErro = err.error?.mensagem || err.message || 'Erro desconhecido ao cadastrar!';
          this.exibirSnackBar(`Erro: ${mensagemErro}`, 'danger');
        },
      });
    } else {
      this.proprietarioService
        .atualizar(proprietario, proprietario.id!)
        .subscribe({
          next: (msg) => {
            this.exibirSnackBar(msg || 'Registro atualizado com sucesso!', 'success');
            this.listar();
            this.dialog.closeAll(); // Fecha todos os modais abertos
          },
          error: (err) => {
            console.error('Erro ao atualizar proprietário:', err);
            const mensagemErro = err.error?.mensagem || err.message || 'Erro desconhecido ao atualizar!';
            this.exibirSnackBar(`Erro: ${mensagemErro}`, 'danger');
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
              console.error('Erro ao excluir proprietário:', error);
              const mensagemErro = error.error?.mensagem || error.message || 'Erro desconhecido ao excluir!';
              this.exibirSnackBar(`Erro: ${mensagemErro}`, 'danger');
            },
          });
      }
    });
  }

  // ✅ Modifique o método de cancelamento
  cancelarModal() {
    if (this.dialogRef) {
      this.dialogRef.close(false); // Passa 'false' para indicar que não houve confirmação
    }
  }
}