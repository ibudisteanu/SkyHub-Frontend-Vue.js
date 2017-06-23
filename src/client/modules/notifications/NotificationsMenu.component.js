import React from "react";
import Notification from "./models/Notification.model";

function RenderNotifications (props){

  const listNotifications =  props.notifications.map( (notification) =>

    <div>
      <li key={notification.id}>
        <div className="dropdown-messages-box">
          <a href="profile.html" className="pull-left">
            <img alt="image" className="img-circle" src="http://webapplayers.com/inspinia_admin-v2.7.1/img/a7.jpg" />
          </a>
          <div>

            <small className="pull-right">46h ago</small>
            <strong>dddd
            </strong> started following <strong>{notification.destinationId}</strong>. <br/>
            <small className="text-muted">{notification.dtCreation}</small>
          </div>
        </div>
      </li>
      <li className="divider"></li>
    </div>
  );

  return(
    <div>
      {listNotifications}
    </div>
  );
}


export default class NotificationMenu  extends React.Component {


  componentDidMount() {
    requestAnimationFrame(() => { //Make sure it is on client only


      }
    );
  }



  render() {


      let notification1 = new Notification({
        body: '3323',
        destinationId: '2145',
        senderId: '4151251',
        description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
        id: '425151',
        dtCreation: '23/jan/1987',
        template: '',
        title: 'so such a lovly twist'
      });
      let notification2 = new Notification({
        body: '3323',
        destinationId: '2145',
        senderId: '4151251',
        description: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ',
        id: '425151ssss',
        dtCreation: '23/jan/1987',
        template: '',
        title: 'so such a lovly twist'
      });

      const notifications = [notification1,notification2];



     return (
       <li key="notificationMenu" className="dropdown">

         <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
           <i className="fa fa-envelope"></i>  <span className="label label-warning">16</span>
         </a>
         <ul className="dropdown-menu dropdown-messages">

             <RenderNotifications notifications={notifications} />

          </ul>
       </li>
       );


    }




}
