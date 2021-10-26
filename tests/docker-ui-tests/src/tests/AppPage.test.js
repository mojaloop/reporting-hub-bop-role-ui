import { Selector } from 'testcafe';
import UsersPage from '../page-objects/pages/UsersPage';
import data from '../data/user-data'

// eslint-disable-next-line no-undef
fixture('App Page').page(`${data.urls.PUBLIC_PATH}`);

test('App/User list Page loads successfully', async (t) => {
  const appContainer = Selector('.user-iam-app');
  const containerExists = await appContainer();
  await t.expect(containerExists).ok();
});

test('User Profile Page loads successfully', async (t) => {
  const appContainer = Selector('.user-iam-app');
  const containerExists = await appContainer();
  await t.expect(containerExists).ok();

  await t.click(UsersPage.adminRow);
  const userProfileHeading = Selector('.rc-heading');
  const headingExists = await userProfileHeading();
  await t.expect(headingExists.textContent).contains('admin');
});
