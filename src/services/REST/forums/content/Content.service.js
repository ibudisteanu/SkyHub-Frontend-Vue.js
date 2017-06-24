/**
 * Created by ERAZER-ALEX on 6/4/2017.
 */

import {setContentState_NewRouterObject_Action, setContentState_AddContentObjects_Action, setContentState_AddForumsObjects_Action} from '../../../../../my-redux/actions/ContentState.actions';

import Forum from '../../../../models/Forum/Forum.model';
import ContentObjectService from './ContentObject.service';

import FetchDataService from '../../../communication/FetchService';

class ContentServiceClass {

    contentState = null; //from redux store
    dispatch = null;
    bStarted = false;

    constructor(props){

      console.log("@@@@ ContentService - CREATE instance");

    }

    startService(dispatch, contentState ){
      this.dispatch = dispatch;
      this.contentState = contentState;
      this.bStarted=true;

      //console.log("@@@@ ContentService - STARTING Service", dispatch, contentState);
    }


    /*

     */

    processNewContent(newContentObjects, previousContentObjects){

      if (newContentObjects.constructor !== Array) newContentObjects = [newContentObjects];

      let toBeAdded = [];

      for (let i=0; i<newContentObjects.length; i++ ){

        let newObject = newContentObjects[i].object;

        let bFound=false;

        if ((previousContentObjects !== null) )
          for (let obj in previousContentObjects)
            if (newObject.id === obj.id){
              bFound=true;
              break;
            }

        if ((!bFound)&&(newObject!==null)&&(newObject.id !== null)) {
          newObject = ContentObjectService.createObject(newObject);

          if (newObject !== null)
            toBeAdded.push(newObject);
        }

      }

      return toBeAdded;
    }

    async getObjectContent(sContentToSearchId){

      if (sContentToSearchId !== '')
        return await FetchDataService.sendRequestWithProtocol('content/get-content', {id: sContentToSearchId});
      else
        return {result: true, data: {content: null}};
    }


    getURLSlug(parent, name){
      return FetchDataService.sendRequestWithProtocol("content/get-URL-slug", {parent:parent, name: name} );
    }

    getMetaUrl(link){
      return FetchDataService.sendRequestWithProtocol("meta-extractor/extract-url", {link:link} );
    }

    /*
     FETCHING PARENT CONTENT (Topics)
    */

    async fetchTopContent(parent, pageIndex, pageCount){

      let answer = {result : false};

      answer = await FetchDataService.sendRequestWithProtocol( "content/get-top-content",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

      console.log("ANSWER TOP CONTENT",answer);

      let toBeAdded = [];
      if (answer.result === true){

        toBeAdded = this.processNewContent(answer.content, this.contentState.contentObjects.objects );

        if (toBeAdded !== [])
          await this.dispatch(setContentState_AddContentObjects_Action(toBeAdded ));

      }
      return toBeAdded;
    }

    /*
        FETCHING TOP CONTENT (Topics)
     */

    async fetchTopContent(parent, pageIndex, pageCount){

      let answer = {result : false};

      answer = await FetchDataService.sendRequestWithProtocol( "content/get-top-content",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

      console.log("ANSWER TOP CONTENT",answer);

      let toBeAdded = [];
      if ((typeof answer !== "undefined")&&(answer.result === true)){

        toBeAdded = this.processNewContent(answer.content, this.contentState.contentObjects.objects );

        if (toBeAdded !== [])
          await this.dispatch(setContentState_AddContentObjects_Action(toBeAdded ));

      }
      return toBeAdded;
    }


    /*
     FETCHING TOP FORUMS (Topics)
     */

    async fetchTopForums(parent, pageIndex, pageCount){

      let answer = {result : false};

      answer = await FetchDataService.sendRequestWithProtocol( "forums/get-top-forums",{parent: parent, pageIndex:pageIndex, pageCount: pageCount} );

      console.log("ANSWER TOP FORUMS", answer);
      console.log("redux state",this.contentState);

      let toBeAdded = [];
      if ((typeof answer !== "undefined")&&(answer.result === true)) {

        toBeAdded = this.processNewContent(answer.content, this.contentState.contentForums.objects );

        if (toBeAdded !== [])
          await this.dispatch(setContentState_AddForumsObjects_Action(toBeAdded ));

      }
      return toBeAdded;
    }




    /*
      IT WILL FETCH THE DATA from the BACKEND AND STORE THE ANSWER IN THE REDUX
     */

    async fetchRouterObjectAndContent(sContentToSearchId){

      if (!this.bStarted) return null;

      let routerObjectAnswer = {result : false}; routerObjectAnswer = await this.getObjectContent(sContentToSearchId);

      console.log("ANSWER FOR ", sContentToSearchId, routerObjectAnswer);

      if ((typeof routerObjectAnswer !== "undefined")&&(routerObjectAnswer.result === true)){

        let routerObject = routerObjectAnswer.content;

        let routerParentObjectAnswer = {result : false}; routerParentObjectAnswer = await this.getObjectContent( (typeof routerObject !== "undefined" ? routerObject.parent : ''));

        //extracting the parent
        let routerParentObject = null, routerParentObjectNotFound = true;
        if (routerParentObjectAnswer.result === true) {
          routerParentObject = routerParentObjectAnswer.content;
          routerParentObjectNotFound = false;
        }



        await this.dispatch(setContentState_NewRouterObject_Action( routerObject, false, sContentToSearchId, routerParentObject, routerParentObjectNotFound, 1, 8, [] ));

        await this.fetchTopForums(sContentToSearchId, 1, 8);
        await this.fetchTopContent(sContentToSearchId, 1, 8);

        return routerObjectAnswer.content;

      } else {

        await this.dispatch(setContentState_NewRouterObject_Action(null, true, sContentToSearchId, null, true, 1, 8, [] ));
      }

      return null;

    }

}

var ContentServiceInstance = new ContentServiceClass();

export default ContentServiceInstance;
