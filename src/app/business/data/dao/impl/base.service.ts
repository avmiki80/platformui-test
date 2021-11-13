import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected readonly url: string;
  constructor(
    url: string,
    protected httpClient: HttpClient
  ) {
    this.url = url;
  }
}
