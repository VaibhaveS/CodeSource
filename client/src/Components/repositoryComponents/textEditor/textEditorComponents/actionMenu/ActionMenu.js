import './ActionMenu.css';
import TrashIcon from '../../../../../assets/trash.svg';

const MENU_WIDTH = 150;
const MENU_HEIGHT = 40;

const ActionMenu = ({ position, actions }) => {
  const x = position.x - MENU_WIDTH / 2;
  const y = position.y - MENU_HEIGHT - 10;

  return (
    <div
      className="actionMenuWrapper"
      style={{
        top: y,
        left: x,
      }}
    >
      <div className="actionMenu">
        <span
          id="turn-into"
          className="actionMenuItem"
          role="button"
          tabIndex="0"
          onClick={() => actions.turnInto()}
        >
          Turn into
        </span>
        <span
          id="delete"
          className="actionMenuItem"
          role="button"
          tabIndex="0"
          onClick={() => actions.deleteBlock()}
        >
          <img src={TrashIcon} alt="Trash Icon" />
        </span>
      </div>
    </div>
  );
};

export default ActionMenu;
