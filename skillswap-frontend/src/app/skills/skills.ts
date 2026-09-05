import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-skills',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {

  teachSkills: string[] = [];
  learnSkills: string[] = [];

  teachInput = '';
  learnInput = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  addTeachSkill() {
    const skill = this.teachInput.trim();

    if (skill && !this.teachSkills.includes(skill)) {
      this.teachSkills.push(skill);
      this.teachInput = '';
    }
  }

  addLearnSkill() {
    const skill = this.learnInput.trim();

    if (skill && !this.learnSkills.includes(skill)) {
      this.learnSkills.push(skill);
      this.learnInput = '';
    }
  }

  removeTeachSkill(index: number) {
    this.teachSkills.splice(index, 1);
  }

  removeLearnSkill(index: number) {
    this.learnSkills.splice(index, 1);
  }

  saveSkills() {

    const currentUser =
      JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.id) {
      alert('Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.updateSkills(
      currentUser.id,
      this.teachSkills,
      this.learnSkills
    ).subscribe({

      next: (response) => {

        console.log(
          'Skills saved successfully:',
          response
        );

        alert('Skills saved successfully!');

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error(
          'Skills save failed:',
          error
        );

        alert(
          error.error?.message ||
          'Failed to save skills'
        );

      }

    });
  }
}