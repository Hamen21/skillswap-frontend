import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkillSwapService } from '../services/skill-swap';

@Component({
  selector: 'app-connections',
  imports: [CommonModule, RouterLink],
  templateUrl: './connections.html',
  styleUrl: './connections.css'
})
export class Connections {

  connections: string[] = [];

  constructor(
    private skillSwapService: SkillSwapService
  ) {
    this.loadConnections();
  }

  loadConnections() {

    this.connections =
      this.skillSwapService.getConnections();

  }

  removeConnection(name: string) {

    const confirmed = confirm(
      `Are you sure you want to remove ${name} from your connections?`
    );

    if (!confirmed) {
      return;
    }

    this.skillSwapService.removeConnection(name);

    this.loadConnections();

  }

}