/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

        <div class="panel panel-warning">

            <div class="panel-heading">
                <h3 style='margin: 0'>New <strong>Forum</strong> in {{this.parentName||this.parentNameProp||'Home'}} </h3>
            </div>

            <div class="panel-body">

                <form @submit="this.handleAddForum" autoComplete="on">

                    <div style="padding-bottom: 20px">
                        <strong>Forum Name (one - two words)</strong>
                        <div :class="'input-group ' + this.showInputStatus(this.nameValidationStatus)" >

                            <span class="input-group-addon"><i class="fa fa-pencil"></i></span>

                            <SearchAutoComplete key="addForumNameSearch" :multi="false" dataSuggestion="google" placeholder='forum name (one or two words)' :defaultValue="name"  :defaultLabel="name" @onSelect="handleNameChangeSelect" :clearOnSelect="true"/>

                            <span :class='showInputFeedback(nameValidationStatus)' style='width:60px; top:10px'> </span>

                        </div>
                        <label class="error" >{{nameValidationStatus[1]}}</label> <br />

                        Title URL: skyhub.me/<label class="success" >{{urlSlug}}</label> <br />

                    </div>


                    <strong>Title</strong>
                    <div :class="'input-group ' + showInputStatus(titleValidationStatus) "  >

                        <span class="input-group-addon"><i class="fa fa-font"></i></span>

                        <input type='text' class='form-control input' placeholder='title' style="z-index:0" name="title" :value="this.title||this.name" @change="handleTitleChange" />

                        <!--<SearchAutoComplete  key="addForumNameTitle" :multi="false" dataSuggestion="google" placeholder='title' :defaultValue="title"  :defaultLabel="title" :select="handleTitleChangeSelect" :clearable="false"/> -->

                        <span :class="showInputFeedback(this.titleValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.titleValidationStatus[1]}}</label> <br />



                    <strong>Description</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.descriptionValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <textarea type='text' class='form-control input' rows="5" placeholder='description'  style="z-index:0" name="description" :value="this.description" @change="this.handleDescriptionChange"  />

                        <span :class="showInputFeedback(this.descriptionValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.descriptionValidationStatus[1]}}</label> <br />


                    <strong>Parent - Forum</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.parentValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <SearchAutoComplete key="addForumParentSearch" :multi="false" dataSuggestion="parents" placeholder='select a parent-forum' :defaultValue="this.parentId||this.parentIdProp"  :defaultLabel="this.parentName||this.parentNameProp" @onSelect="handleParentChangeSelect" :clearOnSelect="true" />

                        <span :class="showInputFeedback(this.parentValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.parentValidationStatus[1]}}</label> <br />


                    <strong>Keywords</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.keywordsValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-tags"></i></span>

                        <SearchAutoComplete key="addForumKeywordsSearch" :multi="true" dataSuggestion="google" placeholder='three keywords' :defaultValue="''"  :defaultLabel="''" @onSelect="handleKeywordsSelect" :clearable="false"/>


                    </div>
                    <label class="error" >{{this.keywordsValidationStatus[1]}}</label> <br />


                    <div class="row" >

                        <div class="col-sm-6" style="padding-left: 0">
                            <div :class="'input-group ' + this.showInputStatus(this.countryValidationStatus)"  >

                                <CountrySelect :defaultCountry="localization.country||''"  :defaultCountryCode="localization.countryCode||''"  @onSelect="handleCountrySelect"/>

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


                    <div v-if="error !== ''">
                        <div class="alert alert-danger alert-dismissable">
                            <div v-html="this.error" />
                        </div>
                    </div>

                </form>

            </div>

            <div class="panel-footer text-right" style='padding-top:20px; padding-bottom:20px; padding-right:20px'>

                <LoadingButton class="btn-success" @onClick="handleAddForum" icon="fa fa-plus" text="Create Forum"  ref="refSubmitButton"  />

            </div>

        </div>

</template>


