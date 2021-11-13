import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../model/User';

export const AUTH_URL_TOKEN = new InjectionToken<string>('url');
/*
Cервис для взаимодействия с backend системой по части аутентификации/авторизации
*/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;
  currentUser = new BehaviorSubject<User>(null); // текущий залогиненный пользователь (по умолчанию null)
  // url: string;

  constructor(
    @Inject(AUTH_URL_TOKEN) private url,
    private httpClient: HttpClient,
    private router: Router
  ) {
    // ссылка на корневой URL бекенда, связанного с авторизацией
    // this.url = environment.backendURL + '/auth';
  }
  // аутентификация
  public login(request: User): Observable<User>{
    return this.httpClient.post<User>(this.url + '/login', request);
  }
  // регистрация нового пользователя
  public register(user: User): Observable<any>{
    return this.httpClient.put<any>(this.url + '/register', user);
  }
  // активация аккаунта
  public activate(uuid: string): Observable<boolean>{
    return this.httpClient.post<boolean>(this.url + '/activate-account', uuid);
  }
  // повторная отправка письма активации аккаунта
  public resendActivateEmail(userOrEmail: string): Observable<any>{
    return this.httpClient.post<any>(this.url + '/resend-activate-email', userOrEmail);
  }
  // отправить письмо для сброса пароля
  public sendResetPasswordEmail(email: string): Observable<boolean>{
    return this.httpClient.post<boolean>(this.url + '/send-reset-password-email', email);
  }
  // обновить пароль пользователя
  public updatePassword(newPassword: string, token: string): Observable<boolean>{
    /*
  При обновлении пароля пользователь незалогинен в системе, соответственно нет данных о пользователе.
  Поэтому чтобы обновить пароль - нам нужно добавить token к исходящему запросу,
  чтобы backend распознал его и разрешил выполнить метод обновления (иначе будет ошибка доступа, нет прав)
  У token действует ограничение по времени (устанавливается на backend), если пользователь не успеет за это время -
  нужно будет заново выполнять запрос на сброс пароля.
 */
    const tokenParam = new HttpParams().set('token', token);
    return this.httpClient.post<boolean>(this.url + '/update-password', newPassword, {params: tokenParam});
  }

  public logout(): void{
    this.currentUser.next(null); // обнудение текущего пользователя
    this.isLoggedIn = false; // указываем что пользователь разлогинился
    // чтоб удалить кук с флагом httpOnly - нужно попросить об этом сервер, т.к. клиент не имеет доступ к куку
    this.httpClient.post<any>(this.url + '/logout', null).subscribe();
    this.router.navigate(['']); // переход на страницу с бизнес данными
  }

  // авто логин пользователя (если есть в куках JWT - от бекенда вернется статус 200 и текущий пользователь)
  public autoLogin(): Observable<User> {
    return this.httpClient.post<User>(this.url + '/auto', null); // ничего не передаем (пустое тело)
  }
}



