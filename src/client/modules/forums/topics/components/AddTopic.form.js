/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

import React from 'react';
import {connect} from "react-redux";


import TopicsService from './../../../../services/REST/forums/topics/Topics.service';
import ContentService from './../../../../services/REST/forums/content/Content.service';

import AutoCompleteSelect from '../../../../components/util-components/select/AutoComplete.select.component';
import SearchAutoComplete from '../../../../components/util-components/select/SearchAutoComplete.select.component';
import MyCountrySelect from './../../../../../client/components/util-components/select/MyCountry.select.component';
import LoadingButton from '../../../../components/util-components/UI/buttons/LoadingButton.component';

import FileUploadDropzone from '../../../../../client/components/util-components/file-upload/dropzone/FileUploadDropzone.component';

//import LastDraft from '../../../../components/util-components/text-editor/last-draft/LastDraft.component';
import DraftWYSIWYG from '../../../../components/util-components/text-editor/wysiwyg/DraftWYSIWYG.component';
import PreviewNewTopic from './PreviewNewTopic.component';

import Topic from '../models/Topic.model';
import history from './../../../../../history.js';

class AddTopicForm extends React.Component {

  refSubmitButton = null;
  refPreviewNewTopic = null;

  constructor(props){
    super(props);

    this.state = {

      error: '',

      urlSlug:'',
      title : '',
      link : '',
      description : '',
      keywords : [],

      attachments: [],

      countryCode : '', country : '',
      city : '',
      language : '',
      latitude : 0, longitude : 0,

      titleValidationStatus : [null, ''],
      linkValidationStatus : [null, ''],
      descriptionValidationStatus : [null, ''],
      keywordsValidationStatus : [null, ''],
      countryValidationStatus : [null, ''],
      cityValidationStatus : [null, ''],


      parentId:'',
      parentName:'',
      parentValidationStatus: [null, ''],
    }

  }

