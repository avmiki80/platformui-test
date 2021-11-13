import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  cookieEnabled: boolean;

  ngOnInit(): void {
    document.cookie = 'testcookie';
    this.cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
  }

}
