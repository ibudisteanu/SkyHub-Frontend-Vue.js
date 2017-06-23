/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/21/2017.
 * (C) BIT TECHNOLOGIES
 */

import SocketService from './socket/Socket.service';
import HTTPService   from './http/Http.service';

//import { Configuration } from '../app.constants';

class FetchDataServiceClass {

  //it is async
  sendRequestWithProtocol(sRequestName, data, protocol){

    if (typeof protocol === "undefined")
      if (typeof window === "undefined") protocol = "http";

    if ((typeof protocol !== "undefined")&&(protocol === 'http')) return HTTPService.getRequest(sRequestName, data);
    else  return SocketService.sendRequestGetDataPromise(sRequestName,data);

  }

}

var FetchDataServiceInstance = new FetchDataServiceClass();

export default FetchDataServiceInstance;
