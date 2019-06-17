import React from "react";
import _ from "lodash";
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay";
import {
  Button,
  Statistic,
  List,
  Avatar,
  Divider,
  Icon,
  Spin,
  Row,
  Col,
  Modal
} from "antd";

import modernEnvironment from "../../createRelayEnvironment";
import LinkButton from "../LinkButton";
import ModalContainer from "../ModalContainer";
import UserDetails from "../UserDetails";

import "./UserList.css";

const { Item: ListItem } = List;
const { Meta: ListItemMeta } = ListItem;

const DEFAULT_PAGE_SIZE = 15;

class UserList extends React.Component {
  static defaultProps = {
    pageSize: DEFAULT_PAGE_SIZE
  };

  state = {
    loadMore: false,
    loading: false
  };

  $userDetailsModalContainer = React.createRef();

  _loadMore = () => {
    if (this.state.loadMore) {
      return;
    }
    this.setState(
      {
        loadMore: true
      },
      () => {
        this.props.relay.loadMore(DEFAULT_PAGE_SIZE, error => {
          this.setState({ loadMore: false });
          error && console.error(error);
        });
      }
    );
  };

  showMoreButton() {
    if (this.props.relay.hasMore()) {
      return (
        <Button onClick={this._loadMore} className="UserList-loadMore-button">
          Load More
        </Button>
      );
    }
  }

  showFooterContent() {
    return (
      <div className="UserList-footer">
        {this.state.loadMore ? <Spin /> : this.showMoreButton()}
      </div>
    );
  }
  renderItem = record => {
    const avatarUrl = _.get(record, "avatarUrl");
    const login = _.get(record, "login");
    const name = _.get(record, "name");
    const location = _.get(record, "location");
    const email = _.get(record, "email");
    const url = _.get(record, "url");

    const handleMoreBtnClick = e => {
      e.stopPropagation();
      this.setState({ user: record }, () => {
        this.$userDetailsModalContainer.current.show();
      });
    };

    return (
      <ListItem
        actions={[<LinkButton onClick={handleMoreBtnClick}>more</LinkButton>]}
      >
        <ListItemMeta
          avatar={
            <Avatar
              src={avatarUrl}
              alt="avatarUrl"
              size="large"
              shape="square"
            />
          }
          title={
            <div>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {login}
              </a>
              {name && <Divider type="vertical" />}
              {name && <span>{name}</span>}
            </div>
          }
          description={
            <Row type="flex" gutter={10}>
              <Col>
                <Icon type="mail" style={{ marginRight: 5 }} />
                <span>{email || "none"}</span>
              </Col>
              <Col>
                <Icon type="environment" style={{ marginRight: 5 }} />
                <span>{location || "none"}</span>
              </Col>
              <Col>
                <Icon type="link" style={{ marginRight: 5 }} />
                &nbsp;
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </Col>
            </Row>
          }
        />
        {null}
      </ListItem>
    );
  };

  renderUserDetailsModal = ({ visible, hide }) => {
    const username = _.get(this.state, "user.login");

    return (
      <Modal
        title="User Details"
        visible={visible}
        onCancel={hide}
        onOk={hide}
        width={800}
      >
        {username && (
          <QueryRenderer
            environment={modernEnvironment}
            query={graphql`
              query UserListUserDetailsModalQuery($login: String!) {
                user(login: $login) {
                  ...UserDetails_user
                }
              }
            `}
            variables={{ login: username }}
            render={({ error, props }) => {
              if (error) {
                return <div>{error.message}</div>;
              } else if (props) {
                return <UserDetails user={props.user} />;
              } else {
                return (
                  <Spin>
                    <div style={{ minHeight: 200 }} />
                  </Spin>
                );
              }
            }}
          />
        )}
      </Modal>
    );
  };

  render() {
    const { data } = this.props;
    const userCount = _.get(data, "users.userCount", 0);
    const users = _.map(_.get(data, "users.edges"), item => item.node);

    return (
      <div>
        <div className="UserList-header">
          <Statistic title="User Count" value={userCount} />
        </div>
        <List
          dataSource={users}
          renderItem={this.renderItem}
          locale={{
            emptyText: "No Users. Please input other keyworld!!"
          }}
          loadMore={this.showFooterContent()}
        />
        <ModalContainer ref={this.$userDetailsModalContainer}>
          {this.renderUserDetailsModal}
        </ModalContainer>
      </div>
    );
  }
}

const QUERY = graphql`
  query UserListQuery($count: Int, $cursor: String, $query: String!) {
    ...UserList
  }
`;

const UserListContainer = createPaginationContainer(
  UserList,
  graphql`
    fragment UserList on Query {
      users: search(first: $count, after: $cursor, query: $query, type: USER)
        @connection(key: "UserList_users") {
        edges {
          cursor
          node {
            ... on User {
              id
              avatarUrl
              login
              name
              location
              email
              url
            }
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
  `,
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

function renderDetails({ error, props }) {
  if (error) {
    return <div>{error.message}</div>;
  } else if (props) {
    return <UserListContainer data={props} />;
  } else {
    return (
      <Spin>
        <div style={{ minHeight: 300 }} />
      </Spin>
    );
  }
}

export default props => (
  <QueryRenderer
    environment={modernEnvironment}
    query={QUERY}
    variables={{
      query: props.searchText || "",
      count: DEFAULT_PAGE_SIZE
    }}
    render={renderDetails}
  />
);
