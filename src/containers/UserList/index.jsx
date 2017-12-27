import React from 'react'
import _ from 'lodash'
import {
  createPaginationContainer, 
  graphql,
  QueryRenderer
} from 'react-relay'
import {
  Button,
  Spin
} from 'antd'

import modernEnvironment from "../../createRelayEnvironment";
import UserListItem from '../../components/UserListItem'
import './UserList.css'

const DEFAULT_PAGE_SIZE = 15

class UserList extends React.Component {
  
  defaultProps = {
    pageSize: DEFAULT_PAGE_SIZE
  }

  state = {
    loadMore: false,
    loading: false,
  }

  _loadMore = () => {
    if (this.state.loadMore) {
      return
    }
    this.setState({
      loadMore: true
    }, () => {
      this.props.relay.loadMore(DEFAULT_PAGE_SIZE, (error) => {
        this.setState({ loadMore: false })
        error && console.error(error)
      })
    })
  }

  showMoreButton () {
    if (this.props.relay.hasMore()) {
      return (
        <Button 
          onClick={this._loadMore}
          className="UserList-loadMore-button"
        >
          Load More
        </Button>
      )
    }
  }

  showFooterContent () {
    return (this.state.loadMore) ? <Spin /> : this.showMoreButton()
  }

  showNoDataContent () {

    return (
      <div className="no-data-container">
        <span className="UserList-content-users-no">{'No Users. Please input other keyworld!!'}</span>
      </div>
    )
  }

  render () {

    const {
      data
    } = this.props
    const userCount = _.get(data, 'users.userCount', 0)
    const users = _.get(data, 'users.edges', []).map((item) => item.node)
    return (
      <div>
        <div className="UserList-header">
          <span>
            User Count: {userCount}
          </span>
        </div>
        { (userCount) ? 
            users.map((item) => <UserListItem key={item.id} user={item}/>) : this.showNoDataContent() }
        <div className="UserList-footer">
          { this.showFooterContent() }
        </div>
      </div>
    )

  }

}

const QUERY = graphql`
  query UserListQuery ($count: Int, $cursor: String, $query: String!) {
    ...UserList
  }
`

const UserListContainer = createPaginationContainer(UserList, graphql`
  fragment UserList on Query  {
    users: search(first: $count, after: $cursor, query: $query, type: USER)
    @connection(key: "UserList_users") {
      edges {
        cursor,
        node {
          ...on User {
            id
          }
          ...UserListItem_user
        }
      }
      userCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`, {
  direction: 'forward',
  getConnectionFromProps(props) {
    return _.get(props, 'data.users', null)
  },
  getFragmentVariables(prevVars, totalCount) {
    return {
      ...prevVars,
      count: totalCount,
    };
  },
  getVariables(props, prevVars, fragmentVariables) {
    return {
      ...prevVars,
      query: fragmentVariables.query
    };
  },
  query: QUERY
})

function renderDetails({ error, props }) {
  if (error) {
    return <div>{error.message}</div>;
  } else if (props) {
    return <UserListContainer data={props} />;
  } else {
    return <Spin><div style={{ minHeight: 300}}/></Spin>
  }
}

export default function (_props) {

  const { query } = _props
  return (
    <QueryRenderer
      environment={modernEnvironment}
      query={QUERY}
      variables={{ 
        query,
        count: DEFAULT_PAGE_SIZE 
      }}
      render={renderDetails}
    />
  )

}