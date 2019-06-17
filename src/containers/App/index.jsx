import React, { Component } from 'react';
import {
  Layout,
  Input,
} from 'antd';
import './App.css';
import UserList from '../../components/UserList'

const { Header, Content, Footer } = Layout;

class App extends Component {

  state = {
    searchText: 'xyy94813',
  }

  handleInputChange = (value) => {
    this.setState((preState) => {
      if (preState.searchText !== value) {
        return {
          searchText: value,
        }
      }
    })
  }

  render () {

    const {
      searchText
    } = this.state

    return (
      <Layout className="App">
        <Header>
          <h1 className="App-header-title">github-graphql-react-relay-example</h1>
        </Header>
        <Content className="App-main">
          <div className="App-main-content">
            <div className="App-main-content-toolbar">
              <Input.Search defaultValue={searchText} onSearch={this.handleInputChange} enterButton/>
            </div>
            <div className="App-main-content-data">
              <UserList searchText={searchText}/>
            </div>
          </div>
        </Content>
        <Footer className="App-footer">
          <span><b>E-Mail: </b></span><span>xyy94813@sina.com</span>
        </Footer>
      </Layout>
    )
  }
}

export default App