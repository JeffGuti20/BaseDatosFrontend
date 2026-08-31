import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplyService } from '../../services/supplies.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { enviroment } from '../../enviroments';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-supplies',
  imports: [CommonModule, FormsModule],
  templateUrl: './supplies.html',
  styleUrl: './supplies.css',
})
export class Supplies {
  public supplies: any[] = [];
  public categories: any[] = [];
  public apiURL: any;
  public imageUrls: { [filename: string]: string } = {};

  public isModalOpen = false;
  public selectedSupply: any = null;
  public selectedFile: File | null = null;
  public imageTouched = false;

  public isDeleteModalOpen = false;
  public supplyToDelete: any = null;

  public isDetailsModalOpen = false;
  public supplyDetails: any = null;

  public toast = {
    show: false,
    message: '',
    typeClass: 'bg-success',
  };

  constructor(
    private _supplyService: SupplyService,
    private cdr: ChangeDetectorRef,
    private _auth: AuthService
  ) {
    this.apiURL = enviroment.apiUrl;
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
    this.getCategories();
    this.getSupplies();
  
  }

  getCategories() {
    this._supplyService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
      },
    });
  }

  getSupplies() {
    this._supplyService.getSupplies().subscribe({
      next: (response: any) => {
        this.supplies = response;
        console.log(this.supplies);
        this.supplies.forEach((supply) => {
          this.downloadImage(supply.image);
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
      },
    });
  }

  saveSupply() {
    const isEdit = !!this.selectedSupply?.supply_id;

    if (!isEdit && !this.selectedFile) {
      this.showToast('Debes seleccionar una imagen', 'danger');
      return;
    }

    if (isEdit && this.selectedFile == null) {
      const payload = {
        ...this.selectedSupply,
      };

      this.updateSupply(payload);
      return;
    }
    if (this.selectedFile) {
      this._supplyService.uploadImage(this.selectedFile).subscribe({
        next: (res: any) => {
          const filename = res.filename;

          const payload = {
            ...this.selectedSupply,
            image: filename,
          };

          if (this.selectedSupply.supply_id) {
            this.updateSupply(payload);
            this.deleteImage(this.selectedSupply.image);
          } else {
            this.createSupply(payload);
          }
        },
        error: (err) => {
          this.showToast('Error al subir imagen', 'danger');
        },
      });
    }
  }

  createSupply(supply: any) {
    this._supplyService.createSupply(supply).subscribe({
      next: (response: any) => {
        this.getSupplies();
        this.closeModal();
        this.showToast('Insumo creado correctamente', 'success');
      },
      error: (err) => {
        console.log('ERROR COMPLETO:', err);
      console.log('STATUS:', err.status);
      console.log('ERROR DEL BACKEND:', err.error);

      this.showToast(
        err.error?.error || 'Error al crear insumo',
        'danger');
      },
    });
  }

  updateSupply(supply: any) {
    this._supplyService.updateSupply(supply).subscribe({
      next: (response: any) => {
        this.getSupplies();
        this.closeModal();
        this.showToast('Insumo actualizado correctamente', 'warning');
      },
      error: (err) => {
        this.showToast('Error al actualizar insumo', 'danger');
      },
    });
  }

  downloadImage(filename: string) {
    this._supplyService.downloadImage(filename).subscribe({
      next: (blob: Blob) => {
        this.imageUrls[filename] = URL.createObjectURL(blob);
        this.cdr.detectChanges();
      },
      error: (err) => {
      },
    });
  }

  deleteImage(filename: string) {
    this._supplyService.deleteImage(filename).subscribe({
      next: (response: any) => {
        this.getSupplies();
      },
      error: (err) => {
      },
    });
  }

  confirmDelete(supply_id: number, filename: string) {
    this.deleteImage(filename);
    this._supplyService.deleteSupply(supply_id).subscribe({
      next: (response: any) => {
        this.getSupplies();
        this.closeModal();
        this.showToast('Insumo eliminado correctamente', 'danger');
      },
      error: (err) => {
        this.showToast('Error al eliminar insumo', 'danger');
      },
    });

    this.closeDeleteModal();
  }
  openModal(supply: any) {
    this.selectedSupply = supply
      ? { ...supply, category_id: supply.category?.category_id }
      : {
          supply_id: null,
          name: '',
          type: null,
          stock: '',
          image: '',
          price: null,
          category_id: null,
        };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSupply = null;
    this.imageTouched = false;
    this.selectedFile = null;
  }

  openDeleteModal(supply: any) {
    this.supplyToDelete = supply;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.supplyToDelete = null;
  }

  openDetailsModal(supply: any) {
    this.supplyDetails = supply;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.supplyDetails = null;
  }

  onFileSelected(event: any) {
    this.imageTouched = true;
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imageTouched = false;
    }
  }
}
