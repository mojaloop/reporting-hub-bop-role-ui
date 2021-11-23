import { Selector } from "testcafe";

export type UserRow = {
  row: Selector,
  username: Selector,
  name: Selector,
  emails: Selector,
}

export const UserListPage = {
  async getUserRows(): Promise<UserRow[]> {
    const rows = Selector('.rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        username: rows.nth(i).find('.rc-table__body__cell').nth(0),
        name: rows.nth(i).find('.rc-table__body__cell').nth(1),
        emails: rows.nth(i).find('.rc-table__body__cell').nth(2),
      }));
  },
};
