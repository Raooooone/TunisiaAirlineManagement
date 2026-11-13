import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Import the UserService
import { User } from '../interface/user'; // Import the User model

@Component({
  selector: 'app-user-login-signup',
  templateUrl: './user-login-signup.component.html',
  styleUrls: ['./user-login-signup.component.css'],
})
export class UserLoginSignupComponent {
  users: User[] = [
    { username: 'user', password: 'user123', role: 'user', email: 'user@example.com' },
  ];
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = ''; // Added email field for signup
  isSignUp: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  // Toggles between login and signup forms
  toggleSignUp(): void {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Handles user login
  onLogin(): void {
    this.userService.authenticate(this.username, this.password).subscribe(
      (user: User | null) => {
        if (user) {
          // Login successful
          this.successMessage = 'Login successful!';
          this.errorMessage = '';
          // Navigate based on role
          if (user.role === 'admin') {
            this.router.navigate(['/adminAcceuil']);
          } else {
            this.router.navigate(['/userAcceuil']);
          }
        } else {
          this.errorMessage = 'Invalid username or password';
          this.successMessage = '';
        }
      },
      (error) => {
        this.errorMessage = 'Something went wrong. Please try again.';
        this.successMessage = '';
      }
    );
  }

  // Handles user sign-up
  onSignUp(): void {
    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Check if username and email are provided
    if (!this.email || !this.username) {
      this.errorMessage = 'Username and email are required';
      return;
    }

    // Prepare the new user object
    const newUser: User = {
      username: this.username,
      password: this.password,
      email: this.email, // Include email in the signup data
      role: 'user', // Assign role as 'user' by default
    };

    // Call the user service to sign up
    this.userService.signUp(newUser).subscribe(
      (user: User) => {
        // Show success message and switch to login form
        this.successMessage = 'Signup successful! Please login.';
        this.errorMessage = '';
        this.isSignUp = false; // Switch to login form after successful sign-up
      },
      (error) => {
        // Handle errors during signup
        this.errorMessage = error.message || 'Error during signup';
        this.successMessage = '';
      }
    );
  }

  // Method to navigate to the admin login page
  navigateToAdminLogin(): void {
    this.router.navigate(['/admin-login']); // Route to admin login page
  }
}
