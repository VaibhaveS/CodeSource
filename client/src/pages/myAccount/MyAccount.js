import React from 'react';
import AccountDetails from '../../Components/myAccountComponents/AccountDetails';
import RepoList from '../../Components/myAccountComponents/RepoList';

const MyAccount = ({ user }) => {
  return (
    <div className="container-myAccount">
      {user && <AccountDetails user={user} />}
      {user && <RepoList user={user} />}
    </div>
  );
};

export default MyAccount;
