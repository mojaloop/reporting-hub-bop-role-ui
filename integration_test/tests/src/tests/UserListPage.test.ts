import { waitForReact } from 'testcafe-react-selectors';
import { config } from '../config';
import { SideMenu } from '../page-objects/components/SideMenu';
import { UserListPage } from '../page-objects/pages/UserListPage';

fixture `User List Feature`
  .page`${config.roleMicrofrontendEndpoint}`
  .beforeEach(async (t) => {
    await waitForReact();
    await t
      .click(SideMenu.usersButton).wait(1000);
  });

test.meta({
  ID: '',
  STORY: '',
  description: '',
})('User list retrieves users from wso2', async (t) => {

  // We should have an wso2 default admin user and however many specified in
  // ./integration_test/manifests/backend/users.json
  // We will primarily testing against the default admin user
  const rows = await UserListPage.getUserRows();
  await t.expect(rows.length).eql(3);

  await t.expect(rows[0].username.innerText).eql('admin')
  await t.expect(rows[0].emails.innerText).eql('admin@wso2.com')
  await t.expect(rows[0].name.innerText).eql('admin admin')
});
