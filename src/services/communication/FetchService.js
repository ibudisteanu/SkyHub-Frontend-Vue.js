/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

//loading the communication protocol
import CommunicationService from 'communicationService';

//import { Configuration } from '../app.constants';

class FetchServiceClass {

  constructor(){
    CommunicationService.startService();
  }

  //it is async
  sendRequestGetData(sRequestName, data, type){

    return CommunicationService.sendRequestGetData(sRequestName, data);

    // if (typeof type === "undefined")
    //   if (typeof window === "undefined") protocol = "server";
    //   else protocol = "client";
    //
    // if ((typeof protocol !== "string")&&(protocol === 'http')) return HTTPService.sendRequestGetData(sRequestName, data);
    // else  return SocketService.sendRequestGetData(sRequestName,data);
  }


  sendRequestGetData(sRequestName, data){
    return CommunicationService.sendRequestGetData()
  }

}

var FetchServiceInstance = new FetchServiceClass();
export default FetchServiceInstance;
