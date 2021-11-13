import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
/*
  Interceptor - перехватывает все исходящие запросы - можно изменять данные перед отправкой
 */
@Injectable()
export class RequestInterceptorService implements HttpInterceptor{
  constructor(
    private router: Router// для навигации, перенаправления на другие страницы
  )
  { }
  // метод будет выполняться при каждом исходящем запросе на backend
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true // разрешить отправку куков на backend
    });
    // req.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // console.log(req.headers);
    // когда пользователь ввел новый пароль и отправил его на backend - тогда мы вручную добавляем токен
    if (req.url.includes('update-password')){ // если запрос идет на обновление пароля - для него спец. обработка токена
      const token = req.params.get('token'); // получаем токен из параметра запроса
      req.params.delete('token'); // удаляем параметр, т.к. он больше не нужен
      req = req.clone({
        setHeaders: ({
          // добавляем токен в заголовок Authorization (не используем кук, этот токен будет отправлен на сервер только 1 раз,
          // чтобы выполнить обновление пароля)
          Authorization: 'Bearer ' + token
        })
      });
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
    }),
      catchError(
        (httpErrorResponse: HttpErrorResponse, _: Observable<HttpEvent<any>>) => {
          console.log(httpErrorResponse);
          return throwError(httpErrorResponse);
        }));
  }
}
