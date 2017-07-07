import React, { Component } from 'react';
import {
  Layout,
  Input,
  Spin,
  Button
} from 'antd';
import {
  // createPaginationContainer, 
  createRefetchContainer,
  graphql
} from 'react-relay'
import './App.css';
import UserListItem from '../../components/UserListItem'

const { Header, Content, Footer } = Layout;

class App extends Component {

  state = {
    searchText: '',
    loading: false,
    pageSize: 10
  }

  componentDidMount () {
  }

  handleInputChange = (searchText) => {
    
    this.setState({loading: true});
    const refetchVariables = fragmentVariables => ({
      count: 10,
      query: searchText
    });
    this.props.relay.refetch(refetchVariables, null, () => {
        this.setState({
          searchText,
          pageSize: 10,
          loading: false
        });
    });
  }

  handleShowMoreButton = (e) => {
    e.preventDefault()
    this._loadMore();
  }

  _loadMore () {
    this.setState({loading: true});
    const refetchVariables = fragmentVariables => ({
      count: this.state.pageSize + 10,
      query: this.state.searchText
    });
    this.props.relay.refetch(refetchVariables, null, () => {
        this.setState({
          pageSize: this.state.pageSize + 10,
          loading: false
        });
    });
  }

  render () {
    const { data: { search: { edges: users, userCount } } } = this.props;
    const { searchText, loading, pageSize } = this.state;
    return (
      <Layout style={{minHeight: '100%'}}>
        <Header/>
        <Content className="App-main">
          <div className="App-main-content">
            <div className="App-main-content-toolbar">
              <Input.Search defaultValue={searchText} onSearch={this.handleInputChange}/>
            </div>
            <div className="App-main-content-users">
              {
                (userCount > 0) ? 
                <Spin spinning={loading}>
                  {users.map(({node}, index) => <UserListItem key={index} user={node}/>)}
                </Spin> :
                <div className="no-data-container">
                  <span className="App-main-content-users-no">{searchText ? 'Please input other world' : 'Please input some world'}</span>
                </div>
              }
            </div>
            {
              (userCount > pageSize) && (
                <div className="App-main-content-loader">
                  <Button onClick={this.handleShowMoreButton}>Show More ...</Button>
                </div>
              )
            }
            
          </div>
        </Content>
        <Footer className="App-footer">
          <span><b>E-Mail: </b></span><span>xyy94813@sina.com</span>
        </Footer>
      </Layout>
    )
  }
}
/**
 * TODO Load More Use PaginationContainer 
 */
export default createRefetchContainer(
  App,
  {
    data: graphql.experimental`
      fragment App_data on Query
      @argumentDefinitions(
        count: {type: "Int!", defaultValue: 10},
        query: {type: "String!", defaultValue: ""}
      ) {
        search(query:$query, first: $count, type: USER) @connection(key: "UserList_search") {
          userCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              ... on User {
                ...UserListItem_user
              }
            }
          }
        }
      }
    `
  },
  graphql.experimental`
    query AppRefetchQuery($count: Int!, $query: String!) {
      ...App_data @arguments(count: $count, query: $query)
    }
  `,
);