<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    import CountrySelect from 'client/components/util-components/select/Country.select.vue';
    import SearchAutoComplete from 'client/components/util-components/select/SearchAutoComplete.select.vue';

    export default{
        name: 'AddForum',

        components:{
            "LoadingButton": LoadingButton,
            "CountrySelect": CountrySelect,
            "SearchAutoComplete" : SearchAutoComplete,
        },

        data: function (){
            return {
                name:'', urlSlug:'',
                title : '',
                description : '',
                keywords : [],

                error: '',

                countryCode : '', country : '',
                city : '',
                language : '',
                latitude : 0, longitude : 0,

                nameValidationStatus: [null,''],
                titleValidationStatus : [null, ''],
                descriptionValidationStatus : [null, ''],
                keywordsValidationStatus : [null, ''],
                countryValidationStatus : [null, ''],
                cityValidationStatus : [null, ''],


                parentId:'', parentName:'',
                parentValidationStatus: [null, ''],
            }
        },

        props:{
            parentIdProp: {default:''},
            parentNameProp: {default:''},

        },

        //@onSuccess;
        //@onError;

        computed:{
            localization(){
                return this.$store.state.localization;
            }
        },

        methods:{

            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},

            async handleAddForum(e){

                if ((typeof e !== "undefined")&&(e !== null)) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                let bValidationError=false;
                this.error =  ''; this.nameValidationStatus =  [null, '']; this.titleValidationStatus = [null,'']; this.descriptionValidationStatus = [null,''];
                this.keywordsValidationStatus = [null,'']; this.countryValidationStatus  = [null, '']; this.cityValidationStatus = [null, ''];

                console.log('ADDing forum... ');

                if (!bValidationError)
                    try{
                        let answer = await this.$store.dispatch('CONTENT_FORUMS_SUBMIT_ADD',{ parentId:this.parentId || this.parentId, name: this.name, title: this.title||this.name||'', description:this.description, keywords:this.keywords,
                                                                country: this.countryCode || this.localization.countryCode, language:'',  city: this.city || this.localization.city, latitude: this.latitude || this.localization.latitude, longitude: this.longitude || this.localization.longitude,
                                                                timezone: this.localization.longitude})

                        this.$refs['refSubmitButton'].enableButton();

                        console.log("ANSWER FROM adding forum", answer);

                        if (answer.result === true) {
                            this.$emit('onSuccess',answer);

                            this.$router.push(answer.forum.URL);  // redirecting to the forum URL ;)
                        }
                        else if (answer.result === false) {

                            if ((typeof answer.errors.name !== "undefined") && (Object.keys(answer.errors.name).length !== 0 )) this.nameValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.name[0])];
                            if ((typeof answer.errors.title !== "undefined") && (Object.keys(answer.errors.title).length !== 0 )) this.titleValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.title[0])];
                            if ((typeof answer.errors.description !== "undefined") && (Object.keys(answer.errors.description).length !== 0)) this.descriptionValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.description[0])];
                            if ((typeof answer.errors.keywords !== "undefined") && (Object.keys(answer.errors.keywords).length !== 0)) this.keywordsValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.keywords[0])];
                            if ((typeof answer.errors.country !== "undefined") && (Object.keys(answer.errors.country).length !== 0)) this.countryValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.country[0])];
                            if ((typeof answer.errors.city !== "undefined") && (Object.keys(answer.errors.city).length !== 0)) this.cityValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.city[0])];

                            //in case there are no other errors, except the fact that I am not logged In
                            if ((typeof answer.errors.authorId !== "undefined") && (Object.keys(answer.errors.authorId).length !== 0))
                                if ((this.titleValidationStatus[0] === null) && (this.descriptionValidationStatus[0] === null) && (this.keywordsValidationStatus[0] === null) && (this.countryValidationStatus[0] === null) && (this.cityValidationStatus[0] === null))
                                    this.openLogin();


                            this.$emit('onError', answer);
                        }
                    }
                    catch(Exception){
                        this.$refs['refSubmitButton'].enableButton();
                        this.error = "There was a internal problem publishing your forum... Try again <br/> <strong> "+Exception.toString()+" </strong>";
                    }

            },

            handleNameChangeSelect(value) {

                value = value;

                this.name = value;
                this.nameValidationStatus  = [null, ''] ;

                value = (((value !== null)&&(value.hasOwnProperty("value"))) ? value.value : value);

                console.log("name",value);

                this.$store.dispatch('CONTENT_URL_SLUG',{parent:'', name:value}).then( (answer)=>{

                    this.titleGenerated = value;

                    if (!answer.result)  this.nameValidationStatus = ["error", answer.message] ;
                    else this.urlSlug = answer.URLSlug;

                });

            },

            handleNameChange(e){
                this.handleNameChangeSelect(e.target.value);
            },

            handleTitleChangeSelect(value){
                this.title = value;
                this.titleValidationStatus = [null, ''];
            },

            handleTitleChange(e){
                this.handleTitleChangeSelect(e.target.value);
            },

            handleDescriptionChange(e){
                this.description = e.target.value;
                this.descriptionValidationStatus  = [null, ''];
            },

            handleParentChangeSelect(dataSelected){
                console.log('handleParentChangeSelect', );
                this.parentId = dataSelected.value;
                this.parentName =  dataSelected.label;
                this.parentValidationStatus = [null, ''];
            },

            handleKeywordsSelect(value){
                this.keywords = value;
                this.keywordsValidationStatus  = [null, ''];

                console.log("KEYWORDS SELECTED: " , value );
            },

            handleCountrySelect(selectedCountry, selectedCountryCode){
                this.country = selectedCountry;
                this.countryCode  = selectedCountryCode;
                this.countryValidationStatus  = [null, ''];
                this.error = '';
            },

            handleCityChange(e){
                this. city = e.target.value;
                this.cityValidationStatus  = [null, ''];
            },

            openLogin(){

                if (this.$store.state.global.refAuthenticationModal !== null) {
                    this.$store.state.global.refAuthenticationModal.setOnSuccessEvent(this.authenticationSuccessfully);
                    this.$store.state.global.refAuthenticationModal.openLogin();
                }
                
            },

            authenticationSuccessfully(resource){
                this.handleAddForum();
            },

        }

    }
</script>
