import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  editing = false;

name = 'Hamen Bhandari';

bio = 'Computer Science student interested in learning and sharing technical skills.';
education = 'B.Tech in Computer Science';
teachSkills = ['Java', 'Python', 'HTML'];
learnSkills = ['Angular', 'UI/UX'];
newTeachSkill = '';
newLearnSkill = '';

 


  toggleEdit() {
    this.editing = !this.editing;
  }
  addTeachSkill() {
  const skill = this.newTeachSkill.trim();

  if (skill && !this.teachSkills.includes(skill)) {
    this.teachSkills.push(skill);
    this.newTeachSkill = '';
  }
}

addLearnSkill() {
  const skill = this.newLearnSkill.trim();

  if (skill && !this.learnSkills.includes(skill)) {
    this.learnSkills.push(skill);
    this.newLearnSkill = '';
  }
}

}
