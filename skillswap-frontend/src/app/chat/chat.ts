import {
  Component,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnDestroy {

  userId = '';

  connectionId = '';

  connectionName = '';

  messages: any[] = [];

  newMessage = '';

  loading = true;


  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {

    this.loadChat();

  }


  // ==========================================
  // LOAD CHAT
  // ==========================================

  loadChat() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );


    if (!currentUser.id) {

      alert(
        'Please login again.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.userId =
      currentUser.id;


    // Join the logged-in user's Socket.IO room
    this.socketService.joinRoom(
      this.userId
    );


    // Listen for real-time messages
    this.listenForMessages();


    this.route.paramMap.subscribe(
      params => {

        const connectionId =
          params.get('connectionId');


        if (!connectionId) {

          alert(
            'Connection not found.'
          );

          this.router.navigate([
            '/connections'
          ]);

          return;

        }


        this.connectionId =
          connectionId;


        this.loadConnection();

        this.loadMessages();

      }
    );

  }


  // ==========================================
  // LOAD CONNECTION USER
  // ==========================================

  loadConnection() {

    this.apiService
      .getUser(this.connectionId)
      .subscribe({

        next: (user: any) => {

          this.connectionName =
            user.name || 'User';

          this.changeDetector.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load connection:',
            error
          );

          this.connectionName =
            'User';

        }

      });

  }


  // ==========================================
  // LOAD OLD MESSAGES
  // ==========================================

  loadMessages() {

    this.loading = true;


    this.apiService
      .getConversation(
        this.userId,
        this.connectionId
      )
      .subscribe({

        next: (messages: any) => {

          this.messages =
            messages;

          this.loading =
            false;

          this.changeDetector.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load messages:',
            error
          );

          this.loading =
            false;


          if (
            error.status === 403
          ) {

            alert(
              'You can only chat with connected users.'
            );

            this.router.navigate([
              '/connections'
            ]);

          }

        }

      });

  }


  // ==========================================
  // LISTEN FOR REAL-TIME MESSAGES
  // ==========================================

  listenForMessages() {

    this.socketService
      .onNewMessage(
        (message: any) => {

          /*
           * Only add the message if it belongs
           * to the current conversation.
           */

          const isCurrentConversation =
            (
              message.sender?._id ===
              this.connectionId &&
              message.receiver?._id ===
              this.userId
            )
            ||
            (
              message.sender?._id ===
              this.userId &&
              message.receiver?._id ===
              this.connectionId
            );


          if (
            isCurrentConversation
          ) {

            // Prevent duplicate messages
            const alreadyExists =
              this.messages.some(
                existing =>
                  existing._id ===
                  message._id
              );


            if (!alreadyExists) {

              this.messages.push(
                message
              );

            }


            this.changeDetector.detectChanges();

          }

        }
      );

  }


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  sendMessage() {

    const text =
      this.newMessage.trim();


    // Don't send empty messages
    if (!text) {

      return;

    }


    this.apiService
      .sendMessage(
        this.userId,
        this.connectionId,
        text
      )
      .subscribe({

        next: (response: any) => {

          const message =
            response.data;


          // Add message to sender's chat
          if (message) {

            const alreadyExists =
              this.messages.some(
                existing =>
                  existing._id ===
                  message._id
              );


            if (!alreadyExists) {

              this.messages.push(
                message
              );

            }


            /*
             * Send the saved message
             * through Socket.IO.
             */

            this.socketService
              .sendMessage(
                message
              );

          }


          // Clear input
          this.newMessage =
            '';


          this.changeDetector.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to send message:',
            error
          );


          alert(
            error.error?.message ||
            'Failed to send message'
          );

        }

      });

  }


  // ==========================================
  // ENTER KEY
  // ==========================================

  handleEnter(
    event: KeyboardEvent
  ) {

    if (
      event.key === 'Enter'
    ) {

      event.preventDefault();

      this.sendMessage();

    }

  }


  // ==========================================
  // CHECK MESSAGE OWNER
  // ==========================================

  isMyMessage(
    message: any
  ) {

    return (
      message.sender?._id ===
      this.userId
    );

  }


  // ==========================================
  // CLEANUP SOCKET LISTENER
  // ==========================================

  ngOnDestroy() {

    this.socketService
      .removeNewMessageListener();

  }

}