import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {User} from '../model/User';
import {TranslateService} from '@ngx-translate/core';
import {LANG_RU} from '../../app.constant';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  user: User;
  err: string;
  isLoading: boolean;
  firstSubmitted = false;
  isMobile: boolean;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private translateService: TranslateService,
              private deviceDetectorService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.translateService.use(LANG_RU);
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      patronymicname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get usernameField(): AbstractControl{
    return this.form.get('username');
  }
  get firstnameField(): AbstractControl{
    return this.form.get('firstname');
  }
  get lastnameField(): AbstractControl{
    return this.form.get('lastname');
  }
  get patronymicnameField(): AbstractControl{
    return this.form.get('patronymicname');
  }

  get passwordField(): AbstractControl{
    return this.form.get('password');
  }
  get emailField(): AbstractControl{
    return this.form.get('email');
  }
  get confirmPasswordField(): AbstractControl{
    return this.form.get('confirmPassword');
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
    tmpUser.firstName = this.firstnameField.value.toLowerCase();
    tmpUser.lastName = this.lastnameField.value.toLowerCase();
    tmpUser.patronymicName = this.patronymicnameField.value.toLowerCase();
    tmpUser.email = this.emailField.value;
    this.authService.register(tmpUser).subscribe(result => {
      this.user = result;
      this.isLoading = false;
      this.router.navigate(
        ['/info-page',
          {message: 'Вам отправлено письмо для подтверждения аккаунта. Проверьте электронную почту через 1 - 2 минуты.'}
        ]);
      // this.err = null;
    }, error => {
      this.isLoading = false;
      switch (error.error.exception) {
        case 'DataIntegrityViolationException': { // при добавлении данных - произошла ошибка целостности
          this.err = 'Пользователь или email уже существует';
          break;
        }
        case 'ConstraintViolationException': { // при добавлении данных - произошла ошибка уникальности строки
          this.err = 'Пользователь или email уже существует';
          break;
        }
        case 'UserOrEmailExists': {
          this.err = 'Ошибка: Пользователь или email уже существует';
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
