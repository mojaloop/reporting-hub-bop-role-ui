import { Selector } from 'testcafe';
import config from '../../config';
import UsersPage from '../page-objects/pages/UsersPage';

// eslint-disable-next-line no-undef
fixture('App Page').page(`${config.PUBLIC_PATH}`);

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
