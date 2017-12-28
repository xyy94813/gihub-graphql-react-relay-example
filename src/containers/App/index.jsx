import React, { Component } from 'react';
import {
  Layout,
  Input,
} from 'antd';
import './App.css';
// import UserListItem from '../../components/UserListItem'
import UserList from '../UserList'

const { Header, Content, Footer } = Layout;

class App extends Component {

  state = {
    searchText: 'xyy'
  }

  handleInputChange = (value) => {
    this.setState({ 
      searchText: value
    })
  }

  render () {

    const {
      searchText
    } = this.state

    return (
      <Layout className="App">
        <Header>
          <h1 className="App-header-title"><span>gihub-graphql-react-relay-example</span></h1>
        </Header>
        <Content className="App-main">
          <div className="App-main-content">
            <div className="App-main-content-toolbar">
              <Input.Search defaultValue={searchText} onSearch={this.handleInputChange} enterButton/>
            </div>
            <div className="App-main-content-data">
              <UserList query={searchText}/>
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