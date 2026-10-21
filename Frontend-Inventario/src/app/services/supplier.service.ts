import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private url: string;
  private headers: any;
  private token: any;
  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl;
    this.token = sessionStorage.getItem('token');
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);
  }

  createSupplier(supplier: Supplier): Observable<any> {
    let data = JSON.stringify(supplier);
    return this._http.post(this.url + 'suppliers', data, { headers: this.headers });
  }
  getSuppliers(): Observable<any> {
    return this._http.get(this.url + 'suppliers', { headers: this.headers });
  }

  updateSupplier(supplier: Supplier) {
    return this._http.put(this.url + 'suppliers', supplier, { headers: this.headers });
  }

  deleteSupplier(supplier_id: number) {
    return this._http.delete(this.url + 'suppliers/' + supplier_id, { headers: this.headers });
  }
}
