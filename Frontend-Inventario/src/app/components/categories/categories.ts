import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  public categories: any[] = [];

  public isModalOpen = false;
  public selectedCategory: any = null;

  public isDeleteModalOpen = false;
  public categoryToDelete: any = null;

  public toast = {
    show: false,
    message: '',
    typeClass: 'bg-success',
  };

  constructor(
    private _categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private _auth: AuthService
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
    this.getCategories();
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
      },
    });
  }

  createCategory(category: any) {
    this._categoryService.createCategory(category).subscribe({
      next: (response: any) => {
        this.getCategories();
        this.closeModal();
        this.showToast('Categoria creada correctamente', 'success');
      },
      error: (err) => {
        this.showToast('Error al crear categoria', 'danger');
      },
    });
  }

  updateCategory(category: any) {
    this._categoryService.updateCategory(category).subscribe({
      next: (response: any) => {
        this.getCategories();
        this.closeModal();
        this.showToast('Categoria actualizada correctamente', 'warning');
      },
      error: (err) => {
        this.showToast('Error al actualizar categoria', 'danger');
      },
    });
  }

  confirmDelete(category_id: number) {
    this._categoryService.deleteCategory(category_id).subscribe({
      next: (response: any) => {
        this.getCategories();
        this.closeModal();
        this.showToast('Categoria eliminada correctamente', 'danger');
      },
      error: (err) => {
        this.showToast('Error al eliminar categoria', 'danger');
      },
    });

    this.closeDeleteModal();
  }

  openModal(category: any) {
    this.selectedCategory = category ? { ...category } : { role_id: null, name: '' };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCategory = null;
  }

  openDeleteModal(category: any) {
    this.categoryToDelete = category;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.categoryToDelete = null;
  }
}
