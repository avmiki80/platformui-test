import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  isLoading: boolean;
  error: string;
  form: FormGroup;
  firstSubmitted = false;
  isMobile: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
    this.isLoading = true;
    this.authService.sendResetPasswordEmail(this.emailField.value).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/info-page', {message: 'Вам отправлено письмо для восстановления пароля'}]);
      },
      err => {
        this.isLoading = false;
        switch (err.error.exception) {
          case 'UsernameNotFoundException': {
            this.error = 'Ошибка: Пользователь с таким email не найден';
            break;
          }
          default: {
            this.error = 'Ошибка: (обратитесь к администратору)';
            break;
          }
        }
      });
  }

}
