import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { MustMatchDirective } from './auth/directive/must-match.directive';
import {RequestInterceptorService} from './auth/interceptor/RequestInterceptorService';
import { RegisterComponent } from './auth/register/register.component';
import { ActivateAccountComponent } from './auth/activate-account/activate-account.component';
import { InfoPageComponent } from './auth/info-page/info-page.component';
import { SendEmailComponent } from './auth/reset-password/send-email/send-email.component';
import { UpdatePasswordComponent } from './auth/reset-password/update-password/update-password.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserMainComponent } from './business/views/page/user-main/user-main.component';
import { AdminMainComponent } from './business/views/page/admin-main/admin-main.component';
import {PLATFORM_APP_URL_TOKEN} from './business/data/dao/impl/platform-app.service';
import {ROLE_URL_TOKEN} from './business/data/dao/impl/role.service';
import {USER_URL_TOKEN} from './business/data/dao/impl/user.service';
import {UNIT_URL_TOKEN} from './business/data/dao/impl/unit.service';
import { HeaderComponent } from './business/views/page/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {registerLocaleData} from '@angular/common';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import localeRu from '@angular/common/locales/ru';
import {SidebarModule} from 'ng-sidebar';
import { AdminMenuComponent } from './business/views/page/admin-menu/admin-menu.component';
import { ApplicationViewComponent } from './business/views/page/applications/application-view/application-view.component';
import { UserViewComponent } from './business/views/page/users/user-view/user-view.component';
import { RoleViewComponent } from './business/views/page/roles/role-view/role-view.component';
import { ListAppViewComponent } from './business/views/page/applications/list-app-view/list-app-view.component';
import { ConfirmDialogComponent } from './business/views/dialog/confirm-dialog/confirm-dialog.component';
import { EditPlatformAppDialogComponent } from './business/views/dialog/edit-platform-app-dialog/edit-platform-app-dialog.component';
import { ListRoleViewComponent } from './business/views/page/roles/list-role-view/list-role-view.component';
import { ListUserViewComponent } from './business/views/page/users/list-user-view/list-user-view.component';
import { EditRoleDialogComponent } from './business/views/dialog/edit-role-dialog/edit-role-dialog.component';
import { EditUserDialogComponent } from './business/views/dialog/edit-user-dialog/edit-user-dialog.component';
import { SelectPlatformAppDialogComponent } from './business/views/dialog/select-platform-app-dialog/select-platform-app-dialog.component';
import {MatListModule} from '@angular/material/list';
import { SelectRoleDialogComponent } from './business/views/dialog/select-role-dialog/select-role-dialog.component';
import { SimpleListRoleViewComponent } from './business/views/page/roles/simple-list-role-view/simple-list-role-view.component';
import {MatCardModule} from '@angular/material/card';
import { AccessDeniedComponent } from './auth/access-denied/access-denied.component';
import { UserCardViewComponent } from './business/views/page/user-card-view/user-card-view.component';
import {MyMatPaginatorIntl} from './business/intl/MyMatPaginatorIntl';
// import {environment} from '../environments/environment';
import {environment} from '../environments/environment';
import { FooterComponent } from './business/views/page/footer/footer.component';
import { UserMenuComponent } from './business/views/page/user-menu/user-menu.component';
import { SettingsDialogComponent } from './business/views/dialog/settings-dialog/settings-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import { ChangePasswordDialogComponent } from './business/views/dialog/change-password-dialog/change-password-dialog.component';
import { EditUnitDialogComponent } from './business/views/dialog/edit-unit-dialog/edit-unit-dialog.component';
import { ListItemViewComponent } from './business/views/page/list-item-view/list-item-view.component';
import { TreeUnitViewComponent } from './business/views/page/users/tree-unit-view/tree-unit-view.component';
import {MatTreeModule} from '@angular/material/tree';
import { SelectUnitDialogComponent } from './business/views/dialog/select-unit-dialog/select-unit-dialog.component';
import { MessageDialogComponent } from './business/views/dialog/message-dialog/message-dialog.component';
import {AUTH_URL_TOKEN} from './auth/service/auth.service';
import { CapitalizePipe } from './business/pipe/capitalize.pipe';


registerLocaleData(localeRu);

// для загрузки переводов по сети
export function HttpLoaderFactory(httpClient: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(httpClient, [
    {prefix: environment.frontendURL + '/assets/i18n/', suffix: '.json'} // путь к папке и суффикс файлов
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MustMatchDirective,
    RegisterComponent,
    ActivateAccountComponent,
    InfoPageComponent,
    SendEmailComponent,
    UpdatePasswordComponent,
    UserMainComponent,
    AdminMainComponent,
    HeaderComponent,
    AdminMenuComponent,
    ApplicationViewComponent,
    UserViewComponent,
    RoleViewComponent,
    ListAppViewComponent,
    ConfirmDialogComponent,
    EditPlatformAppDialogComponent,
    ListRoleViewComponent,
    ListUserViewComponent,
    EditRoleDialogComponent,
    EditUserDialogComponent,
    SelectPlatformAppDialogComponent,
    SelectRoleDialogComponent,
    SimpleListRoleViewComponent,
    AccessDeniedComponent,
    UserCardViewComponent,
    FooterComponent,
    UserMenuComponent,
    SettingsDialogComponent,
    ChangePasswordDialogComponent,
    EditUnitDialogComponent,
    ListItemViewComponent,
    TreeUnitViewComponent,
    SelectUnitDialogComponent,
    MessageDialogComponent,
    CapitalizePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
// если написан RouterModule(системный), то будет ошибка
// ERROR NullInjectorError: R3InjectorError(AppModule)[ChildrenOutletContexts -> ChildrenOutletContexts -> ChildrenOutletContexts]:
// NullInjectorError: No provider for ChildrenOutletContexts!
// Надо импортировать свой, созданный модуль
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatRadioModule,
    SidebarModule,
    MatTreeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory, // для загрузки  переводов по сети
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true},

    // нужно указывать для корректной работы диалоговых окон
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}},
    {provide: MatPaginatorIntl, useClass: MyMatPaginatorIntl},

    {provide: PLATFORM_APP_URL_TOKEN, useValue: environment.backendURL + '/application'},
    {provide: ROLE_URL_TOKEN, useValue: environment.backendURL + '/role'},
    {provide: USER_URL_TOKEN, useValue: environment.backendURL + '/user'},
    {provide: UNIT_URL_TOKEN, useValue: environment.backendURL + '/unit'},
    {provide: AUTH_URL_TOKEN, useValue: environment.backendURL + '/auth'},
  ],
  entryComponents: [
    ConfirmDialogComponent,
    EditRoleDialogComponent,
    EditUserDialogComponent,
    EditPlatformAppDialogComponent,
    SelectPlatformAppDialogComponent,
    SelectRoleDialogComponent,
    SettingsDialogComponent,
    ChangePasswordDialogComponent,
    EditUnitDialogComponent,
    SelectUnitDialogComponent,
    MessageDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
