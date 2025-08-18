import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { Proprietario } from '../../models/proprietario';
import { ProprietarioService } from '../../services/proprietario.service';
import { CpfMaskPipe } from '../../pipes/cpf-mask.pipe';
import { TelefoneMaskPipe } from '../../pipes/telefone-mask.pipe';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'; // ✅

@Component({
  selector: 'app-proprietario',
  imports: [
    MdbModalModule,
    CommonModule,
    FormsModule, // ✅ necessário para [(ngModel)]
    MdbFormsModule,
    CpfMaskPipe, // ✅ importar pipe
    TelefoneMaskPipe,
    NgxMaskDirective, // ✅ precisa importar
  ],
  providers: [provideNgxMask()], // ✅ habilita
  templateUrl: './proprietario.component.html',
  styleUrl: './proprietario.component.scss',
})
export class ProprietarioComponent {
  lista: Proprietario[] = [];
  proprietarioSelecionado!: Proprietario;

  proprietarioService = inject(ProprietarioService);
  modalService = inject(MdbModalService);
  @ViewChild('modalProprietarioDetalhe')
  modalProprietarioDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  constructor() {
    this.listar();
  }

  listar() {
    this.proprietarioService.listar().subscribe({
      next: (lista) => (this.lista = lista),
      error: () => alert('Erro ao listar proprietários!'),
    });
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
    // Validação front-end: impede enviar se campos vazios
    if (
      !proprietario.nome?.trim() ||
      !proprietario.cpf?.trim() ||
      !proprietario.telefone?.trim()
    ) {
      return; // não envia para o backend
    }

    console.log('Proprietário a salvar:', proprietario); // ✅ debug

    // Remove máscara de CPF e telefone antes de enviar
    const p = { ...proprietario };
    p.cpf = p.cpf.replace(/\D/g, '');
    p.telefone = p.telefone ? p.telefone.replace(/\D/g, '') : '';

    const isNovoRegistro = !proprietario.id || proprietario.id <= 0;

    if (isNovoRegistro) {
      // Cria registro sem id
      const novoRegistro: Partial<Proprietario> = {
        nome: proprietario.nome,
        cpf: p.cpf,
        telefone: p.telefone,
      };
      this.proprietarioService.cadastrar(novoRegistro).subscribe({
        next: () => {
          console.log('Retorno do backend:', novoRegistro); // 👈 vai mostrar o objeto no console
          alert('Registro cadastrado com sucesso!');
          this.listar();
          this.modalRef.close();
        },
        error: (err) =>
          alert(`Erro ${err.status}: ${err.error?.mensagem || err.message}`),
      });
    } else {
      // Atualiza marca existente - envia Marca completo
      this.proprietarioService
        .atualizar(proprietario, proprietario.id!)
        .subscribe({
          next: (msg) => {
            console.log('Retorno do backend:', proprietario); // 👈 vai mostrar o objeto no console
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

  excluir(proprietario: Proprietario) {
    if (!confirm(`Deseja excluir ${proprietario.nome}?`)) return;
    this.proprietarioService.excluir(proprietario.id!).subscribe({
      next: (mensagem) => {
        // mensagem = mensagem || 'Registro excluído com sucessosssss!';
        alert(mensagem);
        this.listar();
      },
      error: (error) => {
        alert('Erro ao excluir proprietário!');
      },
    });
  }
}
