import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //Array of posts to display in the table
  posts: any[] = [];
  //Holds the username
  username: string = '';
  //Holds the title
  title: string = '';
  //Holds the description
  description: string = '';
  //Holds the departmentCode
  departmentCode: string = '';
  //title Error field
  titleError: string = '';
  //description Error field
  descriptionError: string = '';
  //last name Error field
  departmentCodeError: string = '';
  //general Error field
  generalError: string = '';

  constructor(private postService: PostsService, private router: Router) {}
  //-----------------------------------------------------------------------------------------------------//
  //On web page load
  ngOnInit() {
    //fetch the username from local storage
    var tempUsername = localStorage.getItem('username');
    if(tempUsername != null)
    {
      //set the username
      this.username = tempUsername;
    }
    else
    {
      //if there is no username stored then sign the user out
      this.onSignOutClick();
    }
    //fetch the data on the posts from the mongo db and popoulate the posts array
    this.postService.fetchPosts().subscribe({
      next: data => {
        this.posts = data;
        console.log("done fetching posts", this.posts);
      },
      error: error => {
        console.error('Error from backend:', error);
      }
    }
    );
  }
  //-----------------------------------------------------------------------------------------------------//
  //When the create button is clicked
  onCreateClick() {
    //Validate the input fields
    this.validateInputs()
    this.postService.createPost(this.title, this.description, this.departmentCode).subscribe({
      next: response => 
      {
        console.log('Post created:', response);
        this.ngOnInit();

        //reset the capture fields
        this.title = '';
        this.description = '';
        this.departmentCode = '';
      },
      error: error => 
      {
        console.error('Error creating post:', error);
        this.generalError = error.error;
      }
    });
  }
  //-----------------------------------------------------------------------------------------------------//
  //Delete button clicked
  onDeleteClick(postId: string) {
    this.postService.deletePost(postId).subscribe({
      next: response => {
        console.log('Post deleted');
        //this will update the table
        this.ngOnInit();
      },
      error: error => {
        console.error('Error deleting post:', error);
      }
    });
  }
  //-----------------------------------------------------------------------------------------------------//
  //Sign out button clicked
  onSignOutClick() {
    //reset the username and token
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.router.navigate(['/login']);
  }
  //-----------------------------------------------------------------------------------------------------//
  //Validate the input fields and return a
  public validateInputs(): boolean {
    let isValid = true;
    this.resetErrors()
    if (this.title.length < 3 || this.title.length > 50) {
        this.titleError = "Must be 3-50 characters long.";
        isValid = false;
    }

    if (this.description.length < 3 || this.description.length > 50) {
        this.descriptionError = "Must be 3-50 characters long.";
        isValid = false;
    }

    if (this.departmentCode.length < 3 || this.departmentCode.length > 50) {
      this.departmentCodeError = "Must be 3-50 characters long.";
      isValid = false;
    }

    return isValid;
  }
  //-----------------------------------------------------------------------------------------------------//
  //Resets all the error fields
  resetErrors()
  {
    this.titleError = "";
    this.descriptionError = "";
    this.departmentCodeError = "";
    this.generalError = "";
  }
}
//=====================================================================================================//