import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SideNavComponent } from "../side-nav/side-nav.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SideNavComponent, ReactiveFormsModule, SideNavComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: any;
  
  constructor (private fb: FormBuilder, private snackBar: MatSnackBar) {}

  public ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contact: ['', Validators.required]
    })
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }

  public onSubmit() {
    if (this.profileForm.valid) {
      console.log('The form have been saved successfully');
      console.log(this.profileForm.value);   
      this.profileForm.reset();   
    } else {
      this.openSnackBar('Please fill in all fields correctly!', 'Close');
    }
  }


}
