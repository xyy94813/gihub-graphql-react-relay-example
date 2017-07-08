import React from 'react';
import {
    createFragmentContainer, 
    graphql
} from 'react-relay';
import {
    Tabs,
    Row,
    Col
} from 'antd';

import RepositoryListItem from '../../components/RepositoryListItem';

const TabPane = Tabs.TabPane;

function UserDetails (props) {
    const { user: {
        
        repositories,
        starredRepositories,
        ...other
    } } = props;
    return (
        <div>
            <Row gutter={15}>
                {
                    Object.entries(other).map(item => {
                        const [key, val] = item;
                        return val && (
                            <Col span={12}>
                                <span><b>{key}: </b></span>
                                <span>{val}</span>
                            </Col>
                        )
                    })
                }
            </Row>
            <Row>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={`repositories-[${repositories.totalCount}]`} key="1">
                        {repositories.edges.map(item => <RepositoryListItem repository={item.node} />)}
                    </TabPane>
                    <TabPane tab={`starredRepositories-[${starredRepositories.totalCount}]`} key="2">
                        {starredRepositories.edges.map(item => <RepositoryListItem repository={item.node} />)}
                    </TabPane>
                </Tabs>
            </Row>
        </div>
    );
}

export default createFragmentContainer(
    UserDetails,
    graphql`
        fragment UserDetails_user on User {

            login
            name
            email
            websiteUrl
            company
            createdAt
            location

            starredRepositories(first: 100) {
                totalCount
                edges {
                    node {
                        ...RepositoryListItem_repository
                    }
                }
            }

            repositories(first: 100) {
                totalCount
                edges {
                    node {
                        ...RepositoryListItem_repository
                    }
                }
            }
        }
    `
);
