import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor() {
    const saved = localStorage.getItem('skillswapConnections');

    if (saved) {
      this.connections = JSON.parse(saved);
    }

    this.loadConnections();
  }

  connect(person: any) {

    person.connected = true;

    if (!this.connections.includes(person.name)) {

      this.connections.push(person.name);

      localStorage.setItem(
        'skillswapConnections',
        JSON.stringify(this.connections)
      );

    }
  }

  loadConnections() {

    this.people.forEach(person => {

      if (this.connections.includes(person.name)) {
        person.connected = true;
      }

    });

  }

  removeConnection(name: string) {

    this.connections = this.connections.filter(
      connection => connection !== name
    );

    localStorage.setItem(
      'skillswapConnections',
      JSON.stringify(this.connections)
    );

    const person = this.people.find(
      person => person.name === name
    );

    if (person) {
      person.connected = false;
    }

  }

  get filteredPeople() {

    const search = this.searchText
      .toLowerCase()
      .trim();

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
