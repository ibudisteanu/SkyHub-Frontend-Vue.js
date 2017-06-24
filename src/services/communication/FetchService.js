/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

//loading the communication protocol
import CommunicationService from 'communicationService';

//import { Configuration } from '../app.constants';

class FetchServiceClass {

  constructor(){
    //CommunicationService.startService();
  }

  //it is async
  sendRequestGetData(sRequestName, data){

    return CommunicationService.sendRequestGetData(sRequestName, data);

  }

  startService(dispatcher, data){
    CommunicationService.startService(dispatcher,data);
  }


}

var FetchServiceInstance = new FetchServiceClass();
export default FetchServiceInstance;
