import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {InfoPageComponent} from './auth/info-page/info-page.component';
import {ActivateAccountComponent} from './auth/activate-account/activate-account.component';
import {SendEmailComponent} from './auth/reset-password/send-email/send-email.component';
import {UpdatePasswordComponent} from './auth/reset-password/update-password/update-password.component';
import {UserMainComponent} from './business/views/page/user-main/user-main.component';
import {AdminMainComponent} from './business/views/page/admin-main/admin-main.component';
import {RolesGuard} from './business/guard/roles.guard';
import {AccessDeniedComponent} from './auth/access-denied/access-denied.component';

const routes: Routes = [
  // страницы для неавторизованных пользователей
  {path: '', component: LoginComponent},
  {path: 'logout', redirectTo: 'index', pathMatch: 'full'}, // главная
  {path: 'index', redirectTo: '', pathMatch: 'full'}, // главная
  {path: 'login', component: LoginComponent, pathMatch: 'full'}, // логин
  {path: 'register', component: RegisterComponent, pathMatch: 'full'}, // регистрация
  {path: 'info-page', component: InfoPageComponent, pathMatch: 'full'}, // страница с информацией пользователю
  {path: 'activate-account/:uuid', component: ActivateAccountComponent, pathMatch: 'full'}, // запрос на письмо активации
  {path: 'reset-password', component: SendEmailComponent, pathMatch: 'full'}, // отправка письма - восстановление пароля
  {path: 'update-password/:token', component: UpdatePasswordComponent, pathMatch: 'full'}, // форма обновления пароля

  // Страницы для авторизованных пользователей - для открытия страницы (и получения RESTful данных) требуется проверка ролей
  // Тут нужно описать все варианты папок/страниц с доступом по ролям
  // Все остальные ссылки будут перенаправлять на страницу 404

  /* спец. объект RolesGuard будет вызываться каждый раз перед выполнение данного роутинга
    в RolesGuard считываются роли пользователя и сравниваются с allowedRoles
   */
  {path: 'user-main', component: UserMainComponent, canActivate: [RolesGuard],
    data: {
      allowedRoles: ['ADMIN', 'USER'] // для открытия этой страницы - у пользователя должна быть одна из этих ролей
    }
  },  // при переходе по ссылке - сначала отработает RolesGuard
  {path: 'admin-main', component: AdminMainComponent, canActivate: [RolesGuard],
    data: {
      allowedRoles: ['ADMIN'] // для открытия этой страницы - у пользователя должна быть одна из этих ролей
    }
  }, // при переходе по ссылке - сначала отработает RolesGuard
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: '**', redirectTo: '/'} // все остальные запросы отправлять на главную страницу
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
