import { useState } from 'react';
import AddUser from '../../../pages/user/addUser';
import './header.css';

const Header = () => {
  const [addMode, setAddMode] = useState(false);

  const handleCloseAddUser = () => {
    setAddMode(false);
  };

  return (
    <div>
      <div className='header'>
        <div className="title">
          <span>Chats</span>
        </div>
        <div className="icons">
          <img src="./add.png" alt="Add" onClick={() => setAddMode((prev) => !prev)} />
        </div>
      </div>
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="Search" />
          <input type="text" placeholder="Search for messages.." />
        </div>
      </div>
      {addMode && <AddUser onClose={handleCloseAddUser} />}
    </div>
  );
}

export default Header;
