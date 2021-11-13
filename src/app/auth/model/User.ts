/*
Классы (объекты) для запросов и их результатов, которые автоматически будут преобразовываться в JSON.
Это аналог entity классов из backend проекта (в упрощенном виде)
Должны совпадать по полям с entity-классами backend!!! (иначе не будет правильно отрабатывать автом. упаковка и распаковка JSON)
*/

// пользователь - хранит свои данные
import {Role} from './Role';
import {Unit} from '../../business/data/model/Unit';

export class User {
  id: number; // обязательное поле, по нему определяется пользователь
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymicName: string;
  unit: Unit;
  description: string;
  // activity: boolean;
  password: string; // не передается с сервера (только от клиента к серверу, например при обновлении пароля)
  roleSet: Array<Role>; // USER, ADMIN, MODERATOR
}
