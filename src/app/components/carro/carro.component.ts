import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { Carro } from '../../models/carro';
import { CarroService } from '../../services/carro.service';
import { Marca } from '../../models/marca';
import { Proprietario } from '../../models/proprietario';
import { MarcaService } from '../../services/marca.service';
import { ProprietarioService } from '../../services/proprietario.service';
import { CarroCreateDTO } from '../../models/carro-create-dto';


@Component({
  selector: 'app-carro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbFormsModule,
    MdbModalModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './carro.component.html',
  styleUrl: './carro.component.scss'
})


export class CarroComponent {
  lista: Carro[] = [];
  carroSelecionado!: Carro;

  marcas: Marca[] = [];              // ✅ lista para select
  proprietarios: Proprietario[] = []; // ✅ lista para multi-select

  carroService = inject(CarroService);
  marcaService = inject(MarcaService);
  proprietarioService = inject(ProprietarioService);
  modalService = inject(MdbModalService);
  // ✅ referência para o modal
  // ✅ o modal será aberto com a referência do template
  @ViewChild('modalCarroDetalhe') modalCarroDetalhe!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

constructor() {
    this.listar();
    this.carregarMarcas();
    this.carregarProprietarios();
  }

  listar() {
    this.carroService.listar().subscribe({
      next: lista => {
        // não sobrescrever proprietarios, apenas garantir que seja array
        this.lista = lista.map(carro => ({
          ...carro,
          proprietarios: carro.proprietarios || []
        }));
      },
      error: () => alert('Erro ao listar carros!')
    });
  }

  carregarMarcas() {
    this.marcaService.listar().subscribe({
      next: lista => this.marcas = lista,
      error: () => alert('Erro ao listar marcas!')
    });
  }

  carregarProprietarios() {
    this.proprietarioService.listar().subscribe({
      next: lista => this.proprietarios = lista,
      error: () => alert('Erro ao listar proprietários!')
    });
  }

  cadastrarModal() {
    this.carroSelecionado = { id: 0, modelo: '', cor: '', ano: 0, marca: { id: 0, nome:'' }, proprietarios: [] };
    this.modalRef = this.modalService.open(this.modalCarroDetalhe);
  }

  editarModal(carro: Carro) {    
    // Seleciona a marca correta da lista por referência
    const marcaSelecionada = this.marcas.find(m => m.id === carro.marca.id) || { id: 0, nome: '' };

    // Seleciona os proprietários corretos da lista por referência
    const proprietariosSelecionados = carro.proprietarios.map(p => {
      return this.proprietarios.find(pr => pr.id === p.id)!;
    });

    // Atualiza o carroSelecionado com referências corretas
    this.carroSelecionado = { 
      id: carro.id,
      modelo: carro.modelo || '',   // garante valor
      cor: carro.cor || '',         // garante valor
      ano: carro.ano || 0,          // garante valor
      marca: marcaSelecionada,
      proprietarios: proprietariosSelecionados
    };

    // Abre o modal
    this.modalRef = this.modalService.open(this.modalCarroDetalhe);
  }


  cancelarModal() {
    this.modalRef.close();
  }

  salvarCarro(carro: Carro, form: any) {
    if (!carro.modelo?.trim() || !carro.cor?.trim() || !carro.ano || !carro.marca?.id) {
      return;
    }

    console.log('Carro a salvar:', carro);

    const isNovoRegistro = !carro.id || carro.id <= 0;

    if (isNovoRegistro) {
      const novoRegistro: CarroCreateDTO = { modelo: carro.modelo, marca: { id: carro.marca.id }, ano: carro.ano, cor: carro.cor,proprietarios: carro.proprietarios.map(p => ({ id: p.id }))  };
      this.carroService.cadastrar(novoRegistro).subscribe({
        next: () => {
          console.log('Retorno do backend:', novoRegistro);
          alert('Carro cadastrado com sucesso!');
          this.listar();
          this.modalRef.close();
        },
        error: (err) => alert(`Erro ${err.status}: ${err.error?.mensagem || err.message}`)
      });
    } else {
      this.carroService.atualizar(carro, carro.id!).subscribe({
        next: () => {
          console.log('Retorno do backend:', carro);
          alert('Carro atualizado com sucesso!');
          this.listar();
          this.modalRef.close();
        },
        error: (err) => {
          const erroMsg = err?.error || 'Erro desconhecido!';
          alert(`Erro ${err.status || ''}: ${erroMsg}`);
        }
      });
    }
  }

  excluir(carro: Carro) {
    if (!confirm(`Deseja excluir o carro ${carro.modelo}?`)) return;
    this.carroService.excluir(carro.id!).subscribe({
      next: (mensagem) => {
        alert(mensagem || 'Carro excluído com sucesso!');
        this.listar();
      },
      error: () => {
        alert('Erro ao excluir carro!');
      }
    });
  }
}

