import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ExampleService {

  constructor(private http: HttpClient) { }

  public getExampleJson(fileName): Observable<any> {
    return this.http.get<any>('assets/json/' + fileName + '.json');
      
  }
}