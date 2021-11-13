import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {User} from '../model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  user: User;
  err: string;
  isLoading: boolean;
  showResendLink = false;
  firstSubmitted = false;
  isMobile: boolean;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private deviceDetectorService: DeviceDetectorService,
              ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  get usernameField(): AbstractControl{
    return this.form.get('username');
  }

  get passwordField(): AbstractControl{
    return this.form.get('password');
  }
  submitForm(): void{
    this.firstSubmitted = true;
    if (this.form.invalid){
      return;
    }
    this.isLoading = true; // отображать индикатор загрузки
    const tmpUser = new User();
    tmpUser.password = this.passwordField.value;
    tmpUser.username = this.usernameField.value.toLowerCase();
    this.authService.login(tmpUser).subscribe(result => {
      this.user = result;
      this.isLoading = false;
      this.authService.currentUser.next(this.user);
      this.authService.isLoggedIn = true;
      if (this.user.roleSet.find(role => role.name === 'ADMIN') != null){
        this.router.navigate(['admin-main']);
      } else {
        this.router.navigate(['user-main']);
      }
    }, error => {
      this.isLoading = false;
      switch (error.error.exception) {
        case 'BadCredentialsException': {
          this.err = 'Ошибка: Неверный логин или пароль';
          break;
        }
        case 'UsernameNotFoundException': {
          this.err = 'Ошибка: Проверьте логин или пароль';
          break;
        }
        case 'DisabledException': {
          this.err = 'Ошибка: Пользователь не активирован';
          this.showResendLink = true;
          break;
        }
        default: {
          this.err = 'Ошибка: (обратитесь к администратору)';
          break;
        }
      }
    });
  }
}
