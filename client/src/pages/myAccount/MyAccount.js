import React from 'react';
import AccountDetails from '../../Components/myAccountComponents/AccountDetails';
import RepoList from '../../Components/myAccountComponents/RepoList';

const MyAccount = ({user}) => {
  return (
    <div>
      <div className="container">
        {user && <AccountDetails user={user}/>}
        {user && <RepoList user={user}/> }
      </div>
    </div>
  );
};

export default MyAccount;