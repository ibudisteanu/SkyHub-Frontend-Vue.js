/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

import SocketService from '../../../communication/client-socket/ClientSocket.service';

class TopicsServiceClass {

  dispatch = null;

  constructor() {
  }

  startService(dispatch){
    this.dispatch = dispatch;
  }

  async topicAdd(sParentId, sTitle,  sImage, sDescription, arrAttachments, arrKeywords, sCountryCode, sLanguage, sCity, latitude, longitude) {


    try {

      //Using Promise
      let resData = await SocketService.sendRequestGetData("topics/add-topic",{parent : sParentId, title: sTitle, image:sImage, description: sDescription,
                                                                                      attachments: arrAttachments, keywords : arrKeywords,
                                                                                      country: sCountryCode, language:sLanguage, city : sCity, latitude: latitude, longitude : longitude});

      console.log('Answer from TOPIC ', resData);

      return resData;

    }
    catch (Exception){
      console.log("Exception adding a new topic",Exception);
      throw Exception;
    }

  }

  async getTopic(sId){

    //Using Promise
    return SocketService.sendRequestGetData("topics/get-topic",{id: sId});

  }

}

var TopicsService = new TopicsServiceClass();
export default TopicsService;
