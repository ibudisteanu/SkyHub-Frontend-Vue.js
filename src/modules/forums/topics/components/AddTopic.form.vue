/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class="col-md-8 col-md-offset-2" style='padding:0' >
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

                            <SearchAutoComplete :multi="false" dataSuggestion="google" placeholder='title / subject' :defaultValue="this.title||this.parentName"  :defaultLabel="this.title||this.parentName" :onSelect="this.handleTitleChange" :clearOnSelect="true" />

                            <span :class="this.showInputFeedback(this.titleValidationStatus)" style='width:60px; top:10px'></span>
                        </div>
                        <label class="error" >{{this.titleValidationStatus[1]}}</label> <br />
                    </div>

                    <div style="padding-bottom: 20px">
                        <strong>Link:</strong>
                        <div :class="'input-group ' + this.showInputStatus(this.linkValidationStatus)"  >

                            <span class="input-group-addon"><i class="fa fa-pencil"></i></span>

                            <input  type='text' class='form-control input' placeholder='title'  name="title" :value="this.link" @change="this.handleLinkChange" style='z-index : 0' />

                            <span :class="this.showInputFeedback(this.linkValidationStatus)" style="width:60px; top:10px"></span>
                        </div>
                        <label class="error" >{{this.linkValidationStatus[1]}}</label> <br />

                        <no-ssr>
                            <FileUploadDropzone :idProp="this.parentIdProp" :onSuccessNewAttachment="this.fileUploadSuccess" :onRemoveAttachment="this.fileUploadRemoved" />
                        </no-ssr>


                    </div>



                    <strong>Description</strong>

                        <no-ssr>
                            <MyVueEditor ref="refDescriptionEditor" :onChange = "handleDescriptionChange"/>
                        </no-ssr>

                    <span :class="this.showInputFeedback(this.descriptionValidationStatus)"></span>
                    <label class="error" >{{this.descriptionValidationStatus[1]}}</label> <br />



                    <strong>Forum</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.parentValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <SearchAutoComplete key="addTopicParentSearch" :multi="false" dataSuggestion="parents" placeholder='select a parent-forum' :defaultValue="this.parentId||this.parentIdProp"  :defaultLabel="this.parentName||this.parentNameProp" :onSelect="handleParentChangeSelect" :clearOnSelect="true"/>

                        <span :class="this.showInputFeedback(this.parentValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.parentValidationStatus[1]}}</label> <br />

                    <strong>Preview</strong>

                    <PreviewNewTopic :title="this.title" :description="this.description" :attachments="this.attachments" :keywords="this.keywords" :authorId="this.$store.state.authenticatedUser.user.id||''" ref="refPreviewNewTopic" />

                    <!--
                    <strong>Keywords</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.keywordsValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-tags"></i></span>

                        <SearchAutoComplete key="addForumKeywordsSearch" :multi="true" dataSuggestion="google" placeholder='three keywords' :defaultValue="''"  :defaultLabel="''" :onSelect="handleKeywordsSelect" :clearable="false"/>


                    </div>
                    <label class="error" >{{this.keywordsValidationStatus[1]}}</label> <br />


                    <div class="row" >

                        <div class="col-sm-6" style="padding-left: 0">
                            <div :class="'input-group ' + this.showInputStatus(this.countryValidationStatus)"  >

                                <CountrySelect :defaultCountry="localization.country||''"  :defaultCountryCode="localization.countryCode||''"  :onSelect="handleCountrySelect"/>

                                <span :class="this.showInputFeedback(this.countryValidationStatus)"></span>
                            </div>
                            <label class="error" >{{this.countryValidationStatus[1]}}</label> <br />
                        </div>

                        <div class="col-sm-6" style='padding-right: 0; padding-bottom: 5px'>
                            <div :class="'input-group ' + this.showInputStatus(this.cityValidationStatus)"  >

                                <span class="input-group-addon"><i class="fa fa-institution"></i></span>

                                <input type='text' class='form-control input' placeholder='city'  :value="this.localization.city||this.city" @change="handleCityChange" style="z-index:0"/>

                                <span :class="showInputFeedback(this.cityValidationStatus)"></span>
                            </div>
                            <label class="error" >{{this.cityValidationStatus[1]}}</label> <br />
                        </div>

                    </div>

                    -->
                    <div v-if="this.error !== ''">
                        <div class="alert alert-danger alert-dismissable">
                            <div v-html="this.error" />
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

    import NoSSR from 'vue-no-ssr'

    import CountrySelect from 'client/components/util-components/select/Country.select.vue';
    import SearchAutoComplete from 'client/components/util-components/select/SearchAutoComplete.select.vue';
    import FileUploadDropzone from 'client/components/util-components/file-upload/dropzone/FileUploadDropzone.component.vue';
    import MyVueEditor from 'client/components/util-components/text-editor/MyVueEditor.component.vue';

    import PreviewNewTopic from 'modules/forums/topics/components/PreviewNewTopic.vue';
    import Topic from 'models/Topic/Topic.model';

    export default{
        name: "AddTopic",

        components: {
            'no-ssr': NoSSR,
            "LoadingButton": LoadingButton,
            "CountrySelect": CountrySelect,
            "SearchAutoComplete" : SearchAutoComplete,

            "PreviewNewTopic" : PreviewNewTopic,
            "FileUploadDropzone": FileUploadDropzone,
            'MyVueEditor': MyVueEditor,
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

                error: '',

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
            },

            getTitle(){
                return Topic.getTitle(this.$refs['refPreviewNewTopic'].topic);
            },

            getImage(){
                return Topic.getImage(this.$refs['refPreviewNewTopic'].topic);
            },

            getKeywords(){
                return Topic.getKeywords(this.$refs['refPreviewNewTopic'].topic);
            },

            getDescription(){
                return Topic.getDescription(this.$refs['refPreviewNewTopic'].topic);
            },

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

                let onSuccess = this.onSuccess || function (){};
                let onError = this.onError || function (){};

                let bValidationError=false;
                this.error = ''; this.titleValidationStatus = [null, ''];  this.linkValidationStatus = [null,'']; this.descriptionValidationStatus = [null,'']; this.keywordsValidationStatus = [null,'']; this.countryValidationStatus = [null,'']; this.cityValidationStatus = [null,''];

                if (!bValidationError)
                    try{
                        let answer = await this.$store.dispatch('CONTENT_TOPICS_ADD',{parentId:this.parentId||this.parentIdProp, title: this.getTitle, image: this.getImage, description: this.getDescription, attachments: this.attachments, arrKeywords: this.getKeywords,
                                                                countryCode: this.countryCode||this.localization.countryCode, language:'',
                                                                city: this.city||this.localization.city, latitude:this.latitude||this.localization.latitude, longitude:this.longtitude||this.localization.longitude});

                        this.$refs['refSubmitButton'].enableButton();

                        console.log("ANSWER FROM adding topic ",answer);

                        if (answer.result === true) {
                            onSuccess(answer);

                            this.$router.push(answer.topic.URL);  // redirecting to the forum URL ;)
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

            handleTitleChange(value){
                this.handleTitleChangeSelect(value);
            },

            async handleLinkChange(e){

                this.link = e.target.value;

                try{
                    let answer = await this.$store.dispatch('CONTENT_URL_META',{link: this.link});
                    let newAttachments =  this.attachments||[];

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
                    this.error = "Error extracting Link Meta: " + Exception.toString();
                }

            },

            handleDescriptionChange(value){
                //this.descriptionValidationStatus  = [null, ''];
                this.description = value;
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

                let newAttachments =  this.attachments||[];
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

                let newAttachments =  this.attachments||[];
                for (let i=0; i<newAttachments.length; i++)
                    if ((newAttachments[i].url === url)&&(newAttachments[i].typeFile===type)&&(newAttachments[i].title === name)&&(newAttachments[i]).img === thumbnail){
                        newAttachments.splice(i,1);
                        break;
                    }
                //console.log("newAttachments",newAttachments);

                this.attachments = newAttachments; //storing thew new attachments
            },



        }

    }
    
</script>
