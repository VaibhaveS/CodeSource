import { Link } from 'react-router-dom';
import './myAccount.scss';

const AccountDetails = ({ user }) => {
  return (
    <div className="card-profile" data-state="#about">
      <div className="card-header">
        <img className="card-avatar" src={user.details.photos[0].value} alt="avatar" />
        <h2 className="card-jobtitle">It's about community.</h2>
      </div>
      <div className="card-main">
        <div className="card-section" id="about">
          <div className="card-content">
            <div className="card-subtitle">ABOUT</div>
            <p className="card-desc">{user.details._json.bio}</p>
          </div>
          <div className="card-social">
            <Link to={user.details.profileUrl}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 .297c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.11.82-.258.82-.577 0-.285-.01-1.04-.015-2.044-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.088-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.838 2.809 1.305 3.495.998.108-.776.419-1.305.763-1.605-2.665-.302-5.466-1.332-5.466-5.93 0-1.31.465-2.383 1.236-3.222-.124-.303-.536-1.523.116-3.176 0 0 1.008-.323 3.3 1.23.958-.267 1.98-.4 3-.405 1.02.005 2.042.138 3 .405 2.292-1.553 3.3-1.23 3.3-1.23.652 1.653.24 2.873.12 3.176.765.84 1.23 1.913 1.23 3.222 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.216 0 1.6-.015 2.886-.015 3.276 0 .315.21.688.825.576 4.762-1.585 8.195-6.085 8.195-11.387 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
