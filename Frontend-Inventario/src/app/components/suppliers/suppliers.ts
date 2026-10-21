
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css',
})
export class Suppliers {
  public suppliers: any[] = [];

  public isModalOpen = false;
  public selectedSupplier: any = null;

  public isDeleteModalOpen = false;
  public supplierToDelete: any = null;

  public toast = {
    show: false,
    message: '',
    typeClass: 'bg-success',
  };

  constructor(
    private _supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private _auth: AuthService,
  ) {
    this.currentUser = this._auth.currentUser;
  }

  public search: string = '';
  public currentUser;

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
    this.getSuppliers();
  }

  getSuppliers() {
    this._supplierService.getSuppliers().subscribe({
      next: (response: any) => {
        this.suppliers = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERROR AL OBTENER PROVEEDORES:', err);

        let errorMessage = 'Error al obtener proveedores';

        if (err?.error?.error) {
          errorMessage += `: ${err.error.error}`;
        } else if (err?.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err?.message) {
          errorMessage += `: ${err.message}`;
        }

        console.error('Status:', err?.status);
        console.error('Error del servidor:', err?.error);
        console.error('Mensaje:', err?.message);

        this.showToast(errorMessage, 'danger');
      },
    });
  }

  createSupplier(supplier: any) {
    this._supplierService.createSupplier(supplier).subscribe({
      next: (response: any) => {
        this.getSuppliers();
        this.closeModal();
        this.showToast('Proveedor creado correctamente', 'success');
      },
      error: (err) => {
        console.error('ERROR AL CREAR PROVEEDOR:', err);

        let errorMessage = 'Error al crear proveedor';

        if (err?.error?.error) {
          errorMessage += `: ${err.error.error}`;
        } else if (err?.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err?.message) {
          errorMessage += `: ${err.message}`;
        }

        console.error('Status:', err?.status);
        console.error('Error del servidor:', err?.error);
        console.error('Mensaje:', err?.message);

        this.showToast(errorMessage, 'danger');
      },
    });
  }

  updateSupplier(supplier: any) {
    this._supplierService.updateSupplier(supplier).subscribe({
      next: (response: any) => {
        this.getSuppliers();
        this.closeModal();
        this.showToast('Proveedor actualizado correctamente', 'warning');
      },
      error: (err) => {
        console.error('ERROR AL ACTUALIZAR PROVEEDOR:', err);

        let errorMessage = 'Error al actualizar proveedor';

        if (err?.error?.error) {
          errorMessage += `: ${err.error.error}`;
        } else if (err?.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err?.message) {
          errorMessage += `: ${err.message}`;
        }

        console.error('Status:', err?.status);
        console.error('Error del servidor:', err?.error);
        console.error('Mensaje:', err?.message);

        this.showToast(errorMessage, 'danger');
      },
    });
  }

  confirmDelete(supplier_id: number) {
    this._supplierService.deleteSupplier(supplier_id).subscribe({
      next: (response: any) => {
        this.getSuppliers();
        this.closeModal();
        this.showToast('Proveedor eliminado correctamente', 'danger');
      },
      error: (err) => {
        console.error('ERROR AL ELIMINAR PROVEEDOR:', err);

        let errorMessage = 'Error al eliminar proveedor';

        if (err?.error?.error) {
          errorMessage += `: ${err.error.error}`;
        } else if (err?.error?.message) {
          errorMessage += `: ${err.error.message}`;
        } else if (err?.message) {
          errorMessage += `: ${err.message}`;
        }

        console.error('Status:', err?.status);
        console.error('Error del servidor:', err?.error);
        console.error('Mensaje:', err?.message);

        this.showToast(errorMessage, 'danger');
      },
    });

    this.closeDeleteModal();
  }

  openModal(supplier: any) {
    this.selectedSupplier = supplier
      ? {
          ...supplier,
          contact_name: supplier.contact_name || null,
          contact_phone: supplier.contact_phone || null,
          contact_email: supplier.contact_email || null,
        }
      : {
          supplier_id: null,
          company_name: '',
          company_phone: null,
          company_email: null,
          contact_name: '',
          contact_phone: null,
          contact_email: null,
        };

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSupplier = null;
  }

  openDeleteModal(supplier: any) {
    this.supplierToDelete = supplier;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.supplierToDelete = null;
  }
}

