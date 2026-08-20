import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  constructor(private router: Router) {}
  

  user = {
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  };
  continueToEducation() {
  console.log(this.user);
  this.router.navigate(['/education']);
}
}

