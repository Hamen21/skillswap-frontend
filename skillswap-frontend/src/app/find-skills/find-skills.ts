import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillSwapService } from '../services/skill-swap';

@Component({
  selector: 'app-find-skills',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './find-skills.html',
  styleUrl: './find-skills.css'
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

  connections: string[] = [];

  constructor(private skillSwapService: SkillSwapService) {
    this.loadConnections();
  }

 connect(person: any) {

  const requests =
    this.skillSwapService.getRequests();

  const existingRequest = requests.find(
    (request: any) => request.name === person.name
  );

  // Already accepted
  if (existingRequest?.status === 'accepted') {
    return;
  }

  // Send a new request if rejected or doesn't exist
  if (!existingRequest || existingRequest.status === 'rejected') {

    this.skillSwapService.addRequest({
      name: person.name,
      skill: person.teaches,
      status: 'pending'
    });

    person.connected = true;

  }

}

  loadConnections() {

    this.connections =
      this.skillSwapService.getConnections();

    this.people.forEach(person => {

      if (this.connections.includes(person.name)) {
        person.connected = true;
      }

    });

  }

  removeConnection(name: string) {

    this.skillSwapService.removeConnection(name);

    this.loadConnections();

  }

  get filteredPeople() {

    const search =
      this.searchText.toLowerCase().trim();

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