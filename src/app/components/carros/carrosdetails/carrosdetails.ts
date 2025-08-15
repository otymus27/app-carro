import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MdbFormsModule} from 'mdb-angular-ui-kit/forms';
import {Carro} from '../../../models/carro';

@Component({
  selector: 'app-carrosdetails',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MdbFormsModule
  ],
  templateUrl: './carrosdetails.html',
  styleUrl: './carrosdetails.scss'
})
export class Carrosdetails {

  @Input() carro!: Carro;
  @Input() onSave!: (carro: Carro) => void;
  @Input() onCancel!: () => void;

  salvar() {
    this.onSave?.(this.carro);
  }

  cancelar() {
    this.onCancel?.();
  }
}