  async handleAddTopic(e){

    if (typeof e !== "undefined") {
      e.preventDefault();
      e.stopPropagation();
    }

    let onSuccess = this.props.onSuccess || function (){};
    let onError = this.props.onError || function (){};

    let titleValidationStatus = [null, ''], linkValidationStatus =[null,''], descriptionValidationStatus = [null, ''], keywordsValidationStatus = [null, ''], countryValidationStatus = [null, ''], cityValidationStatus = [null, ''];

    let bValidationError=false;
    this.setState({
      error:'',
      titleValidationStatus: titleValidationStatus,
      linkValidationStatus: linkValidationStatus,
      descriptionValidationStatus: descriptionValidationStatus,
      keywordsValidationStatus: keywordsValidationStatus,
      countryValidationStatus: countryValidationStatus,
      cityValidationStatus: cityValidationStatus,
    });

    console.log('ADDing topic... ',this.refPreviewNewTopic);

    if (!bValidationError)
      try{
          let answer = await TopicsService.topicAdd(this.state.parentId||this.props.parentId, Topic.getTitle(this.refPreviewNewTopic.state.topic), Topic.getImage(this.refPreviewNewTopic.state.topic),  Topic.getDescription(this.refPreviewNewTopic.state.topic), this.state.attachments, Topic.getKeywords(this.refPreviewNewTopic.state.topic),
                                                    this.state.countryCode||this.props.localization.countryCode, '',
                                                    this.state.city||this.props.localization.city, this.state.latitude||this.props.localization.latitude, this.state.longitude||this.state.latitude)

          this.refSubmitButton.enableButton();

          console.log("ANSWER FROM adding forum",answer);

          if (answer.result === true) {
            onSuccess(answer);

              history.push(answer.topic.URL);// redirecting to the forum URL ;)
          }
          else
          if (answer.result === false) {

              if ((typeof answer.errors.title !== "undefined") && (Object.keys(answer.errors.title).length !== 0 )) titleValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.title[0])];
              if ((typeof answer.errors.link !== "undefined") && (Object.keys(answer.errors.link).length !== 0 )) linkValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.link[0])];
              if ((typeof answer.errors.description !== "undefined") && (Object.keys(answer.errors.description).length !== 0)) descriptionValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.description[0])];
              if ((typeof answer.errors.keywords !== "undefined") && (Object.keys(answer.errors.keywords).length !== 0)) keywordsValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.keywords[0])];
              if ((typeof answer.errors.country !== "undefined") && (Object.keys(answer.errors.country).length !== 0)) countryValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.country[0])];
              if ((typeof answer.errors.city !== "undefined") && (Object.keys(answer.errors.city).length !== 0)) cityValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.city[0])];


              //in case there are no other errors, except the fact that I am not logged In
              if ((typeof answer.errors.authorId !== "undefined") && (Object.keys(answer.errors.authorId).length !== 0))
              if ((titleValidationStatus[0] === null)&&(descriptionValidationStatus[0] === null)&&(keywordsValidationStatus[0] === null)&&(countryValidationStatus[0] === null)&&(cityValidationStatus[0] === null))
                this.openLogin();

              this.setState({
                titleValidationStatus: titleValidationStatus,
                linkValidationStatus: linkValidationStatus,
                descriptionValidationStatus: descriptionValidationStatus,
                keywordsValidationStatus: keywordsValidationStatus,
                countryValidationStatus: countryValidationStatus,
                cityValidationStatus: cityValidationStatus,
              });

              onError(answer);
          }
      }
      catch(Exception){
        this.refSubmitButton.enableButton();
        this.setState({error: "There was a internal problem publishing your Topic... Try again "+Exception.toString()});
      }


  }

  handleTitleChangeSelect(value){

    this.setState({
      title : value,
      titleValidationStatus  : [null, '']
    });

  }

  handleTitleChange(e){
    this.handleTitleChangeSelect(e.target.value);
  }

  async handleLinkChange(e){

    let sLink = e.target.value;

    this.setState({
      link: sLink,
    });

    try{
      let answer = await ContentService.getMetaUrl(sLink);
      let newAttachments =  this.state.attachments||[];

      console.log("handleLinkChange", answer);
      if (answer.result){

      }

      let bFound=false;
      for (let i=0; i<newAttachments.length; i++ )
        if (newAttachments[i].type === 'link'){
          newAttachments[i].url = sLink;
          newAttachments[i].img = (typeof answer.data !== "undefined" ? answer.data.image : '');
          newAttachments[i].title = (typeof answer.data !== "undefined" ? answer.data.title : '');
          newAttachments[i].description = (typeof answer.data !== "undefined" ? answer.data.description : '');
          newAttachments[i].keywords = (typeof answer.data !== "undefined" ? answer.data.keywords : '');
          bFound=true;
          break;
        }

      if (!bFound){
        newAttachments.push({
          type:'link',
          url: sLink,
          img: (typeof answer.data !== "undefined"? answer.data.image : ''),
          title: (typeof answer.data !== "undefined"? answer.data.title : ''),
          description: (typeof answer.data !== "undefined" ? answer.data.description : ''),
          keywords: (typeof answer.data !== "undefined" ? answer.data.keywords : ''),
        })
      }

      console.log("newAttachments",newAttachments);

      this.setState({
        attachments:newAttachments
      });

    }catch (Exception){
      this.setState({
        link: sLink,
        sError: Exception.toString(),
      });
      console.log("Error extracting Link Meta", Exception)
    }

  }

  handleDescriptionChange(value){
    this.setState({
      description : value,
      descriptionValidationStatus  : [null, '']
    });
  }

  handleParentChangeSelect(dataSelected){
    console.log('handleParentChangeSelect', );
    this.setState({
      parentId : dataSelected.value,
      parentName: dataSelected.label,
      parentValidationStatus: [null, ''],
    })
  }

  handleKeywordsSelect(value){
    this.setState({
      keywords : value,
      keywordsValidationStatus  : [null, '']
    });

    console.log("KEYWORDS SELECTED: " , value );
  }

  handleCountrySelect(val){
    this.setState({
      country : val.label,
      countryCode : val.value,

      countryValidationStatus  : [null, '']
    });

    console.log("values selected are:", val);
  }

  handleCityChange(e){
    this.setState({
      city : e.target.value,
      cityValidationStatus  : null, cityValidationStatusText : ''
    });
  }


  openLogin(){

    if (typeof this.props.routerState.refAuthenticationModal !== "undefined") {
      this.props.routerState.refAuthenticationModal.setOnSuccessEvent(::this.authenticationSuccessfully);
      this.props.routerState.refAuthenticationModal.openLogin();
    }
  }

  authenticationSuccessfully(resource){
    this.handleAddTopic();
  }

  fileUploadSuccess(type, name, url, thumbnail){

    let newAttachments =  this.state.attachments||[];
    newAttachments.push({
      type: 'file',
      typeFile: type,
      url: url,
      img: thumbnail,
      title: name,
    });

    this.setState({ attachments: newAttachments });//storing thew new attachments

  }

  fileUploadRemoved(type, name, url, thumbnail){

    let newAttachments =  this.state.attachments||[];
    for (let i=0; i<newAttachments.length; i++)
      if ((newAttachments[i].url === url)&&(newAttachments[i].typeFile===type)&&(newAttachments[i].title === name)&&(newAttachments[i]).img === thumbnail){
        newAttachments.splice(i,1);
        break;
      }
    //console.log("newAttachments",newAttachments);

    this.setState({ attachments: newAttachments });//storing thew new attachments
  }

  convertValidationErrorToString(error) {
    if (error === "notUnique") return "Already exists in the Database"; else
    if (error === "notEmpty") return "It's empty"; else
    if (error === "validateUsername") return " Invalid username"; else
    if (error === "validateKeywords") return " Too few keywords. Minimum 3";

    return error;
  }
  //https://www.w3schools.com/bootstrap/bootstrap_forms_inputs2.asp DOC
  showInputStatus(status){
    return status[0] === 'error' ? "has-error has-feedback" : (status[0] === 'success' ? "has-success has-feedback" : '');
  }
  showInputFeedback(status){
    return status[0] === 'error' ? "fa fa-remove form-control-feedback" : (status[0] === 'success' ?  "fa fa-check form-control-feedback" : '');
  }

  render() {



    return (

      <div className="col-sm-8 col-sm-offset-2" style={{padding:0}} >

        <div className="panel panel-success">

          <div className="panel-heading">
            <h2 style={{marginTop: 0}}>New <strong>Topic</strong> in {this.state.parentName||this.props.parentName||'Home'} </h2>
          </div>

          <div className="panel-body">

            <form onSubmit={::this.handleAddTopic} autoComplete="on">


              <div style={{paddingBottom: 20}}>
                <strong>Title:</strong>
                <div className={"input-group " + this.showInputStatus(this.state.titleValidationStatus)}  >

                  <span className="input-group-addon"><i className="fa fa-pencil"></i></span>

                  <AutoCompleteSelect autoFocus multi={false} controlId="nameSelect" className='border-focus-blue'  placeholder='title / subject'  value={this.state.title}  onSelect={::this.handleTitleChangeSelect} style={{zIndex:0}}  clearable={false} />

                  <span className={::this.showInputFeedback(this.state.titleValidationStatus)} style={{width:60, top:10}}></span>
                </div>
                <label className="error" >{this.state.titleValidationStatus[1]}</label> <br />
              </div>

              <div style={{paddingBottom: 20}}>
                <strong>Link:</strong>
                <div className={"input-group " + this.showInputStatus(this.state.linkValidationStatus)}  >

                  <span className="input-group-addon"><i className="fa fa-pencil"></i></span>

                  <input  type='text' className='form-control input' placeholder='title'  name="title" value={this.state.link} onChange={::this.handleLinkChange} />

                  <span className={::this.showInputFeedback(this.state.linkValidationStatus)} style={{width:60, top:10}}></span>
                </div>
                <label className="error" >{this.state.linkValidationStatus[1]}</label> <br />

                <FileUploadDropzone onSuccessNewAttachment={::this.fileUploadSuccess} onRemoveAttachment={::this.fileUploadRemoved} />

              </div>



              <strong>Description</strong>


                <DraftWYSIWYG onChange={::this.handleDescriptionChange} />

                <span className={::this.showInputFeedback(this.state.descriptionValidationStatus)}></span>

              <label className="error" >{this.state.descriptionValidationStatus[1]}</label> <br />



              <strong>Forum</strong>
              <div className={"input-group " + this.showInputStatus(this.state.parentValidationStatus)}  >

                <span className="input-group-addon"><i className="fa fa-edit"></i></span>

                <SearchAutoComplete multi={false} controlId="parentSelect" className='border-focus-blue'  placeholder='select a parent-forum'  value={ {label:this.state.parentName||this.props.parentName, value:this.state.parentId||this.props.parentId}}  onSelect={::this.handleParentChangeSelect} style={{zIndex:0}}  clearable={false} />

                <span className={::this.showInputFeedback(this.state.parentValidationStatus)}></span>
              </div>
              <label className="error" >{this.state.parentValidationStatus[1]}</label> <br />

              <strong>Preview</strong>

              <PreviewNewTopic title={this.state.title} image={this.state.image} description={this.state.description} attachments={this.state.attachments} keywords={this.state.keywords} authorId={this.props.userAuthenticated.user.id||''} ref={(c) => this.refPreviewNewTopic = c} />

              {/*
              <div className={"input-group " + this.showInputStatus(this.state.keywordsValidationStatus)}  >

                <span className="input-group-addon"><i className="fa fa-tags"></i></span>

                <AutoCompleteSelect controlId="keywordsSelect" value={this.state.keywords} multi={true}   onSelect={::this.handleKeywordsSelect} style={{zIndex:0}} placeholder="three keywords"/>

              </div>
              <label className="error" >{this.state.keywordsValidationStatus[1]}</label> <br />


              <div className="row" >

                <div className="col-sm-6">
                  <div className={"input-group " + this.showInputStatus(this.state.countryValidationStatus)}  >

                    <span className="input-group-addon"><i className="fa fa-flag"></i></span>

                    <MyCountrySelect initialCountry={this.props.localization.countryCode||''} onSelect={::this.handleCountrySelect}/>

                    <span className={::this.showInputFeedback(this.state.countryValidationStatus)}></span>
                  </div>
                  <label className="error" >{this.state.countryValidationStatus[1]}</label> <br />
                </div>

                <div className="col-sm-6" style={{paddingBottom: 5}}>
                  <div className={"input-group " + this.showInputStatus(this.state.cityValidationStatus)}  >

                    <span className="input-group-addon"><i className="fa fa-institution"></i></span>

                    <input type='text' className='form-control input' placeholder='city'  value={this.props.localization.city||this.state.city} onChange={::this.handleCityChange} />

                    <span className={::this.showInputFeedback(this.state.cityValidationStatus)}></span>
                  </div>
                  <label className="error" >{this.state.cityValidationStatus[1]}</label> <br />
                </div>

              </div>

               */}

              {this.state.error === '' ? '' :
                (
                  <div>
                    <div className="alert alert-danger alert-dismissable">
                      {this.state.error}
                    </div>
                  </div>
                )
              }

            </form>

          </div>

          <div className="panel-footer text-right" style={{paddingTop:20, paddingBottom:20, paddingRight:20}}>

            <LoadingButton className="btn-success" onClick={::this.handleAddTopic} text="Create Topic" icon="fa fa-plus"  ref={(c) => this.refSubmitButton = c}  />

          </div>

        </div>

      </div>


    );
  }
}


function mapState (state){
  return {
    userAuthenticated: state.userAuthenticated,
    routerState: state.routerState,
    localization: state.localization,
  }
};

function mapDispatch (dispatch) {
  return {
    dispatch : dispatch,
  }
};

export default connect(mapState, mapDispatch)(AddTopicForm);
