import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  //Holds the username
  username: string = '';
  //Holds the first name of the user
  firstName: string = '';
  //Holds the last name of the user
  lastName: string = '';
  //Holds the password
  password: string = '';
  //Username Error field
  usernameError: string = '';
  //first name Error field
  firstNameError: string = '';
  //last name Error field
  lastNameError: string = '';
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
  //When the sign up button is clicked
  onSignUpClick() {
    //Validate the user input fields
    this.validateInputs()
    this.authService.signUp(this.username, this.firstName, this.lastName, this.password).subscribe({
      next: response => 
      {
        //If successful continue to log the user in to generate the token
        console.log('Response from backend:', response);
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
      },
      error: error => 
      {
        console.error('Error from backend:', error.status);
        this.usernameError = "Username or Password invalid";
        this.passwordError = "Username or Password invalid";
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
  //-----------------------------------------------------------------------------------------------------//
  //Validates all the input fields and returns a boolean
  public validateInputs(): boolean {
    let isValid = true;
    this.resetErrors()
    if (this.username.length < 3 || this.username.length > 50) {
        this.usernameError = "Must be 3-50 characters long.";
        isValid = false;
    }

    if (this.password.length < 3 || this.password.length > 50) {
        this.passwordError = "Must be 3-50 characters long.";
        isValid = false;
    }

    if (this.firstName.length === 0 || this.firstName.length > 50) {
        this.firstNameError = "Max 50 characters long";
        isValid = false;
    }

    if (this.lastName.length === 0 || this.lastName.length > 50) {
        this.lastNameError = "Max 50 characters long";
        isValid = false;
    }

    return isValid;
  }
  //-----------------------------------------------------------------------------------------------------//
  //Resets all the error fields
  resetErrors()
  {
    this.usernameError = "";
    this.passwordError = "";
    this.firstNameError = "";
    this.lastNameError = "";
    this.generalError = "";
  }
}
//=====================================================================================================//