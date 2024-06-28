import { auth } from '../../../../../backend/db/firebase';
import { useUserStore } from '../../../zustand/useUserStore';
import './userInfo.css';

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="item">
        <div className="top">
          <img className='profilePic' src={currentUser.avatar || './avatar.png'} alt="Profile" />
          <div className="texts">
            <span>{currentUser.username}</span>
            <p>{currentUser.email}</p>
          </div>
          <img className='logout' src="./logout.png" alt="Logout" onClick={()=> auth.signOut} />
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
