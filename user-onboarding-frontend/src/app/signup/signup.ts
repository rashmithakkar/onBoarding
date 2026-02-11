import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  // form fields
  name = signal('');
  email = signal('');

  // UI states
  loading = signal(false);
  success = signal('');
  error = signal('');

  constructor(private http: HttpClient) {}

  submit() {
    this.error.set('');
    this.success.set('');

    if (!this.name() || !this.email()) {
      this.error.set('Name and Email are required');
      return;
    }

    this.loading.set(true);

    // 🔴 API call will be enabled later
    this.http
      .post('http://localhost:3000/api/signup', {
        name: this.name(),
        email: this.email(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set('Signup successful!');
          this.name.set('');
          this.email.set('');
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Signup failed');
        },
      });
  }
}
