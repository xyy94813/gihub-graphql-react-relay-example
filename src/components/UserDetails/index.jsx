import { useFragment, graphql } from "react-relay";
import { Tabs, Badge, Descriptions } from "antd";
import _ from "lodash";

import RepositoryList from "../RepositoryList";

const TabPane = Tabs.TabPane;

function getEdgeNode(edge) {
  return edge.node;
}

const userDetailsFragment = graphql`
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
  `

function UserDetails({ user }) {
  const data = useFragment(userDetailsFragment, user)
  const otherVals = _.omit(data, ["repositories", "starredRepositories"]);

  const repositoryConnection = data?.repositories
  const starredRepositoryConnection = data?.starredRepositories


  return (
    <>
      <Descriptions>
        {_.map(otherVals, (val, key) => <Descriptions.Item key={key} label={key}>{val}</Descriptions.Item>)}
      </Descriptions>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <div>
              Repositories&nbsp;
              <Badge count={repositoryConnection?.totalCount} />
            </div>
          }
          key="1"
        >
          <RepositoryList
            data={_.map(repositoryConnection?.edges, getEdgeNode)}
            pagination={{
              pageSize: 5,
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <div>
              Starred Repositories&nbsp;
              <Badge count={starredRepositoryConnection?.totalCount} />
            </div>
          }
          key="2"
        >
          <RepositoryList
            data={_.map(
              starredRepositoryConnection?.edges,
              getEdgeNode
            )}
            pagination={{
              pageSize: 5,
            }}
          />
        </TabPane>
      </Tabs>
    </>
  );
}

export default UserDetails;
