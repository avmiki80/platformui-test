import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  uuid: string;
  isLoading: boolean;
  error: string;
  form: FormGroup;
  firstSubmitted = false;
  showResendLink: boolean;
  isMobile: boolean;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.showResendLink = false;

    this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      if (this.uuid === 'error'){
        this.showResendLink = true;
        return;
      }
      this.isLoading = true;
      this.authService.activate(this.uuid).subscribe(result => {
        this.isLoading = false;
        if (result){
          this.router.navigate(['/info-page', {message: 'Аккаунт успешно активирован'}]);
        } else {
          this.router.navigate(['/info-page', {message: 'Аккаунт не активирован. Попробуйте заново'}]);
        }
      }, err => {
        this.isLoading = false;
        switch (err.error.exception) {
          case 'UserAlreadyActivatedException': {
            this.error = 'Ошибка: Пользователь уже активирован';
            this.router.navigate(['/info-page', {message: 'Ваш аккаунт был ранее активирован'}]);
            break;
          }
          // case 'UsernameNotFoundException': {
          //   this.error = 'Ошибка: Проверьте логин или пароль';
          //   this.showResendLink = true;
          //   break;
          // }
          default: {
            this.error = 'Ошибка: (обратитесь к администратору)';
            this.showResendLink = true;
            break;
          }
        }
      });
    });
  }
  get emailField(): AbstractControl{
    return this.form.get('email');
  }

  submitForm(): void{
    this.firstSubmitted = true;
    if (this.form.invalid){
      return;
    }
    this.isLoading = true; // отображать индикатор загрузки
    this.authService.resendActivateEmail(this.emailField.value).subscribe(result => {
      this.isLoading = false;
      this.router.navigate(
        ['/info-page',
          {message: 'Вам отправлено письмо активации.'}
        ]);
      // this.err = null;
    }, err => {
      this.isLoading = false;
      switch (err.error.exception) {
        case 'UserAlreadyActivatedException': {
          this.error = 'Ошибка: Пользователь уже активирован';
          this.router.navigate(['/info-page', {message: 'Ваш аккаунт был ранее активирован'}]);
          break;
        }
        case 'UsernameNotFoundException': {
          this.error = 'Ошибка: Пользователь с таким email не найден';
          this.showResendLink = true;
          break;
        }
        default: {
          this.error = 'Ошибка: (обратитесь к администратору)';
          this.showResendLink = true;
          break;
        }
      }
    });
  }
}
