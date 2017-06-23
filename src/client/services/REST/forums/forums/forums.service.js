/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/26/2017.
 * (C) BIT TECHNOLOGIES
 */

import SocketService from '../../../../../services/Communication/socket/Socket.service';

class ForumsServiceClass {

    dispatch = null;

    constructor() {
    }

    startService(dispatch){
      this.dispatch = dispatch;
    }

    async forumAdd(sParentId, sName, sTitle, sDescription,  arrKeywords, sCountryCode, sLanguage, sCity, latitude, longitude, iTimeZone) {

      try{
         let resData = await SocketService.sendRequestGetDataPromise("forums/add-forum",{parent : sParentId, name:sName, title: sTitle, description: sDescription, keywords : arrKeywords,
                                                                 country: sCountryCode, language:sLanguage, city : sCity, latitude: latitude, longitude : longitude,  timeZone: iTimeZone});


          console.log('Answer from FORUM ', resData);

          return resData;

      }
      catch(Exception)
      {
        console.log("Exception adding a new forum", Exception);
        throw Exception;
      }

    }

    getForumAsync(sId){

            //Using Promise
        return SocketService.sendRequestGetDataPromise("forums/get-forum",{id: sId});

    }

}

var ForumsService = new ForumsServiceClass();
export default ForumsService;
