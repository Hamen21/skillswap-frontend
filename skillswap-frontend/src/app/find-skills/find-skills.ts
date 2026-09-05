import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-find-skills',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './find-skills.html',
  styleUrl: './find-skills.css'
})
export class FindSkills {

  searchText = '';

  people: any[] = [];

  filteredPeople: any[] = [];

  constructor(
    private apiService: ApiService
  ) {
    this.loadPeople();
  }

  // LOAD ALL USERS
  loadPeople() {

    this.apiService
      .getUsers()
      .subscribe({

        next: (users: any) => {

          const currentUser =
            JSON.parse(
              localStorage.getItem('currentUser') || '{}'
            );

          this.people = users

            // Don't show the logged-in user
            .filter(
              (user: any) =>
                user._id !== currentUser.id
            )

            .map(
              (user: any) => ({

                id: user._id,

                name: user.name,

                skills:
                  user.teachSkills || [],

                teaches:
                  user.teachSkills?.[0] ||
                  'No skill added',

                connected: false,

                requestSent: false

              })
            );

          // Show everyone initially
          this.filteredPeople =
            [...this.people];

          // Check existing connections
          this.loadConnections();

          // Check pending sent requests
          this.loadSentRequests();

        },

        error: (error) => {

          console.error(
            'Failed to load users:',
            error
          );

        }

      });

  }


  // LOAD ACCEPTED CONNECTIONS
  loadConnections() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {
      return;
    }

    this.apiService
      .getConnections(currentUser.id)
      .subscribe({

        next: (connections: any) => {

          this.people.forEach(
            (person: any) => {

              const isConnected =
                connections.some(
                  (connection: any) =>
                    connection._id === person.id
                );

              person.connected =
                isConnected;

            }
          );

          this.filterPeople();

        },

        error: (error) => {

          console.error(
            'Failed to load connections:',
            error
          );

        }

      });

  }


  // LOAD SENT REQUESTS
  loadSentRequests() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {
      return;
    }

    this.apiService
      .getSentRequests(currentUser.id)
      .subscribe({

        next: (requests: any) => {

          requests.forEach(
            (request: any) => {

              // Only mark pending requests
              if (
                request.status === 'pending'
              ) {

                const person =
                  this.people.find(
                    (p: any) =>
                      p.id ===
                      request.receiver?._id
                  );

                if (person) {

                  person.requestSent =
                    true;

                }

              }

            }
          );

          this.filterPeople();

        },

        error: (error) => {

          console.error(
            'Failed to load sent requests:',
            error
          );

        }

      });

  }


  // SEARCH PEOPLE BY SKILL
  filterPeople() {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    // If search is empty,
    // show everyone
    if (!search) {

      this.filteredPeople =
        [...this.people];

      return;

    }

    // Search through teaching skills
    this.filteredPeople =
      this.people.filter(
        (person: any) =>

          person.skills.some(
            (skill: string) =>

              skill
                .toLowerCase()
                .includes(search)

          )

      );

  }


  // SEND CONNECTION REQUEST
  connect(person: any) {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {

      alert(
        'Please login again.'
      );

      return;

    }

    // Don't send another request
    if (
      person.connected ||
      person.requestSent
    ) {

      return;

    }

    this.apiService

      .sendConnectionRequest(
        currentUser.id,
        person.id,
        person.teaches
      )

      .subscribe({

        next: (response: any) => {

          console.log(
            'Connection request sent:',
            response
          );

          // Change button immediately
          person.requestSent =
            true;

          alert(
            `Connection request sent to ${person.name}!`
          );

        },

        error: (error) => {

          console.error(
            'Failed to send connection request:',
            error
          );

          alert(
            error.error?.message ||
            'Failed to send connection request'
          );

        }

      });

  }

}