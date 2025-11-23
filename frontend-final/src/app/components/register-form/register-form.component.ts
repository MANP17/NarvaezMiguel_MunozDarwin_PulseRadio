import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register-form',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  registerForm = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  })
  constructor(private auth: AuthenticationService, private router: Router) { }
  submit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.getRawValue()).subscribe({
        next: () => { this.router.navigate(['/home']) },
        error: (err) => {
          // this.showError(err.error.message)
          console.log(err.error.message)
          if (err.error.message === 'El nombre de usuario ya existe.') {
            this.registerForm.get('username')?.setErrors({ notFound: true })
          }
          else if (err.error.message === 'El correo electrónico ya está registrado.') {
            this.registerForm.get('email')?.setErrors({ wrongEmail: true })
          }
        }
      })
    }
  }
}
