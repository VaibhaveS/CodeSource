import './App.css';
import Navbar from './Components/navbar/Navbar';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/homepage/Homepage';
import Events from './pages/events/Events';
import Explore from './pages/explore/Explore';
import MyAccount from './pages/myAccount/MyAccount';
import Footer from './Components/footer/Footer';
import Repository from './pages/repositoryPage/Repository';
import RepoList from './pages/repoList/RepoList';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = () => {
      fetch('http://localhost:3000/auth/login/success', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error('authentication has been failed!');
        })
        .then((resObject) => {
          console.log('got object', resObject);
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <>
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/myAccount" element={<MyAccount />} />
          <Route path=":username/:repositoryname/repository" element={<Repository />} />
          <Route path="/repoList" element={<RepoList />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
