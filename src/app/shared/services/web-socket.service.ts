import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  readonly uri: string = environment.uri
  constructor() { }

  connecting() {
    this.socket = io(this.uri)
  }

  listen(eventName: string) {
    return new Observable(susbcriber => {
      this.socket.on(eventName, (data) => {
        susbcriber.next(data)
      })
    })
  }

  emit(eventName: string, data) {
    this.socket.emit(eventName, data)
  }

  joinRoom(data) {
    this.emit('join', data);
  }

  startGame(data) {
    this.emit('startGame', data);
  }

  gameStarted() {
    return this.listen('gameOn');
  }

  newUserJoined() {
    return this.listen('new user joined');
  }

  leaveRoom(data) {
    this.emit('leave', data);
  }

  userLeftRoom() {
    return this.listen('left room');
  }

  sendMessage(data) {
    this.emit('message', data);
  }

  newMessageReceived() {
    return this.listen('new message');
  }

}
