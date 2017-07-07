import React from 'react';
// import {createFragmentContainer, graphql} from 'react-relay';

function UserDetails (props) {
    const { user: {
        login,
        name,
        email,
        websiteUrl,
        company,
        createdAt,
        location
    } } = props;
    return (
        <div>
            <p>{login}</p>
            <p>{name}</p>
            <p>{email}</p>
            <p>{websiteUrl}</p>
            <p>{company}</p>
            <p>{createdAt}</p>
            <p>{location}</p>
        </div>
    );
}

export default UserDetails;
