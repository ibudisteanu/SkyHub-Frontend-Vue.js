/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div class="col-sm-8 col-sm-offset-2" style='padding:0' >

        <div class="panel panel-success">

            <div class="panel-heading">
                <h2 style='margin-top: 0'>New <strong>Topic</strong> in {{this.parentName||this.parentNameProp||'Home'}} </h2>
            </div>

            <div class="panel-body">

                <form @submit="this.handleAddTopic" autoComplete="on">


                    <div style="padding-bottom: 20px">
                        <strong>Title:</strong>
                        <div :class="'input-group ' + this.showInputStatus(this.titleValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-pencil"></i></span>

                            <AutoCompleteSelect autoFocus multi={false} controlId="nameSelect" class='border-focus-blue'  placeholder='title / subject'  :value="this.title"  :onSelect="this.handleTitleChangeSelect" style='z-index:0'  />

                            <span :class="this.showInputFeedback(this.titleValidationStatus)" style='width:60px; top:10px'></span>
                        </div>
                        <label class="error" >{{this.titleValidationStatus[1]}}</label> <br />
                    </div>

                    <div style="padding-bottom: 20px">
                        <strong>Link:</strong>
                        <div :class="'input-group ' + this.showInputStatus(this.linkValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-pencil"></i></span>

                            <input  type='text' class='form-control input' placeholder='title'  name="title" :value="this.link" @change="this.handleLinkChange" style='z-index:0' />

                            <span :class="this.showInputFeedback(this.linkValidationStatus)" style="width:60px; top:10px"></span>
                        </div>
                        <label class="error" >{{this.linkValidationStatus[1]}}</label> <br />

                        <FileUploadDropzone :onSuccessNewAttachment="this.fileUploadSuccess" :onRemoveAttachment="this.fileUploadRemoved" />

                    </div>



                    <strong>Description</strong>


                    <DraftWYSIWYG onChange="this.handleDescriptionChange" />

                    <span :class="this.showInputFeedback(this.descriptionValidationStatus)"></span>

                    <label class="error" >{{this.descriptionValidationStatus[1]}}</label> <br />



                    <strong>Forum</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.parentValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <SearchAutoComplete key="addForumParentSearch" :multi="false" dataSuggestion="parents" placeholder='select a parent-forum' :defaultValue="this.parentId||this.parentIdProp"  :defaultLabel="this.parentName||this.parentNameProp" :onSelect="handleParentChangeSelect" :clearable="false"/>

                        <span :class="this.showInputFeedback(this.parentValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.parentValidationStatus[1]}}</label> <br />

                    <strong>Preview</strong>

                    <PreviewNewTopic :title="this.title" description="this.description" :attachments="this.attachments" :keywords="this.keywords" :authorId="this.$store.state.authenticatedUser.user.id||''" ref="refPreviewNewTopic" />

                    <!--
                    <div class={"input-group " + this.showInputStatus(this.state.keywordsValidationStatus)}  >

                      <span class="input-group-addon"><i class="fa fa-tags"></i></span>

                      <AutoCompleteSelect controlId="keywordsSelect" value={this.state.keywords} multi={true}   onSelect={::this.handleKeywordsSelect} style={{zIndex:0}} placeholder="three keywords"/>

                    </div>
                    <label class="error" >{this.state.keywordsValidationStatus[1]}</label> <br />


                    <div class="row" >

                      <div class="col-sm-6">
                        <div class={"input-group " + this.showInputStatus(this.state.countryValidationStatus)}  >

                          <span class="input-group-addon"><i class="fa fa-flag"></i></span>

                          <MyCountrySelect initialCountry={this.props.localization.countryCode||''} onSelect={::this.handleCountrySelect}/>

                          <span class={::this.showInputFeedback(this.state.countryValidationStatus)}></span>
                        </div>
                        <label class="error" >{this.state.countryValidationStatus[1]}</label> <br />
                      </div>

                      <div class="col-sm-6" style={{paddingBottom: 5}}>
                        <div class={"input-group " + this.showInputStatus(this.state.cityValidationStatus)}  >

                          <span class="input-group-addon"><i class="fa fa-institution"></i></span>

                          <input type='text' class='form-control input' placeholder='city'  value={this.props.localization.city||this.state.city} onChange={::this.handleCityChange} />

                          <span class={::this.showInputFeedback(this.state.cityValidationStatus)}></span>
                        </div>
                        <label class="error" >{this.state.cityValidationStatus[1]}</label> <br />
                      </div>

                    </div>

                    -->
                    <div v-if="this.error !== ''">
                        <div class="alert alert-danger alert-dismissable">
                            {{this.error}}
                        </div>
                    </div>

                </form>

            </div>

            <div class="panel-footer text-right" style='padding-top:20px; padding-bottom:20px; padding-right:20px'>

                <LoadingButton class="btn-success" :onClick="this.handleAddTopic" text="Create Topic" icon="fa fa-plus"  ref="refSubmitButton"  />

            </div>

        </div>

    </div>
    
