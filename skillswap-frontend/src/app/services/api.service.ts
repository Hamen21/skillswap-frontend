import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl =
    'http://localhost:5000/api/users';

  private connectionUrl =
    'http://localhost:5000/api/connections';

  private messageUrl =
    'http://localhost:5000/api/messages';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // USER APIs
  // ==========================================

  register(user: any) {

    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );

  }


  login(user: any) {

    return this.http.post(
      `${this.apiUrl}/login`,
      user
    );

  }


  getUsers() {

    return this.http.get(
      this.apiUrl
    );

  }


  getUser(id: string) {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  updateEducation(
    id: string,
    education: any
  ) {

    return this.http.put(
      `${this.apiUrl}/education/${id}`,
      education
    );

  }


  updateSkills(
    id: string,
    teachSkills: string[],
    learnSkills: string[]
  ) {

    return this.http.put(
      `${this.apiUrl}/skills/${id}`,
      {
        teachSkills,
        learnSkills
      }
    );

  }


  updateProfile(
    id: string,
    profile: any
  ) {

    return this.http.put(
      `${this.apiUrl}/profile/${id}`,
      profile
    );

  }


  // ==========================================
  // CONNECTION APIs
  // ==========================================

  sendConnectionRequest(
    sender: string,
    receiver: string,
    skill: string
  ) {

    return this.http.post(
      `${this.connectionUrl}/send`,
      {
        sender,
        receiver,
        skill
      }
    );

  }


  getReceivedRequests(
    userId: string
  ) {

    return this.http.get(
      `${this.connectionUrl}/received/${userId}`
    );

  }


  getSentRequests(
    userId: string
  ) {

    return this.http.get(
      `${this.connectionUrl}/sent/${userId}`
    );

  }


  acceptConnectionRequest(
    id: string
  ) {

    return this.http.put(
      `${this.connectionUrl}/accept/${id}`,
      {}
    );

  }


  rejectConnectionRequest(
    id: string
  ) {

    return this.http.put(
      `${this.connectionUrl}/reject/${id}`,
      {}
    );

  }


  getConnections(
    userId: string
  ) {

    return this.http.get(
      `${this.connectionUrl}/accepted/${userId}`
    );

  }


  removeConnection(
    userId: string,
    connectionId: string
  ) {

    return this.http.delete(
      `${this.connectionUrl}/remove`,
      {
        body: {
          userId,
          connectionId
        }
      }
    );

  }


  // ==========================================
  // MESSAGE APIs
  // ==========================================

  sendMessage(
    sender: string,
    receiver: string,
    text: string
  ) {

    return this.http.post(
      `${this.messageUrl}/send`,
      {
        sender,
        receiver,
        text
      }
    );

  }


  getConversation(
    userId: string,
    connectionId: string
  ) {

    return this.http.get(
      `${this.messageUrl}/conversation/${userId}/${connectionId}`
    );

  }

}