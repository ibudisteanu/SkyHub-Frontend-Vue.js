/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */


import React from 'react';

import Chat from '../../../../../modules/chat/Chat';
import ChatStickyButton from '../../../../../modules/chat/ChatStickyButton.component';
import NotificationStickyButton from '../../../../../modules/notifications/NotificationStickyButton.component';

class StickyButtons extends React.Component {
  static propTypes = {

  };

  render() {

    let rightOffset = 20;

    return (
      <div >

       <NotificationStickyButton style={{right: rightOffset}}/>

       <Chat/>
       <ChatStickyButton style={{right: rightOffset + 50}}/>

      </div>
    )
  };
}

export default StickyButtons;
