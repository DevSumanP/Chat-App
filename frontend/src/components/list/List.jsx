// import ChatLists from './chatList/ChatLists';
import './list.css';
import Userinfo from './userInfo/Userinfo';

import Header from './header/header';
import Conversations from './sidebar/Conversations';

const List = () => {
    return (
      <div className = 'list'>
        <Header/>
        <Conversations />
        <Userinfo/>
      </div>
    )
  }
  
  export default List
  