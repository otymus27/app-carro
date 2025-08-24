import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './../sidebar/sidebar.component.html',
  styleUrl: './../sidebar/sidebar.component.scss',
})
export class SidebarComponent {
  isCollapsed = false;
  showCarrosSubmenu = false;
  showMarcasSubmenu = false;
  showProprietariosSubmenu = false;
  showUsuariosSubmenu = false;

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenu(submenu: string) {
    if (submenu === 'carros') {
      this.showCarrosSubmenu = !this.showCarrosSubmenu;
      this.showMarcasSubmenu = false;
      this.showProprietariosSubmenu = false;
      this.showUsuariosSubmenu = false;
    } else if (submenu === 'marcas') {
      this.showMarcasSubmenu = !this.showMarcasSubmenu;
      this.showCarrosSubmenu = false;
      this.showProprietariosSubmenu = false;
      this.showUsuariosSubmenu = false;
    } else if (submenu === 'proprietarios') {
      this.showProprietariosSubmenu = !this.showProprietariosSubmenu;
      this.showCarrosSubmenu = false;
      this.showMarcasSubmenu = false;
      this.showUsuariosSubmenu = false;
    } else if (submenu === 'usuarios') {
      this.showUsuariosSubmenu = !this.showUsuariosSubmenu;
      this.showCarrosSubmenu = false;
      this.showProprietariosSubmenu = false;
      this.showMarcasSubmenu = false;
    }
  }

  hideAllSubmenus() {
    this.showCarrosSubmenu = false;
    this.showMarcasSubmenu = false;
    this.showProprietariosSubmenu = false;
    this.showCarrosSubmenu = false;
  }
}
