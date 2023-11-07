import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //url to send requests 
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}
  //-----------------------------------------------------------------------------------------------------//
  //Sends the username and password to the backend server for processing
  //Token is generated using this method
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.apiUrl}/auth`, loginData);
  }
  //-----------------------------------------------------------------------------------------------------//
  //Sends the user data to the backend server for processing
  //User is created with this method
  signUp(username: string, firstname: string, lastname: string, password: string): Observable<any> {
    const userData = { username, firstname, lastname, password };
    return this.http.post(`${this.apiUrl}/users`, userData);
  }
}
//=====================================================================================================//