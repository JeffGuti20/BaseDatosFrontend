import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { User} from '../../models/user';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public status: number;
  public user: User;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.status = -1;
    this.user=new User(1,"","","", null)
  }

  onSubmit(form: any) {
    this._authService.login(this.user).subscribe({
      next: (response: LoginResponse) => {
        if (response.access_token.length > 0) {
          this._router.navigate(['']);
          this.cdr.detectChanges();
        } else {
          this.status = 0;
          this.cdr.detectChanges();
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.status = 0; 
          this.cdr.detectChanges();
        } else {
          this.status = 1; 
          this.cdr.detectChanges();
        }
      },
    });
  }
}
