import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
}
