import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { Inject, Injectable } from '@angular/core';
@Injectable()
export class LocalStorageService {

    constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }

    data: any = [];

    saveInLocal(key, val): void {
        this.storage.set(key, val);
        this.data[key] = this.storage.get(key);
    }

    getFromLocal(key): string {
        this.data[key] = this.storage.get(key);
        console.log("key", key);
        console.log(" this.data",  this.data);
        return this.data[key];
    }

    removeFromLocal(key): string {
        this.data[key] = this.storage.remove(key);
        return this.data[key];
    }
}