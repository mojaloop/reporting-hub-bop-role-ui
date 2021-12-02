import { Selector } from "testcafe";

export type AssignedRoleRow = {
  row: Selector,
  role: Selector,
  removeRoleButton: Selector,
}

export type AssignedCompanyRow = {
  row: Selector,
  company: Selector,
  removeCompanyButton: Selector,
}

export type AssignableRoleRow = {
  row: Selector,
  checkBox: Selector,
  role: Selector,
}

export type AssignableCompanyRow = {
  row: Selector,
  checkBox: Selector,
  company: Selector,
}


export const UserInfoPage = {
  heading: Selector('.rc-heading'),
  updateRolesButton: Selector('.userProfile__roles .rc-button').withText('Update Roles'),
  updateCompaniesButton: Selector('.userProfile__participants .rc-button').withText('Update Companies'),

  modalUpdateRolesButton: Selector('.userProfile__role-update-modal .rc-button').withText('Update Roles'),
  modalUpdateCompaniesButton: Selector('.userProfile__company-update-modal .rc-button').withText('Update Companies'),

  async getAssignedRolesRows(): Promise<AssignedRoleRow[]> {
    const rows = Selector('.userProfile__roles .rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        role: rows.nth(i).find('.userProfile__roles .rc-table__body__cell').nth(0),
        removeRoleButton: rows.nth(i).find('.userProfile__roles .rc-table__body__cell').nth(1),
      }));
  },

  async getAssignedCompaniesRows(): Promise<AssignedCompanyRow[]> {
    const rows = Selector('.userProfile__participants .rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        company: rows.nth(i).find('.userProfile__participants .rc-table__body__cell').nth(0),
        removeCompanyButton: rows.nth(i).find('.userProfile__participants .rc-table__body__cell').nth(1),
      }));
  },

  async getAssignableRolesRows(): Promise<AssignableRoleRow[]> {
    const rows = Selector('.userProfile__role-update-modal .rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        checkBox: rows.nth(i).find('.userProfile__role-update-modal .rc-table__body__cell').nth(0),
        role: rows.nth(i).find('.userProfile__role-update-modal .rc-table__body__cell').nth(1),
      }));
  },

  async getAssignableCompaniesRows(): Promise<AssignableCompanyRow[]> {
    const rows = Selector('.userProfile__company-update-modal .rc-table__body__row');
    const length = await rows.count;
    return Array
      .from({ length })
      .map((_, i) => ({
        row: rows.nth(i),
        checkBox: rows.nth(i).find('.userProfile__company-update-modal .rc-table__body__cell').nth(0),
        company: rows.nth(i).find('.userProfile__company-update-modal .rc-table__body__cell').nth(1),
      }));
  },
};
