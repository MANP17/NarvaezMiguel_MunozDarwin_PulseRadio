import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthenticationService } from '../../services/authentication.service';
import { CustomService } from '../../services/custom.service';

@Component({
  selector: 'app-new-custom-form',
  imports: [CommonModule, ReactiveFormsModule, Toast, RouterModule],
  templateUrl: './new-custom-form.component.html',
  styleUrl: './new-custom-form.component.css',
})
export class NewCustomFormComponent {
  visible: boolean = false;
  newCustomForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    url: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  constructor(private messageService: MessageService, private auth: AuthenticationService, private router: Router, private customService: CustomService) {}

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${message}`,
    });
  }

  submit() {
    if (this.newCustomForm.valid) {
      this.customService.addCustom(this.newCustomForm.getRawValue()).subscribe({
        next: (res) => {
          if(res.isSuccess) {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Estación personalizada agregada correctamente',
              life: 5000
            })
            this.router.navigate(['/custom'])
          }
        },
        error: (err) => {
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al agregar estación personalizada',
              life: 5000
            })
        }
      })
    }
  }
}
