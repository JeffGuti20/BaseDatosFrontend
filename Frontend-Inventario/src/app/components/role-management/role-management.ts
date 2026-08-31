import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css',
})
export class RoleManagement {
  public roles: any[] = [];

  public isModalOpen = false;
  public selectedRole: any = null;

  public isDeleteModalOpen = false;
  public roleToDelete: any = null;

  public toast = {
    show: false,
    message: '',
    typeClass: 'bg-success',
  };

  constructor(
    private _roleService: RoleService,
    private cdr: ChangeDetectorRef,
  ) {
  }
  public search: string = '';
  public currentUser: any;

  showToast(message: string, type: 'success' | 'danger' | 'info' | 'warning' = 'success') {
    this.toast.message = message;
    this.toast.typeClass = `bg-${type}`;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this._roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
      },
    });
  }

  createRole(role: any) {
    this._roleService.createRole(role).subscribe({
      next: (response: any) => {
        this.getRoles();
        this.closeModal();
        this.showToast('Rol creado correctamente', 'success');
      },
      error: (err) => {
        this.showToast('Error al crear rol', 'danger');
      },
    });
  }

  updateRole(role:any) {
    this._roleService.updateRole(role).subscribe({
      next: (response: any) => {
        this.getRoles();
        this.closeModal();
        this.showToast('Rol actualizado correctamente', 'warning');
      },
      error: (err) => {
        this.showToast('Error al actualizar rol', 'danger');
      },
    });
  }

  confirmDelete(role_id:number) {
    this._roleService.deleteRole(role_id).subscribe({
      next: (response: any) => {
        this.getRoles();
        this.closeModal();
        this.showToast('Rol eliminado correctamente', 'danger');
      },
      error: (err) => {
        this.showToast('Error al eliminar rol', 'danger');
      },
    });

    this.closeDeleteModal();
  }

  openModal(role: any) {
    this.selectedRole = role ? { ...role } : { role_id: null, name: '' };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRole = null;
  }

  openDeleteModal(role: any) {
    this.roleToDelete = role;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.roleToDelete = null;
  }
}
