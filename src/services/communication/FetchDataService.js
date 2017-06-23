/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

import CommunicationService from 'communicationService';

//import { Configuration } from '../app.constants';

class FetchDataServiceClass {

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

}

var FetchDataServiceInstance = new FetchDataServiceClass();

export default FetchDataServiceInstance;
