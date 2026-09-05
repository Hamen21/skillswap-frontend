import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  user = {
    email: '',
    password: ''
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login() {

    this.apiService.login(this.user).subscribe({

      next: (response: any) => {

        console.log('Login successful:', response);

        localStorage.setItem(
          'currentUser',
          JSON.stringify(response.user)
        );

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error('Login failed:', error);

        alert(
          error.error?.message ||
          'Invalid email or password'
        );

      }

    });

  }
}