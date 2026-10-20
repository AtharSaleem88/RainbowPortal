import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '@store/authentication/authentication.actions';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SigninComponent implements OnInit {
  signInForm!: UntypedFormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  isAuthenticating: boolean = false;
  selectedRole: 'admin' | 'manager' | 'moderator' = 'admin';

  public fb = inject(UntypedFormBuilder);
  public store = inject(Store);

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['admin@rainbow.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    });
  }

  get formValues() {
    return this.signInForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  selectRole(role: 'admin' | 'manager' | 'moderator') {
    this.selectedRole = role;
    if (role === 'admin') {
      this.fillAdmin();
    } else if (role === 'manager') {
      this.fillBranchManager();
    } else {
      this.fillModerator();
    }
  }

  fillAdmin() {
    this.selectedRole = 'admin';
    this.signInForm.patchValue({
      email: 'admin@rainbow.com',
      password: '123456',
    });
  }

  fillBranchManager() {
    this.selectedRole = 'manager';
    this.signInForm.patchValue({
      email: 'manager.valencia@rainbow.com',
      password: '123456',
    });
  }

  fillModerator() {
    this.selectedRole = 'moderator';
    this.signInForm.patchValue({
      email: 'moderator.valencia@rainbow.com',
      password: '123456',
    });
  }

  login() {
    this.submitted = true;
    if (this.signInForm.valid) {
      this.isAuthenticating = true;
      const email = this.formValues['email'].value;
      const password = this.formValues['password'].value;

      setTimeout(() => {
        this.store.dispatch(login({ email: email, password: password }));
      }, 400);
    }
  }
}

export { SigninComponent as Signin };
