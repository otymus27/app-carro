// ...
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importe CommonModule
import { FormsModule } from '@angular/forms'; // ✅ Importe FormsModule
import { MarcaService } from '../../../services/marca.service';
import { RelatorioService } from '../../../services/relatorio.service';
import { Marca } from '../../../models/marca';

@Component({
  selector: 'app-relatorio-marcas',
  imports: [    
    CommonModule, // ✅ Adicione-o aqui
    FormsModule // ✅ Adicione-o aqui
  ],
  templateUrl: './relatorio.marca.component.html',
})
export class MarcaComponentRelatorio implements OnInit {
  nomeFiltro: string = '';
  marcas: any[] = [];

  // ✅ Adicionando variáveis de estado para ordenação
  sortField: keyof Marca = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private marcaService: MarcaService,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit(): void {
    this.buscarMarcas();
  }

  // ✅ Método que busca dados para a tabela, usando o MarcaService
  buscarMarcas(): void {
    this.marcaService.listar(this.nomeFiltro, 0, 10, this.sortField, this.sortDir).subscribe((response: any) => {
      // ✅ Adicione esta linha de teste!
    console.log('Valor do filtro "nomeFiltro" antes de chamar o serviço:', this.nomeFiltro);
        // Assume que o listar do service já faz a chamada para o seu backend
        this.marcas = response.content;
      }
    );
  }

  // ✅ Novo método para alternar a ordenação
  alternarOrdenacao(campo: keyof Marca): void {
    if (this.sortField === campo) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = campo;
      this.sortDir = 'asc';
    }
    this.buscarMarcas();
  }

  // ✅ Método que gera o relatório, usando o RelatorioService
  gerarRelatorioMarca(formato: string): void {
    // ✅ ADICIONE ESTA LINHA PARA TESTE
    console.log('Valor do filtro "nomeFiltro":', this.nomeFiltro);
    this.relatorioService.gerarRelatorioMarcas(formato, this.nomeFiltro).subscribe((response: Blob) => {
      // Lógica de download
      const blob = new Blob([response], { type: response.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-marcas.${formato === 'xls' ? 'xlsx' : formato}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }
}