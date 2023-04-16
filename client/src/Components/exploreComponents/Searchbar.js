import { useState } from 'react';
import RepoCard from './repoCard';

const Searchbar = ({ repos }) => {
  const [repoName, setRepoName] = useState('');
  const [fetchedRepo, setFetchedRepo] = useState(null);
  const [repos, setRepos] = useState([
    { name: 'mental health with AI', owner: 'Satya' },
    { name: 'Instagram_Backend', owner: 'Ram' },
    { name: 'Lord of the Rings', owner: 'NV' },
  ]);
  console.log(repos);
  const accessDB = (query) => {
    repos.forEach((repo) => {
      if (repo.name == query) setFetchedRepo(repo);
    });
  };
  const fetchRepo = (e) => {
    e.preventDefault();
    const query = repoName;
    accessDB(query);
  };

  return (
    <div>
      {/* {console.log(repos)} */}
      <form onSubmit={fetchRepo}>
        <label>Enter Repository Name:</label>
        <input
          type="text"
          required
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
        <button>Browse</button>
      </form>
      <p>{repoName}</p>
      {fetchedRepo && <RepoCard eventDetails={fetchedRepo} />}
    </div>
  );
};

export default Searchbar;
