import { AuthService, User } from './lib/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.autoLogin();

    this.authService.userChange.subscribe(
      (data: User) => {
        this.user = data;
      }
    );
  }

  logoutUser() {
    this.authService.logoutUser();
  }


}
