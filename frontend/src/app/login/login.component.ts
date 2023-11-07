import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  //Holds the username
  username: string = '';
  //Holds the password
  password: string = '';
  //Username Error field
  usernameError: string = '';
  //password Error field
  passwordError: string = '';
  //general Error field
  generalError: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  //-----------------------------------------------------------------------------------------------------//
  //On web page load
  ngOnInit() {
    //if there is data stored locally on the username and token then redirect the user to the home page
    if(localStorage.getItem('username') != null && localStorage.getItem('token') != null)
    {
      this.router.navigate(['/home']);
    }
  }
  //-----------------------------------------------------------------------------------------------------//
  //When the user clicks the login button
  onLoginClick() {
    this.authService.login(this.username, this.password).subscribe({
      next: response => 
      {
        console.log('Response from backend:', response);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', this.username)
        this.router.navigate(['/home']);
      },
      error: error => 
      {
        console.error('Error from backend:', error);
        this.usernameError = 'Invalid username or password';
        this.passwordError = 'Invalid username or password';

        //429 is the error when too many attempts haev been made
        if(error.status == 429)
        {
          this.generalError = error.statusText;
        }
        else
        {
          this.generalError = error.error.error;
        }
      }
    });
  }
}
//=====================================================================================================//