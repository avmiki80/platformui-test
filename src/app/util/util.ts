export class StaticMethods {
  public static selectSortDirection(direction: string): string {
    if (direction === 'asc') { return 'desc'; }
    if (direction === 'desc') { return null; }
    return 'asc';
  }
}
