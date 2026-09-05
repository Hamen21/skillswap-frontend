import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-connections',
  imports: [CommonModule, RouterLink],
  templateUrl: './connections.html',
  styleUrl: './connections.css'
})
export class Connections {

  connections: any[] = [];

  constructor(
    private apiService: ApiService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.loadConnections();
  }

  loadConnections() {

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {

      alert('Please login again.');

      return;

    }

    this.apiService
      .getConnections(currentUser.id)
      .subscribe({

        next: (connections: any) => {

         

          this.connections = connections;


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


  removeConnection(connection: any) {

    const confirmed =
      confirm(
        `Are you sure you want to remove ${connection.name} from your connections?`
      );

    if (!confirmed) {
      return;
    }

    const currentUser =
      JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );

    if (!currentUser.id) {

      alert('Please login again.');

      return;

    }

    this.apiService
      .removeConnection(
        currentUser.id,
        connection._id
      )
      .subscribe({

        next: () => {

          alert(
            'Connection removed successfully.'
          );

          this.loadConnections();

        },

        error: (error) => {

          console.error(
            'Failed to remove connection:',
            error
          );

          alert(
            error.error?.message ||
            'Failed to remove connection'
          );

        }

      });

  }

}