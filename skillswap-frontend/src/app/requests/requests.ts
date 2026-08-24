import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkillSwapService } from '../services/skill-swap';

@Component({
  selector: 'app-requests',
  imports: [CommonModule, RouterLink],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests {

  requests: any[] = [];

  filter = 'all';

  constructor(
    private skillSwapService: SkillSwapService
  ) {
    this.loadRequests();
  }

  loadRequests() {

    this.requests =
      this.skillSwapService.getRequests();

  }

  acceptRequest(request: any) {

    request.status = 'accepted';

    this.skillSwapService.updateRequestStatus(
      request.name,
      'accepted'
    );

    this.skillSwapService.addConnection(
      request.name
    );

  }

  rejectRequest(request: any) {

    request.status = 'rejected';

    this.skillSwapService.updateRequestStatus(
      request.name,
      'rejected'
    );

  }

  get filteredRequests() {

    if (this.filter === 'all') {
      return this.requests;
    }

    return this.requests.filter(
      request => request.status === this.filter
    );

  }

}