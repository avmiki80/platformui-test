import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';
/*
Страница, где пользователь вводит новый пароль и отправляет на сервер для обновления.
 */
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup; // форма с введенными пользователем данными
  isLoading = false; // идет ли загрузка в данный момент (для показа/скрытия индикатора загрузки)
  error: string; // текст ошибки (если есть)
  showPasswordForm = false; // показывать ли форму с паролями
  token: string; // токен для отправки запроса на сервер
  firstSubmitted = false; // становится true при первом нажатии (чтобы сразу не показывать ошибки полей, а только после первой попытки)
  isMobile: boolean;
  // внедрение всех нужных объектов
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private deviceDetectorService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void { // вызывается при инициализации компонента (до отображения внешнего вида)

    this.isMobile = this.deviceDetectorService.isMobile();
    // инициализация формы с нужными полями, начальными значениями и валидаторами
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });


    this.route.params.subscribe(params => { // т.к. params - это Observable - подписываемся и получаем значения
      this.token = params.token; // считываем токен из параметра роута
      this.showPasswordForm = true; // показываем форму с паролями только после получения token из параметра запроса
    });

  }

  // ссылка на компоненты формы (для сокращения кода, чтобы каждый раз не писать this.form.get('') )
  get passwordField(): AbstractControl  {
    return this.form.get('password');
  }

  get confirmPasswordField(): AbstractControl  {
    return this.form.get('confirmPassword');
  }

  // попытка отправки данных формы
  public submitForm(): void {

    this.firstSubmitted = true; // один раз нажали на отправку формы (можно теперь показывать ошибки)

    if (this.form.invalid) { // если есть хотя бы одна ошибка в введенных данных формы
      return; // не отправляем данные на сервер
    }


    this.isLoading = true; // показать индикатор загрузки

    // отправка запроса на сервер
    this.authService.updatePassword(this.passwordField.value, this.token).subscribe(
      result => { // запрос успешно выполнился без ошибок

        this.isLoading = false; // скрыть индикатор загрузки

        if (result) {
          this.router.navigate(['/info-page', {message: 'Пароль успешно обновлен.'}]);
        }

      },

      () => { // от сервера пришла ошибка
        this.isLoading = false; // скрыть индикатор загрузки

        // показываем пользователю информацию на новой странице
        this.router.navigate(['/info-page', {message: 'Ошибка при обновлении пароля. Возможно вышел срок действия страницы. Запросите пароль заново.'}]);

      });
  }

}
