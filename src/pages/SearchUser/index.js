import React, { useState } from "react";
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay";
import { Button, Spin, Input, Statistic } from "antd";
import _ from "lodash";

import UserList from "../../components/UserList";
import QueryRendererWrapper from "../../components/QueryRendererWrapper";
import modernEnvironment from "../../createRelayEnvironment";
import "./index.less";

const DEFAULT_PAGE_SIZE = 15;

const SearchUser = ({ data, defaultSearchText, relay }) => {
  // const [searchText, setSearchText = defaultSearchText] = useState("xyy94813");
  const [loadMore, setLoadMore] = useState(false);

  const userCount = _.get(data, "users.userCount", 0);

  return (
    <>
      <div className="App-main-content-toolbar">
        <Input.Search
          defaultValue={defaultSearchText}
          onSearch={val => {
            if (relay.isLoading()) {
              return;
            }
            relay.refetchConnection(DEFAULT_PAGE_SIZE, () => {}, {
              query: val
            });
          }}
          enterButton
        />
      </div>
      <div className="SearchUser-list">
        <div className="SearchUser-list-header">
          <Statistic title="User Count" value={userCount} />
        </div>
        <UserList
          data={_.map(_.get(data, "users.edges"), item => item.node)}
          loadMore={
            <div className="SearchUser-list-footer">
              {loadMore ? (
                <Spin />
              ) : relay.hasMore() ? (
                <Button
                  onClick={e => {
                    if (loadMore) {
                      return;
                    }
                    setLoadMore(true);
                    relay.loadMore(DEFAULT_PAGE_SIZE, error => {
                      setLoadMore(false);
                      error && console.error(error);
                    });
                  }}
                >
                  Load More
                </Button>
              ) : null}
            </div>
          }
        />
      </div>
    </>
  );
};

const QUERY = graphql`
  query SearchUserQuery($count: Int, $cursor: String, $query: String!) {
    ...SearchUser_data
  }
`;

const SearchUserContainer = createPaginationContainer(
  SearchUser,
  {
    data: graphql`fragment SearchUser_data on Query {
      users: search(first: $count, after: $cursor, query: $query, type: USER) @connection(key: "UserList_users") {
        edges {
          cursor
          node {
            ...UserList_data
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
    }`
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return _.get(props, "data.users", null);
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, prevVars, fragmentVariables) {
      return {
        ...fragmentVariables,
        ...prevVars,
        ...props
      };
    },
    query: QUERY
  }
);

export default props => (
  <QueryRenderer
    environment={modernEnvironment}
    query={QUERY}
    variables={{
      query: props.defaultSearchText || "",
      count: DEFAULT_PAGE_SIZE
    }}
    render={QueryRendererWrapper(_props => (
      <SearchUserContainer {...props} data={_props} />
    ))}
  />
);
