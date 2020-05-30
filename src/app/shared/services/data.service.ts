import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoaderService } from '../core/loader/loader.service';

import { ToastaConfig, ToastaService, ToastOptions } from 'ngx-toasta';
import { BehaviorSubject } from 'rxjs';

declare var CryptoJS: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public USER_KEY = environment.userKey;
  public MASTER_KEY = environment.masterKey;
  MODAL_TYPE = {
    create: 'CREATE',
    pending: 'PENDING'
  }

  public gameState = new BehaviorSubject<any>("");
  gameState$ = this.gameState.asObservable();

  constructor(public toastaService: ToastaService, public toastaConfig: ToastaConfig, public loader: LoaderService) { }

  initToastaStyle() {
    this.toastaConfig.theme = 'material';
    this.toastaConfig.position = 'top-right';
  }

  isNull(param) {
    return !this.isNotNull(param);
  }

  isNotNull(param) {
    return param !== undefined && param !== null && param !== "";
  }

  isNotEmpty(obj) {
    return !this.isEmpty(obj);
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  getCurrentUser(): CurrentUser {
    return this.isNotNull(JSON.parse(localStorage.getItem(this.USER_KEY))) ? JSON.parse(localStorage.getItem(this.USER_KEY)) : {};
  }

  setCurrentUser(pCurentUser: CurrentUser) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(pCurentUser));
  }

  encrypt(param) {
    let vParam = this.isNotNull(param) ? param.toString() : ""
    return CryptoJS.AES.encrypt(vParam, this.MASTER_KEY).toString();
  }

  decrypt(param) {
    let vParam = this.isNotNull(param) ? param.toString() : ""
    return CryptoJS.AES.decrypt(vParam, this.MASTER_KEY).toString(CryptoJS.enc.Utf8)
  }

  vibrate() {
    if (this.isNotNull(window.navigator.vibrate) && window.navigator.vibrate(100)) {
      setTimeout(() => {
        window.navigator.vibrate([200, 30, 100, 30]);
      }, 10);
    }
  }

  showError(message?: string, ptitle?: string) {
    this.vibrate()
    let toastOptions: ToastOptions = {
      title: this.isNotNull(ptitle) ? ptitle : "Error",
      msg: message,
      showClose: true,
      timeout: 3500,
    };
    this.toastaService.error(toastOptions);
  }

  showSuccess(message: string, ptitle?: string) {
    let toastOptions: ToastOptions = {
      title: this.isNotNull(ptitle) ? ptitle : "Success",
      msg: message,
      showClose: true,
      timeout: 2500,
    };
    this.toastaService.success(toastOptions);
  }

  showWarning(message: string, ptitle?: string) {
    let toastOptions: ToastOptions = {
      title: this.isNotNull(ptitle) ? ptitle : "Warning",
      msg: message,
      showClose: true,
      timeout: 4500,
    };
    this.toastaService.warning(toastOptions);
  }

  showLoader() {
    this.loader.show()
  }

  hideLoader() {
    setTimeout(() => {
      this.loader.hide()
    }, 30);
  }

  updatesGameState(param) {
    this.gameState.next(param);
  }

  afterRouteSwitch() {
    setTimeout(() => {
      $('#myCarousel').carousel({
        interval: 2000,
        cycle: true
      });
    }, 10);
  }

  formatTime(pDate) {
    const date = new Date(Number(pDate))
    return [date.getHours(), date.getMinutes()].join(':')
  }

}
export interface CurrentUser {
  id: string;
  name: string;
  gameAdmin: string;
}
