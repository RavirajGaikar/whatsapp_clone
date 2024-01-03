import React from 'react';

const getReceipentEmail = (users,userLoggedIn) =>
    users?.filter((userToFilter) => userToFilter!==userLoggedIn?.email)[0];

export default getReceipentEmail;
