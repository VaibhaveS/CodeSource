import '../../pages/explore/RepoList.css';
import { FaStar, FaCodeBranch, FaCircle, FaBook } from 'react-icons/fa';
const RepoCard = ({ eventDetails }) => {
  const randomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  };
  return (
    <div className="event-col">
      <div className="event-card repo-card" key={eventDetails._id}>
        <div className="event-header">
          <FaBook className="icon" /> &nbsp;
          <a
            href={`${process.env.REACT_APP_CLIENT_URL}/${eventDetails.owner.login}/${eventDetails.name}/repository`}
            className="repo-anchor"
          >
            {eventDetails.full_name}
          </a>
        </div>

        <p className="repo-description">{eventDetails.description}</p>
        <div>
          {eventDetails.topics && (
            <>
              <FaCircle style={{ color: randomColor() }} /> {eventDetails.topics[0]}{' '}
              &nbsp;&nbsp;&nbsp;
            </>
          )}{' '}
          <FaStar /> {eventDetails.stargazers_count} &nbsp;&nbsp;&nbsp; <FaCodeBranch />{' '}
          {eventDetails.forks}
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
