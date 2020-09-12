import React, { PureComponent } from "react";
import _ from "lodash";
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay";
import { List, Avatar, Divider, Icon, Row, Col, Modal } from "antd";

import LinkButton from "../LinkButton";
import ModalContainer from "../ModalContainer";
import UserDetails from "../UserDetails";
import QueryRendererWrapper from "../QueryRendererWrapper";

import "./UserList.css";

const { Item: ListItem } = List;
const { Meta: ListItemMeta } = ListItem;

class UserList extends PureComponent {
  $userDetailsModalContainer = React.createRef();

  renderItem = (record) => {
    const avatarUrl = _.get(record, "avatarUrl");
    const login = _.get(record, "login");
    const name = _.get(record, "name");
    const location = _.get(record, "location");
    const email = _.get(record, "email");
    const url = _.get(record, "url");

    const handleMoreBtnClick = (e) => {
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
            environment={this.props.relay.environment}
            query={graphql`
              query UserListUserDetailsModalQuery($login: String!) {
                data: relay {
                  user(login: $login) {
                    id
                    ...UserDetails_user
                  }
                }
              }
            `}
            variables={{ login: username }}
            render={QueryRendererWrapper((props) => (
              <UserDetails user={props.data.user} />
            ))}
          />
        )}
      </Modal>
    );
  };

  render() {
    const { data, realy, ...otherProps } = this.props;

    return (
      <>
        <List
          {...otherProps}
          dataSource={data}
          renderItem={this.renderItem}
          locale={{
            emptyText: "No Users. Please input other keyworld!!",
          }}
        />
        <ModalContainer ref={this.$userDetailsModalContainer}>
          {this.renderUserDetailsModal}
        </ModalContainer>
      </>
    );
  }
}

const UserListContainer = createFragmentContainer(UserList, {
  data: graphql`
    fragment UserList_data on User @relay(plural: true) {
      id
      avatarUrl
      login
      name
      location
      email
      url
    }
  `,
});

export default UserListContainer;
