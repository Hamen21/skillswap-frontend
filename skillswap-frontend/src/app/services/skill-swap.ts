import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillSwapService {

  private connectionsKey = 'skillswapConnections';
  private requestsKey = 'skillswapRequests';

  constructor() {}

  getConnections(): string[] {

    const saved =
      localStorage.getItem(this.connectionsKey);

    return saved ? JSON.parse(saved) : [];

  }

  addConnection(name: string): void {

    const connections = this.getConnections();

    if (!connections.includes(name)) {

      connections.push(name);

      localStorage.setItem(
        this.connectionsKey,
        JSON.stringify(connections)
      );

    }

  }

  removeConnection(name: string): void {

    const connections =
      this.getConnections().filter(
        connection => connection !== name
      );

    localStorage.setItem(
      this.connectionsKey,
      JSON.stringify(connections)
    );

  }

  getRequests(): any[] {

    const saved =
      localStorage.getItem(this.requestsKey);

    return saved ? JSON.parse(saved) : [];

  }

  addRequest(request: any): void {

  const requests = this.getRequests();

  const existingRequest = requests.find(
    existing => existing.name === request.name
  );

  if (existingRequest) {

    existingRequest.status = request.status;
    existingRequest.skill = request.skill;

  } else {

    requests.push(request);

  }

  localStorage.setItem(
    this.requestsKey,
    JSON.stringify(requests)
  );

}

  updateRequestStatus(
    name: string,
    status: string
  ): void {

    const requests = this.getRequests();

    const request = requests.find(
      request => request.name === name
    );

    if (request) {

      request.status = status;

      localStorage.setItem(
        this.requestsKey,
        JSON.stringify(requests)
      );

    }

  }

  getPendingRequestCount(): number {

    return this.getRequests().filter(
      request => request.status === 'pending'
    ).length;

  }

}