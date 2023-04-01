import './myAccount.scss';
const  RepoList= () => {
    const [repos,setRepos]=[[{'title':'Repo-1','content':'Mental Health with AI'},{
      'title':'Repo-2','content':'Cuisine Heist'},      
    ],null];
    //console.log(repos)
    return (<div className="grid">
    {repos.map(repo=>(
      <div className="card">
      <div className="card-header">
        <h3 className="card-title">{repo.title}</h3>
      </div>
      <div className="card-body">
        <p>{repo.content}</p>
      </div>
    </div>  
    ))}
    
  </div>);
}
 
export default RepoList;