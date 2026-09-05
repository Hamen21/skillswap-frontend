import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {

    this.socket = io(
      'http://localhost:5000'
    );


    // ==========================================
    // SOCKET CONNECTED
    // ==========================================

    this.socket.on(
      'connect',
      () => {

        console.log(
          'Socket connected:',
          this.socket.id
        );

      }
    );


    // ==========================================
    // SOCKET DISCONNECTED
    // ==========================================

    this.socket.on(
      'disconnect',
      () => {

        console.log(
          'Socket disconnected'
        );

      }
    );

  }


  // ==========================================
  // JOIN USER ROOM
  // ==========================================

  joinRoom(
    userId: string
  ) {

    console.log(
      'Joining Socket room:',
      userId
    );

    this.socket.emit(
      'join',
      userId
    );

  }


  // ==========================================
  // SEND REAL-TIME MESSAGE
  // ==========================================

  sendMessage(
    message: any
  ) {

    console.log(
      'Sending Socket message:',
      message
    );

    this.socket.emit(
      'sendMessage',
      message
    );

  }


  // ==========================================
  // RECEIVE NEW MESSAGE
  // ==========================================

  onNewMessage(
    callback: (message: any) => void
  ) {

    this.socket.on(
      'newMessage',
      callback
    );

  }


  // ==========================================
  // REMOVE LISTENER
  // ==========================================

  removeNewMessageListener() {

    this.socket.off(
      'newMessage'
    );

  }

}