/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/12/2017.
 * (C) BIT TECHNOLOGIES
 */

import User from 'models/User/User.model';
import CookiesService from '../../cookies/cookies.service';
import FetchService from '../../communication/FetchService';

class AuthServiceClass {

    constructor() {
        console.log("      @@@ AUTH SERVICE CLASS");
    }

    startService(){

    }


    login(sEmailUserName, sPassword, authenticateStore, dispatch) {



    }

    loginProvidingUser(userJSON, sessionId, dispatch){


    }

    loginSession(sessionId, authenticateStore, dispatch){


    }

    register(sUsername, sEmailAddress, sPassword, sFirstName, sLastName, sCountry, sLanguage, sCity, sLatitude, sLongitude, iTimeZone){


    }

    registerOAuth(sSocialNetworkName,sSocialNetworkId, sAccessToken, sEmail, sFirstName, sLastName,sProfilePic, sCoverImage, sCountryCode, sLanguage, sCity, latitude, longitude, sShortBio, iAge, sGender, iTimeZone, bVerified) {


    }

    logout(dispatch){



    }

}


var AuthService = new AuthServiceClass();
export default AuthService;
