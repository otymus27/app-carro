export class Carro {

  // quando colocamos a ! em frente ao atributo é para não precisar inicializar o atributo
  id!: number;
  modelo!: string;
  marca!: string;
  cor!: string;
  ano!: number

  //construtor da classe persolizado
  constructor(id:number,modelo:string,marca:string,cor:string, ano:number) {
    this.id = id;
    this.modelo = modelo;
    this.marca = marca;
    this.cor = cor;
    this.ano = ano;
  }




}
