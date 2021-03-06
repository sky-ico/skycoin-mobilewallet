import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { NativeStorage } from '@ionic-native/native-storage';
import { Platform } from 'ionic-angular';

@Injectable()
export class StorageApiProvider {

  constructor(
    private platform: Platform,
    private storage: NativeStorage,
  ) {}

  all(table: string) {
    return this.get(table);
  }

  create(table: string, object: any) {
    return this.get(table).flatMap(collection => {
      let col = collection ? collection : [];
      col.push(object);
      return this.set(table, col).map(() => object);
    });
  }

  deleteWallet(wallet: any) {
    console.log('deleting...');
    return this.get('wallets').flatMap(collection => {
      let col = collection ? collection.filter(o => o.seed !== wallet.seed) : [];
      console.log('col', col);
      return this.set('wallets', col);
    });
  }

  // updateWallet(wallet: any) {
  //   return this.get('wallets').flatMap(collection => {
  //     const index = collection.findIndex(record => record.seed === wallet.seed);
  //     collection[index] = wallet;
  //     return this.set('wallets', collection);
  //   });
  // }

  get(key: string) {
    return Observable.fromPromise(this.platform.ready()).flatMap(() => Observable.fromPromise(this.storage.getItem(key)))
      .catch(error => Observable.of([]));
  }

  set(key: string, value: any) {
    return Observable.fromPromise(this.storage.setItem(key, value));
  }
}
