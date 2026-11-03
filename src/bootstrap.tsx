import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from 'components';
import ExportApp from './Injector';
import { AppMenu } from './Menu';

ReactDOM.render(
  <BrowserRouter>
    <Layout>
      <Layout.Content>
        <Layout.SideMenu>
          <AppMenu />
        </Layout.SideMenu>
        <Layout.Page>
          <ExportApp />
        </Layout.Page>
      </Layout.Content>
    </Layout>
  </BrowserRouter>,
  document.getElementById('root'),
);
