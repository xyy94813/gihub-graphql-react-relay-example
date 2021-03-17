import { createFragmentContainer, graphql } from 'react-relay/legacy';
import { Avatar, Divider, Icon, List } from 'antd';
import _ from 'lodash';

const renderItem = (record) => {
  const title = (
    <>
      <a href={_.get(record, 'url')} target="_blank" rel="noopener noreferrer">
        <strong>{_.get(record, 'name')}</strong>
      </a>
      <Divider type="vertical" />
      <span>
        <Icon type="star" theme="filled" />
        &nbsp;
        {_.get(record, 'stargazers.totalCount')}
      </span>
      <Divider type="vertical" />
      <span>
        <Icon type="fork" />
        &nbsp;
        {_.get(record, 'forkCount')}
      </span>
      <Divider type="vertical" />
      <span>{_.get(record, 'licenseInfo.name') || 'No License'}</span>
    </>
  );
  return (
    <List.Item>
      <List.Item.Meta
        title={title}
        avatar={<Avatar>R</Avatar>}
        description={_.get(record, 'description')}
      />
    </List.Item>
  );
};

const RepositoryList = ({ data, relay, ...otherProps }) => (
  <List {...otherProps} dataSource={data} renderItem={renderItem} />
);

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
