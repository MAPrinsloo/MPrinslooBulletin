import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  //url to send requests 
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}
  //-----------------------------------------------------------------------------------------------------//
  //post data is sent to the server to be processed and saved in the database
  createPost(title: string, description: string, departmentCode: string): Observable<any> {
    //fetch the token from  local storage
    const token = localStorage.getItem('token');
    //if no token is stored then effectively return nothing
    if (!token) {
      return new Observable(); 
    }
    
    const url = `${this.apiUrl}/posts`;
    //pass the token into the header
    const headers = new HttpHeaders().set('x-auth-token', token);
    const createData = { title, description, departmentCode };
    return this.http.post<any[]>(url, createData, { headers });
  }
  //-----------------------------------------------------------------------------------------------------//
  //Pass the post ID to the server to be processed and deleted from the database
  deletePost(postID: string): Observable<any> {
    //fetch the token from  local storage
    const token = localStorage.getItem('token');
    //if no token is stored then effectively return nothing
    if (!token) {
      return new Observable();
    }

    //pass the id into the url
    const url = `${this.apiUrl}/posts/` + postID;
    //pass the token into the header
    const headers = new HttpHeaders().set('x-auth-token', token);
    return this.http.delete<any[]>(url, { headers });
  }
  //-----------------------------------------------------------------------------------------------------//
  //User the locally stored header to retrieve all the posts in the database
  fetchPosts(): Observable<any[]> {
    //fetch the token from  local storage
    const token = localStorage.getItem('token');
    //if no token is stored then effectively return nothing
    if (!token) {
      return new Observable();
    }

    const url = `${this.apiUrl}/posts`;
    //pass the token into the header
    const headers = new HttpHeaders().set('x-auth-token', token);
    return this.http.get<any[]>(url, { headers });
  }
}
//=====================================================================================================//