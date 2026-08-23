import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-find-skills',
 imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './find-skills.html',
  styleUrl: './find-skills.css',
})
export class FindSkills {
  searchText = '';

  people = [
  {
    name: 'Rahul',
    skills: ['Java', 'Python'],
    teaches: 'Java',
    connected: false
  },
  {
    name: 'Priya',
    skills: ['UI/UX', 'Figma'],
    teaches: 'UI/UX Design',
    connected: false
  },
  {
    name: 'Arjun',
    skills: ['Angular', 'JavaScript'],
    teaches: 'Angular',
    connected: false
  }
];
connect(person: any) {
  person.connected = true;
}
get filteredPeople() {
  const search = this.searchText.toLowerCase().trim();

  if (!search) {
    return this.people;
  }

  return this.people.filter(person =>
    person.skills.some(skill =>
      skill.toLowerCase().includes(search)
    )
  );
}

}
