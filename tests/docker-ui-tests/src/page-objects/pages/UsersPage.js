import { Selector } from 'testcafe';

class UsersPage {
  constructor() {
    // there should only be one row on a fresh docker sandbox
    this.adminRow = Selector('.rc-table__body__row');
  }
}

module.exports = new UsersPage();
