import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isRegistering = false;
  isSubmiting = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      nome: [''],
      login: ['']
    });
  }

  toggleMode(): void {
    this.isRegistering = !this.isRegistering;
    this.loginForm.reset();
    
    if (this.isRegistering) {
      this.loginForm.get('nome')?.setValidators([Validators.required]);
      this.loginForm.get('login')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('nome')?.clearValidators();
      this.loginForm.get('login')?.clearValidators();
    }
    
    this.loginForm.get('nome')?.updateValueAndValidity();
    this.loginForm.get('login')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.isSubmiting = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      if (this.isRegistering) {
        this.authService.register(this.loginForm.value);
      } else {
        this.authService.login(this.loginForm.value);
      }
      
      this.isLoading = false;
    }
  }
}