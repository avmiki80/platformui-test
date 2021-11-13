export class BaseSearch {
  name: string;
  sortColumn = 'name';
  sortDirection = 'asc';
  pageNumber = 0; // 1 - я страница (значение по умолчанию)
  pageSize = 5; // количество элементов на странице

  constructor(name: string) {
    this.name = name;
  }
}
