import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  pendingRequests = 0;

  connectionCount = 0;

  name = '';

  bio = '';

  teachSkills: string[] = [];

  learnSkills: string[] = [];


  constructor(
    private apiService: ApiService,

    private router: Router,

    private changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit() {

    this.loadUserProfile();

    this.loadPendingRequests();

  }


  // LOAD USER PROFILE
  loadUserProfile() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );


    if (!currentUser.id) {

      this.router.navigate(['/login']);

      return;

    }


    // Show name immediately
    this.name =
      currentUser.name || '';


    // Get complete profile from MongoDB
    this.apiService
      .getUser(currentUser.id)
      .subscribe({

        next: (user: any) => {

          


          this.name =
            user.name || currentUser.name || '';


          this.bio =
            user.bio || '';


          this.teachSkills =
            user.teachSkills || [];


          this.learnSkills =
            user.learnSkills || [];


          // Force the page to update
          this.changeDetector.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load dashboard profile:',
            error
          );

        }

      });

  }


  // LOAD REQUESTS AND CONNECTIONS
  loadPendingRequests() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );


    if (!currentUser.id) {

      return;

    }


    // Pending requests
    this.apiService
      .getReceivedRequests(currentUser.id)
      .subscribe({

        next: (requests: any) => {

          this.pendingRequests =
            requests.filter(
              (request: any) =>
                request.status === 'pending'
            ).length;


          this.changeDetector.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load pending requests:',
            error
          );

        }

      });


    // Connections
    this.apiService
      .getConnections(currentUser.id)
      .subscribe({

        next: (connections: any) => {

          this.connectionCount =
            connections.length;


          this.changeDetector.detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load connections:',
            error
          );

        }

      });

  }


  // LOGOUT
  logout() {

    localStorage.removeItem(
      'currentUser'
    );

    this.router.navigate(['/login']);

  }

}