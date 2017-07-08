import React from 'react';
import { 
    Row, 
    Col,
    Modal 
} from 'antd';
import {
    QueryRenderer,
    createFragmentContainer,
    graphql
} from 'react-relay';

import './UserListItem.css';
import UserDetails from '../../containers/UserDetails';
import modernEnvironment from '../../createRelayEnvironment';

function renderDetails ({error, props}) {
    if (error) {
        return <div>{error.message}</div>
    } else if (props) {
        return <UserDetails user={props.user}/>
    } else {
        return <div>Loading</div>
    }
}

function getClickHandler (login) {
    return (e) => {
        Modal.info({
            title: 'User Details',
            width: 800,
            content: <QueryRenderer
                environment={modernEnvironment}
                query={
                    graphql`
                        query UserListItemQuery ($login: String!) {
                            user(login: $login) {
                                ...UserDetails_user
                            }
                        }
                    `
                }
                variables={{login}}
                render={renderDetails}
            />
        });
    }
}

function UserListItem (props) {
    const {
        user: {
            avatarUrl,
            login,
            name,
            location,
            email,
            url
        } = {}
    } = props;
    return (
        <Row className="users-item" gutter={15} onClick={getClickHandler(login)}>
            <Col span={2}>
                <img src={avatarUrl} alt="avatarUrl" className="users-item-avatar" />
            </Col>
            <Col span={20}>
                <Row gutter={5} type="flex">
                    <Col><a><b>{login}</b></a></Col>
                    {name && <Col>/</Col>}
                    <Col>{name}</Col>
                </Row>
                <Row gutter={5} type="flex">
                    <Col><b>Location:</b></Col>
                    <Col><span>{location || 'none'}</span></Col>
                </Row>
                <Row gutter={5} type="flex">
                    <Col><b>E-MAIL:</b></Col>
                    <Col><span>{email || 'none'}</span></Col>
                </Row>
                <Row gutter={5} type="flex">
                    <Col><b>Git-Hub:</b></Col>
                    <Col><a href={url} target="__blank"><span>{url}</span></a></Col>
                </Row>
            </Col>
        </Row>
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