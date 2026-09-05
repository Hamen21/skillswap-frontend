import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterLink],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {

  requests: any[] = [];

  filter = 'all';

  constructor(
    private apiService: ApiService
  ) {
    this.loadRequests();
  }

  // LOAD REQUESTS FROM MONGODB
  loadRequests() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {

      alert('Please login again.');

      return;

    }

    this.apiService
      .getReceivedRequests(currentUser.id)
      .subscribe({

        next: (requests: any) => {

          this.requests =
            requests.map(
              (request: any) => ({

                id: request._id,

                name:
                  request.sender?.name ||
                  'Unknown User',

                email:
                  request.sender?.email ||
                  '',

                skill:
                  request.skill ||
                  'Unknown Skill',

                status:
                  request.status

              })
            );

        },

        error: (error) => {

          console.error(
            'Failed to load requests:',
            error
          );

        }

      });

  }

  // ACCEPT REQUEST
  acceptRequest(request: any) {

    this.apiService
      .acceptConnectionRequest(request.id)
      .subscribe({

        next: () => {

          request.status = 'accepted';

          alert(
            `You are now connected with ${request.name}!`
          );

          // Refresh requests from MongoDB
          this.loadRequests();

        },

        error: (error) => {

          console.error(
            'Failed to accept request:',
            error
          );

          alert(
            error.error?.message ||
            'Failed to accept request'
          );

        }

      });

  }

  // REJECT REQUEST
  rejectRequest(request: any) {

    this.apiService
      .rejectConnectionRequest(request.id)
      .subscribe({

        next: () => {

          request.status = 'rejected';

          alert(
            `Connection request from ${request.name} rejected.`
          );

          // Refresh requests from MongoDB
          this.loadRequests();

        },

        error: (error) => {

          console.error(
            'Failed to reject request:',
            error
          );

          alert(
            error.error?.message ||
            'Failed to reject request'
          );

        }

      });

  }

  // FILTER REQUESTS
  get filteredRequests() {

    if (this.filter === 'all') {

      return this.requests;

    }

    return this.requests.filter(
      request =>
        request.status === this.filter
    );

  }

}