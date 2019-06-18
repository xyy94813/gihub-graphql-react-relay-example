import React, { Component } from "react";
import { Layout } from "antd";
import SearchUser from "../../pages/SearchUser";

import "./App.css";

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout className="App">
        <Header>
          <h1 className="App-header-title">
            github-graphql-react-relay-example
          </h1>
        </Header>
        <Content className="App-main">
          <div className="App-main-content">
            <SearchUser defaultSearchText="xyy94813" />
          </div>
        </Content>
        <Footer className="App-footer">
          <span>
            <b>E-Mail: </b>
          </span>
          <span>xyy94813@sina.com</span>
        </Footer>
      </Layout>
    );
  }
}

export default App;
