import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  user = {
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    password: ''
  };

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  continueToEducation() {

    this.apiService.register(this.user).subscribe({

      next: (response: any) => {

        console.log(
          'Registration successful:',
          response
        );

        // Save the newly registered user
        const user = response.user;

        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: user._id,
            name: user.name,
            email: user.email
          })
        );

        // Go to education
        this.router.navigate(['/education']);

      },

      error: (error) => {

        console.error(
          'Registration failed:',
          error
        );

        alert(
          error.error?.message ||
          'Registration failed. Please try again.'
        );

      }

    });

  }
}