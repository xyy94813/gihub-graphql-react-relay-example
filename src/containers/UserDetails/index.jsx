import React from "react";
import { createFragmentContainer, graphql } from "react-relay";
import { Tabs, Badge, Row, Col } from "antd";

import RepositoryListItem from "../../components/RepositoryListItem";

const TabPane = Tabs.TabPane;

function UserDetails(props) {
  const { user: { repositories, starredRepositories, ...other } } = props;
  return (
    <div>
      <Row gutter={15}>
        {Object.entries(other).map(item => {
          const [key, val] = item;
          return (
            val && (
              <Col key={key} span={12}>
                <span>
                  <b>{key}: </b>
                </span>
                <span>{val}</span>
              </Col>
            )
          );
        })}
      </Row>
      <Row>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <div>
                repositories&nbsp;<Badge count={repositories.totalCount} />
              </div>
            }
            key="1"
          >
            {repositories.edges.map((item, index) => (
              <RepositoryListItem key={index} repository={item.node} />
            ))}
          </TabPane>
          <TabPane
            tab={
              <div>
                starredRepositories&nbsp;<Badge
                  count={starredRepositories.totalCount}
                />
              </div>
            }
            key="2"
          >
            {starredRepositories.edges.map((item, index) => (
              <RepositoryListItem key={index} repository={item.node} />
            ))}
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
