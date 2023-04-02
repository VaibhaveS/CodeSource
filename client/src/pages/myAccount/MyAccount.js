import React from 'react';
import RepoList from './RepoList';
import AccountDetails from './AccountDetails';
import './myAccount.scss'

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
