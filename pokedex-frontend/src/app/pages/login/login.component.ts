import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card login-card">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">
                <i class="fas fa-dragon text-primary me-2"></i>
                {{ isRegistering ? 'Registrar' : 'Login' }}
              </h2>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <!-- Campos de Registro -->
                <div *ngIf="isRegistering" class="mb-3">
                  <label class="form-label">Nome</label>
                  <input type="text" class="form-control" formControlName="nome"
                         [class.is-invalid]="loginForm.get('nome')?.invalid && loginForm.get('nome')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('nome')?.errors?.['required']">
                    Nome é obrigatório
                  </div>
                </div>

                <div *ngIf="isRegistering" class="mb-3">
                  <label class="form-label">Login</label>
                  <input type="text" class="form-control" formControlName="login"
                         [class.is-invalid]="loginForm.get('login')?.invalid && loginForm.get('login')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('login')?.errors?.['required']">
                    Login é obrigatório
                  </div>
                </div>

                <!-- Campos comuns -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="text" class="form-control" formControlName="email"
                         [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required']">
                    Email é obrigatório
                  </div>
                  <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email']">
                    Email inválido
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Senha</label>
                  <input type="password" class="form-control" formControlName="senha"
                         [class.is-invalid]="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched">
                  <div class="invalid-feedback" *ngIf="loginForm.get('senha')?.errors?.['required']">
                    Senha é obrigatória
                  </div>
                  <div class="invalid-feedback" *ngIf="loginForm.get('senha')?.errors?.['minlength']">
                    Mínimo 6 caracteres
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 mb-3" [disabled]="isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isRegistering ? 'Registrar' : 'Entrar' }}
                </button>

                <button type="button" class="btn btn-link w-100 p-0" (click)="toggleMode()">
                  {{ isRegistering ? 'Já tem conta? Faça login' : 'Não tem conta? Registre-se' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 10vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      border: none;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      width: 400px;
    }

    .card-body {
      padding: 2rem !important;
    }

    .form-label {
      font-weight: 500;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .form-control {
      border-radius: 8px;
      border: 1px solid #ddd;
      padding: 0.75rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
      }

      &.is-invalid {
        border-color: #dc3545;
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      padding: 0.75rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        opacity: 0.6;
      }
    }

    .btn-link {
      color: #667eea;
      text-decoration: none;
      border: none;
      background: none;
      transition: color 0.3s ease;

      &:hover {
        color: #764ba2;
        text-decoration: underline;
      }
    }

    h2 {
      color: #333;
      font-weight: 600;

      i {
        color: #667eea;
      }
    }

    .invalid-feedback {
      display: block;
      font-size: 0.875rem;
    }

    /* Responsividade */
    @media (max-width: 576px) {
      .login-container {
        padding: 10px;
      }
      
      .card-body {
        padding: 1.5rem !important;
      }
      
      .col-12.col-sm-8.col-md-6.col-lg-4 {
        padding: 0 10px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isRegistering = false;
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
      email: ['', [Validators.required, Validators.email]],
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