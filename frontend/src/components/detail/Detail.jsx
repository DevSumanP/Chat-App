import { useState } from 'react';
import './detail.css';
import { useChatStore } from '../../zustand/chatStore';

const Detail = () => {
  const [checked, setChecked] = useState(false);
  const { user } = useChatStore();

  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleBlock = () =>{
    
  }
  return (
    <div className="contact-info">
      <div className="container">
        <div className="icon">
          <img src="./close.png" alt="" />
        </div>
        <span className="text">Contact info</span>
      </div>
      <div className="contact-header">
        <img src={user.avatar} alt="Profile" className="profile-picture" />
        <div className="info">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="divider-container"><div className='divider'></div></div>
      
      <div className="contact-details">
        <div className="about-info">
          <h3>About</h3>
          <p>{user.username} is a 3rd year student at the University of
            California, Berkeley. He is currently pursuing a Bachelors
            degree in Electrical Engineering and Computer Science.</p>
        </div>
        <div className="divider-container"><div className='divider'></div></div>
        <div className="media-links">
          <div className="content">
          <h3>Media, links and docs</h3>
          <div className="icon">
            <span>0</span>
            <img src="./CaretRight.png" alt="" />
          </div>
          </div>
       
          <img src="./bg.png" alt="Media" />
          <img src="./bg.png" alt="Media" />
          <img src="./bg.png" alt="Media" />
        </div>
        <div className="divider-container"><div className='divider'></div></div>
        <div className="notifications">
          <span>Mute Notifications</span>
          <div className="toggle-slider">
      <input
        type="checkbox"
        id="toggle"
        checked={checked}
        onChange={handleToggle}
      />
      <label htmlFor="toggle" className="slider" />
    </div>
        </div>
        <div className="divider-container"><div className='divider'></div></div>
        <div className="actions">
          <button className="block" onChange={handleBlock}>
            <img src="./FlagBanner.png" alt="" />
            Block</button>
          <button className="delete">
            <img src="./Trash.png" alt="" />
            Delete</button>
        </div>
      </div>
    </div>
  )
}

export default Detail
