import React from 'react';
import { Layout } from 'antd';

const {  Header, Content, Footer } = Layout;

function BasicLayout({ children }) {
  return (
    <Layout className="App">
      <Header>
        <h1 className="App-header-title">github-graphql-react-relay-example</h1>
      </Header>
      <Content className="App-main">
        <div className="App-main-content">
          {children}
        </div>
      </Content>
      <Footer className="App-footer">
        <b>E-Mail: </b>
        <email>xyy94813@sina.com</email>
      </Footer>
    </Layout>
  );
}

export default React.memo(BasicLayout);
