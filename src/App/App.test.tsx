import React from 'react';
import { render } from 'test-utils';
import App from './App';

test('renders the app', () => {
  const { container } = render(<App />);
  const tabs = container.querySelectorAll('.user-iam-app');
  expect(Array.from(tabs)).not.toHaveLength(0);
});
