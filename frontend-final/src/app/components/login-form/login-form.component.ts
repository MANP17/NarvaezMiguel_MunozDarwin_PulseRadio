import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, Toast, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
  providers: [MessageService]
})
export class LoginFormComponent {
  loginForm = new FormGroup({
  username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
});

  constructor(private auth: AuthenticationService, private router: Router, private messageService: MessageService) {}

  showError(message: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${message}` });
    }

  submit() {
    if(this.loginForm.valid) {
      this.auth.login(this.loginForm.getRawValue()).subscribe({
        next: () => {this.router.navigate(['/home'])},
        error: (err) => {
          // this.showError(err.error.message)
          if(err.error.message === 'El usuario no existe.') {
            this.loginForm.get('username')?.setErrors({notFound: true})
          } else if(err.error.message === 'Contraseña incorrecta.') {
            this.loginForm.get('password')?.setErrors({wrongPassword: true})
          }
        }
      })
    }
  }

}