</template>


<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    import CountrySelect from 'client/components/util-components/select/Country.select.vue';
    import SearchAutoComplete from 'client/components/util-components/select/SearchAutoComplete.select.vue';

    export default{
        name: "AddTopic",

        components: {
            "LoadingButton": LoadingButton,
            "CountrySelect": CountrySelect,
            "SearchAutoComplete" : SearchAutoComplete,
        },

        data: function (){
            return {
                urlSlug: '',
                title: '',
                link: '',
                description: '',
                keywords: [],

                attachments: [],

                countryCode: '', country: '',
                city: '',
                language: '',
                latitude: 0, longitude: 0,

                titleValidationStatus: [null, ''],
                linkValidationStatus: [null, ''],
                descriptionValidationStatus: [null, ''],
                keywordsValidationStatus: [null, ''],
                countryValidationStatus: [null, ''],
                cityValidationStatus: [null, ''],


                parentId: '',
                parentName: '',
                parentValidationStatus: [null, ''],
            }
        },

        props:{
            parentIdProp: {default:''},
            parentNameProp: {default:''},
            onSuccess: {default: function (){}},
            onError: {default: function (){}},
        },

        computed:{
            localization(){
                return this.$store.state.localization;
            }
        },

        methods:{

            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},

            async handleAddTopic(e){

                if (typeof e !== "undefined") {
                    e.preventDefault();
                    e.stopPropagation();
                }

                let onSuccess = this.props.onSuccess || function (){};
                let onError = this.props.onError || function (){};

                let bValidationError=false;
                this.error = ''; this.titleValidationStatus = [null, ''];  this.linkValidationStatus = [null,'']; this.descriptionValidationStatus = [null,'']; this.keywordsValidationStatus = [null,'']; this.countryValidationStatus = [null,'']; this.cityValidationStatus = [null,''];

                console.log('ADDing topic... ',this.$refs['refPreviewNewTopic']);

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

                            if ((typeof answer.errors.title !== "undefined") && (Object.keys(answer.errors.title).length !== 0 )) this.titleValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.title[0])];
                            if ((typeof answer.errors.link !== "undefined") && (Object.keys(answer.errors.link).length !== 0 )) this.linkValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.link[0])];
                            if ((typeof answer.errors.description !== "undefined") && (Object.keys(answer.errors.description).length !== 0)) this.descriptionValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.description[0])];
                            if ((typeof answer.errors.keywords !== "undefined") && (Object.keys(answer.errors.keywords).length !== 0)) this.keywordsValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.keywords[0])];
                            if ((typeof answer.errors.country !== "undefined") && (Object.keys(answer.errors.country).length !== 0)) this.countryValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.country[0])];
                            if ((typeof answer.errors.city !== "undefined") && (Object.keys(answer.errors.city).length !== 0)) this.cityValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.city[0])];


                            //in case there are no other errors, except the fact that I am not logged In
                            if ((typeof answer.errors.authorId !== "undefined") && (Object.keys(answer.errors.authorId).length !== 0))
                                if ((this.titleValidationStatus[0] === null)&&(this.descriptionValidationStatus[0] === null)&&(this.keywordsValidationStatus[0] === null)&&(this.countryValidationStatus[0] === null)&&(this.cityValidationStatus[0] === null))
                                    this.openLogin();

                            onError(answer);
                        }
                    }
                    catch(Exception){
                        this.$refs['refSubmitButton'].enableButton();
                        this.error = "There was a internal problem publishing your topic ... Try again <br/> <strong> "+Exception.toString()+" </strong>";
                    }


            },

            handleTitleChangeSelect(value){
                this.title = value;
                this.titleValidationStatus  = [null, ''] ;
            },

            handleTitleChange(e){
                this.handleTitleChangeSelect(e.target.value);
            },

            async handleLinkChange(e){

                this.link = sLink;

                try{
                    let answer = await ContentService.getMetaUrl(this.link);
                    let newAttachments =  this.state.attachments||[];

                    console.log("handleLinkChange", answer);
                    if (answer.result){

                    }

                    let bFound=false;
                    for (let i=0; i<newAttachments.length; i++ )
                        if (newAttachments[i].type === 'link'){
                            newAttachments[i].url = this.link;
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
                            url: this.link,
                            img: (typeof answer.data !== "undefined"? answer.data.image : ''),
                            title: (typeof answer.data !== "undefined"? answer.data.title : ''),
                            description: (typeof answer.data !== "undefined" ? answer.data.description : ''),
                            keywords: (typeof answer.data !== "undefined" ? answer.data.keywords : ''),
                        })
                    }

                    console.log("newAttachments",newAttachments);

                    this.attachments = newAttachments;

                }catch (Exception){
                    this.link = sLink;
                    this.error = "Error. " + Exception.toString();

                    console.log("Error extracting Link Meta", Exception)
                }

            },

            handleDescriptionChange(value){
                this.description = value;
                this.descriptionValidationStatus  = [null, ''];
            },

            handleParentChangeSelect(dataSelected){
                console.log('handleParentChangeSelect', );
                this.parentId = dataSelected.value;
                this.parentName = dataSelected.label;
                this.parentValidationStatus = [null, ''];
            },

            handleKeywordsSelect(value){
                this.keywords = value;
                this.keywordsValidationStatus = [null, ''];

                console.log("KEYWORDS SELECTED: " , value );
            },

            handleCountrySelect(selectedCountry, selectedCountryCode){
                this.country = selectedCountry;
                this.countryCode  = selectedCountryCode;
                this.countryValidationStatus  = [null, ''];
                this.error = '';

                console.log("values selected are:", val);
            },

            handleCityChange(e){
                this.city = e.target.value;
                this.cityValidationStatus  = [null, '']
            },

            openLogin(){

                if (this.$store.state.global.refAuthenticationModal !== null) {
                    this.$store.state.global.refAuthenticationModal.setOnSuccessEvent(this.authenticationSuccessfully);
                    this.$store.state.global.refAuthenticationModal.openLogin();
                }

            },

            authenticationSuccessfully(resource){
                this.handleAddTopic();
            },

            fileUploadSuccess(type, name, url, thumbnail){

                let newAttachments =  this.state.attachments||[];
                newAttachments.push({
                    type: 'file',
                    typeFile: type,
                    url: url,
                    img: thumbnail,
                    title: name,
                });

                this.attachments = newAttachments;//storing thew new attachments

            },

            fileUploadRemoved(type, name, url, thumbnail){

                let newAttachments =  this.state.attachments||[];
                for (let i=0; i<newAttachments.length; i++)
                    if ((newAttachments[i].url === url)&&(newAttachments[i].typeFile===type)&&(newAttachments[i].title === name)&&(newAttachments[i]).img === thumbnail){
                        newAttachments.splice(i,1);
                        break;
                    }
                //console.log("newAttachments",newAttachments);

                this.attachments = newAttachments; //storing thew new attachments
            }

        }

    }
    
</script>
