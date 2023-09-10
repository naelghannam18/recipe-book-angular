import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { FirebaseResponse } from '../services/authentication/auth.model';
import { User } from '../services/authentication/user.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
    loginMode = false;
    loginForm!: FormGroup;
    isLoading = false;
    error!: string;

    constructor(private authService: AuthenticationService, private router: Router) {}

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.pattern(
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,50}$/
                ),
            ]),
        });
    }

    onSwitchMode() {
        this.loginMode = !this.loginMode;
    }

    onSubmit() {
        if (!this.loginForm.valid) {
          this.loginForm.markAllAsTouched();
          return;
        }
        const { email, password } = this.loginForm.value;
        let authObservable: Observable<FirebaseResponse>;
        this.isLoading = true;

        if (this.loginMode) {
          authObservable = this.authService.signInUser(email, password);
        } else {
          authObservable = this.authService.signUpUser(email, password);
        }

      authObservable.subscribe({
        next: (response) => {
          this.isLoading = false;
          this.error = ''
          this.router.navigate(['/recipes'])
        },
        error: (errorMessage) => {
          this.error = errorMessage
          this.isLoading = false;
        }
      })
        this.clearInputs();
    }

    clearInputs() {
        this.loginForm.reset();
    }

    onCloseError() {
      this.error = '';
    }
}
