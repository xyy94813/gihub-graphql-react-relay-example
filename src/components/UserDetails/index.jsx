import React from "react";
import { createFragmentContainer, graphql } from "react-relay";
import { Tabs, Badge, Row, Col } from "antd";
import _ from "lodash";

import RepositoryList from "../RepositoryList";

const TabPane = Tabs.TabPane;

function getEdgeNode(edge) {
  return edge.node;
}

function UserDetails({ user }) {
  const otherVals = _.omit(user, ["repositories", "starredRepositories"]);
  return (
    <div>
      <Row gutter={15}>
        {_.map(
          otherVals,
          (val, key) =>
            val && (
              <Col key={key} span={12}>
                <span>
                  <b>{key}: </b>
                </span>
                <span>{val}</span>
              </Col>
            )
        )}
      </Row>
      <Row>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <div>
                Repositories&nbsp;
                <Badge count={_.get(user, "repositories.totalCount")} />
              </div>
            }
            key="1"
          >
            <RepositoryList
              data={_.map(_.get(user, "repositories.edges"), getEdgeNode)}
              pagination={{
                pageSize: 5,
              }}
            />
          </TabPane>
          <TabPane
            tab={
              <div>
                Starred Repositories&nbsp;
                <Badge count={_.get(user, "starredRepositories.totalCount")} />
              </div>
            }
            key="2"
          >
            <RepositoryList
              data={_.map(
                _.get(user, "starredRepositories.edges"),
                getEdgeNode
              )}
              pagination={{
                pageSize: 5,
              }}
            />
          </TabPane>
        </Tabs>
      </Row>
    </div>
  );
}

export default createFragmentContainer(UserDetails, {
  user: graphql`
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
            ...RepositoryList_data
          }
        }
      }
      repositories(first: 100) {
        totalCount
        edges {
          node {
            ...RepositoryList_data
          }
        }
      }
    }
  `,
});
