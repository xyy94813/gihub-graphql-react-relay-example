import React, { PureComponent } from "react";
import { createFragmentContainer, graphql } from "react-relay";
import { Avatar, Divider, Icon, List } from "antd";
import _ from "lodash";

class RepositoryList extends PureComponent {
  renderItem = (record) => {
    const title = (
      <>
        <a
          href={_.get(record, "url")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{_.get(record, "name")}</strong>
        </a>
        <Divider type="vertical" />
        <span>
          <Icon type="star" theme="filled" />
          &nbsp;
          {_.get(record, "stargazers.totalCount")}
        </span>
        <Divider type="vertical" />
        <span>
          <Icon type="fork" />
          &nbsp;
          {_.get(record, "forkCount")}
        </span>
        <Divider type="vertical" />
        <span>{_.get(record, "licenseInfo.name") || "No License"}</span>
      </>
    );
    return (
      <List.Item>
        <List.Item.Meta
          title={title}
          avatar={<Avatar>R</Avatar>}
          description={_.get(record, "description")}
        />
      </List.Item>
    );
  };
  render() {
    const { data, relay, ...otherProps } = this.props;
    return (
      <List {...otherProps} dataSource={data} renderItem={this.renderItem} />
    );
  }
}

export default createFragmentContainer(RepositoryList, {
  data: graphql`
    fragment RepositoryList_data on Repository @relay(plural: true) {
      name
      url
      description
      diskUsage
      forkCount
      id
      licenseInfo {
        id
        name
      }
      stargazers {
        totalCount
      }
      watchers {
        totalCount
      }
    }
  `,
});
