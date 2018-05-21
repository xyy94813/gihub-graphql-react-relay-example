import React from "react";
import _ from 'lodash'
import { Row, Col, Modal, List, Avatar, Divider, Icon, Spin } from "antd";
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay";

import UserDetails from "../../containers/UserDetails";
import modernEnvironment from "../../createRelayEnvironment";

const { Item: ListItem } = List
const { Meta: ListItemMeta } = ListItem

function renderDetails({ error, props }) {
  if (error) {
    return <div>{error.message}</div>;
  } else if (props) {
    return <UserDetails user={props.user} />;
  } else {
    return <Spin><div style={{ minHeight: 200 }}/></Spin>;
  }
}

function getClickHandler(login) {
  return e => {
    e.stopPropagation()
    Modal.info({
      title: "User Details",
      width: 800,
      content: (
        <QueryRenderer
          environment={modernEnvironment}
          query={graphql`
            query UserListItemQuery($login: String!) {
              user(login: $login) {
                ...UserDetails_user
              }
            }
          `}
          variables={{ login }}
          render={renderDetails}
        />
      )
    });
  };
}

function UserListItem(props) {

  const { user } = props;

  const avatarUrl = _.get(user, 'avatarUrl')
  const login = _.get(user, 'login')
  const name = _.get(user, 'name')
  const location = _.get(user, 'location')
  const email = _.get(user, 'email')
  const url = _.get(user, 'url')

  return (
    <ListItem
      actions={[
        <a onClick={getClickHandler(login)}>more</a>
      ]}
    >
      <ListItemMeta
        avatar={<Avatar src={avatarUrl} alt="avatarUrl" size="large" shape="square" />}
        title={
          <div>
            <a href={url} target="__blank">{login}</a>
            { name && <Divider type="vertical"/> }
            { name && <span>{name}</span> }
          </div>
        }
        description={
          <Row type="flex" gutter={10}>
            <Col>
              <Icon type="mail" style={{marginRight: 5}}/>
              <span>{email || "none"}</span>
            </Col>
            <Col>
              <Icon type="environment" style={{marginRight: 5}}/>
              <span>{location || "none"}</span>
            </Col>
            <Col> 
              <Icon type="link" style={{marginRight: 5}}/>
              <a href={url} target="__blank"> {url}</a>
            </Col>
          </Row>
        }
      />
      {null}
    </ListItem>
  );
}

export default createFragmentContainer(
  UserListItem,
  graphql`
    fragment UserListItem_user on User {
      avatarUrl
      login
      name
      location
      email
      url
    }
  `
);
