import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-education',
  imports: [FormsModule, RouterLink],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {

  education = {
    college: '',
    degree: '',
    year: '',
    specialization: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  continueToSkills() {

    const currentUser =
      JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.id) {
      alert('Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.updateEducation(
      currentUser.id,
      this.education
    ).subscribe({

      next: (response) => {

        console.log(
          'Education saved successfully:',
          response
        );

        this.router.navigate(['/skills']);

      },

      error: (error) => {

        console.error(
          'Education save failed:',
          error
        );

        alert(
          error.error?.message ||
          'Failed to save education'
        );

      }

    });
  }
}