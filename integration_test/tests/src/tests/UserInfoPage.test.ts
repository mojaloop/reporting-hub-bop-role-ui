import { waitForReact } from 'testcafe-react-selectors';
import { config } from '../config';
import { SideMenu } from '../page-objects/components/SideMenu';
import { UserInfoPage } from '../page-objects/pages/UserInfoPage';
import { UserListPage } from '../page-objects/pages/UserListPage';

fixture `User Info and Assignment Feature`
  .page`${config.roleMicrofrontendEndpoint}`
  .beforeEach(async (t) => {
    await waitForReact();
    await t
      .click(SideMenu.usersButton).wait(2000);
  });

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to navigate to User info by clicking on row', async (t) => {

  // We should have an wso2 default admin user and however many specified in
  // ./integration_test/manifests/backend/users.json
  // We will primarily testing against the default admin user
  const userRows = await UserListPage.getUserRows();
  await t.click(userRows[0].row).wait(2000);
  await t.expect(UserInfoPage.heading.innerText).eql('admin');
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to assign and unassign user roles using Update Role Modal', async (t) => {
  const userRows = await UserListPage.getUserRows();
  await t.click(userRows[0].row).wait(2000);
  await t.click(UserInfoPage.updateRolesButton).wait(2000);
  const assignableRoleRows = await UserInfoPage.getAssignableRolesRows();

  // There are two roles configured for the `role-assignment-service`
  await t.expect(assignableRoleRows.length).eql(2);
  await t.click(assignableRoleRows[0].checkBox).wait(2000);
  await t.click(assignableRoleRows[1].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateRolesButton).wait(2000);

  // Check the roles are now in the assigned table
  const assignedRoleRows = await UserInfoPage.getAssignedRolesRows();
  await t.expect(assignedRoleRows.length).eql(2);

  await t.click(UserInfoPage.updateRolesButton).wait(2000);
  await t.expect(assignableRoleRows.length).eql(2);
  await t.click(assignableRoleRows[0].checkBox).wait(2000);
  await t.click(assignableRoleRows[1].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateRolesButton).wait(2000);

  // Check the roles are now removed from the assigned table
  const assignedRoleRowsTwo = await UserInfoPage.getAssignedRolesRows();
  await t.expect(assignedRoleRowsTwo.length).eql(0);
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to unassign user roles using corresponding Remove button', async (t) => {
  const userRows = await UserListPage.getUserRows();
  await t.click(userRows[0].row).wait(2000);
  await t.click(UserInfoPage.updateRolesButton).wait(2000);
  const assignableRoleRows = await UserInfoPage.getAssignableRolesRows();

  // There are two roles configured for the `role-assignment-service`
  await t.expect(assignableRoleRows.length).eql(2);
  await t.click(assignableRoleRows[0].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateRolesButton).wait(2000);

  // Check the role is now in the assigned table
  const assignedRoleRows = await UserInfoPage.getAssignedRolesRows();
  await t.expect(assignedRoleRows.length).eql(1);
  await t.click(assignedRoleRows[0].removeRoleButton).wait(2000);

  // Check the role is now removed from the assigned table
  const assignedRoleRowsTwo = await UserInfoPage.getAssignedRolesRows();
  await t.expect(assignedRoleRowsTwo.length).eql(0);
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to assign and unassign user companies using Update Company Modal', async (t) => {
  const userRows = await UserListPage.getUserRows();
  await t.click(userRows[0].row).wait(2000);
  await t.click(UserInfoPage.updateCompaniesButton).wait(2000);
  const assignableCompanyRows = await UserInfoPage.getAssignableCompaniesRows();

  // There is one default participant company in the the ledger
  await t.expect(assignableCompanyRows.length).eql(1);
  await t.click(assignableCompanyRows[0].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateCompaniesButton).wait(2000);

  // Check the companies are now in the assigned table
  const assignedCompanyRows = await UserInfoPage.getAssignedCompaniesRows();
  await t.expect(assignedCompanyRows.length).eql(1);

  await t.click(UserInfoPage.updateCompaniesButton).wait(2000);
  await t.expect(assignableCompanyRows.length).eql(1);
  await t.click(assignableCompanyRows[0].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateCompaniesButton).wait(2000);

  // Check the companies are now removed from the assigned table
  const assignedCompanyRowsTwo = await UserInfoPage.getAssignedCompaniesRows();
  await t.expect(assignedCompanyRowsTwo.length).eql(0);
});

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('Able to unassign user companies using corresponding Remove button', async (t) => {
  const userRows = await UserListPage.getUserRows();
  await t.click(userRows[0].row).wait(2000);
  await t.click(UserInfoPage.updateCompaniesButton).wait(2000);
  const assignableCompanyRows = await UserInfoPage.getAssignableCompaniesRows();

  // There is one default participant company in the the ledger
  await t.expect(assignableCompanyRows.length).eql(1);
  await t.click(assignableCompanyRows[0].checkBox).wait(2000);
  await t.click(UserInfoPage.modalUpdateCompaniesButton).wait(2000);

  // Check the role is now in the assigned table
  const assignedCompanyRows = await UserInfoPage.getAssignedCompaniesRows();
  await t.expect(assignedCompanyRows.length).eql(1);
  await t.click(assignedCompanyRows[0].removeCompanyButton).wait(2000);

  // Check the role is now removed from the assigned table
  const assignedCompanyRowsTwo = await UserInfoPage.getAssignedCompaniesRows();
  await t.expect(assignedCompanyRowsTwo.length).eql(0);
});
