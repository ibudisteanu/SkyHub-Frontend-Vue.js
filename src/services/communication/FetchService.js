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
    /*

        receivingSuffix it is only for websocks used, because the path it is the same for multiple simultaneously requests with different data and I couldn't make it working without a suffix in the socket path

     */
  sendRequestGetData(sRequestName, data, receivingSuffix){

    return CommunicationService.sendRequestGetData(sRequestName, data, receivingSuffix);

  }

  startService(dispatcher, storeState){
    CommunicationService.startService(dispatcher, storeState);
  }


}

var FetchServiceInstance = new FetchServiceClass();
export default FetchServiceInstance;
