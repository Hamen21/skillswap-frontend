import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkillSwapService } from '../services/skill-swap';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  pendingRequests = 0;
connectionCount = 0;
  

  constructor(
    private skillSwapService: SkillSwapService
  ) {
    this.loadPendingRequests();
  }

  loadPendingRequests() {

  this.pendingRequests =
    this.skillSwapService.getPendingRequestCount();

  this.connectionCount =
    this.skillSwapService.getConnections().length;

}
}