import React from 'react';
import {
  createFragmentContainer, 
  graphql
} from 'react-relay';
import {
  Row,
  Col
} from 'antd';
import './RepositoryListItem.css';

function RepositoryListItem({repository}) {
  return (
    <Row className="repositories-item">
      <Col>
        <a href={repository.url}><h1>{repository.name}</h1></a>
      </Col>
      <Col>{repository.description}</Col>
    </Row>
  )
}

export default createFragmentContainer(
  RepositoryListItem,
  graphql`
    fragment RepositoryListItem_repository on Repository {
      name
      url
      description
    }
  `
)


