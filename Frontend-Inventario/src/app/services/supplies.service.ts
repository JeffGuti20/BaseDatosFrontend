import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplies } from '../models/supplies';

@Injectable({ providedIn: 'root' })
export class SupplyService {
  private url: string;
  private headers: any;
  private headersImage: any;
  private token: any;
  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl;
    this.token = sessionStorage.getItem('token');
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.token}`);

    this.headersImage = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  getCategories(): Observable<any> {
    return this._http.get(this.url + 'categories', { headers: this.headers });
  }

  createSupply(supply: Supplies): Observable<any> {
    let data = JSON.stringify(supply);
    return this._http.post(this.url + 'supplies', data, { headers: this.headers });
  }

  getSupplies(): Observable<any> {
    return this._http.get(this.url + 'supplies', { headers: this.headers });
  }

  updateSupply(supply: Supplies) {
    return this._http.put(this.url + 'supplies', supply, { headers: this.headers });
  }

  deleteSupply(supply_id: number) {
    return this._http.delete(this.url + 'supplies/' + supply_id, { headers: this.headers });
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file0', file, file.name);

    return this._http.post(this.url + 'supplies/upload_image', formData, {
      headers: this.headersImage,
    });
  }

  downloadImage(filename: string): Observable<any> {
    return this._http.get(this.url + 'supplies/download_image/' + filename, {
      headers: this.headersImage,
      responseType: 'blob',
    });
  }

  deleteImage(filename: string): Observable<any> {
    return this._http.delete(this.url + 'supplies/delete_image/' + filename, {
      headers: this.headersImage,
      responseType: 'blob',
    });
  }
}
