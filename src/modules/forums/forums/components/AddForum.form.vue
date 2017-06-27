/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/16/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class="col-sm-8 col-sm-offset-2" style='padding:0' >

        <div class="panel panel-warning">

            <div class="panel-heading">
                <h2 style='margin-top: 0'>New <strong>Forum</strong> in {{this.parentNameVariable||this.parentName||'Home'}} </h2>
            </div>

            <div class="panel-body">

                <form @submit="this.handleAddForum" autoComplete="on">

                    <div style="padding-bottom: 20">
                        <strong>Forum Name (one - two words)</strong>
                        <div :class="'input-group ' + this.showInputStatus(this.nameValidationStatus)" >

                            <span class="input-group-addon"><i class="fa fa-pencil"></i></span>

                            <AutoCompleteSelect :selectOnClickOnly="false" autoFocus :multi="false" class='border-focus-blue'  placeholder='forum name (one or two words)'  :value="name"  :select="handleNameChangeSelect" style='z-index:0'  clearable="false" />

                            <span :class='showInputFeedback(nameValidationStatus)' style='width:60px; top:10px'> </span>

                        </div>
                        <label class="error" >{{nameValidationStatus[1]}}</label> <br />
                        Title URL: skyhub.me/<label class="success" >{{urlSlug}}</label> <br />
                    </div>


                    <strong>Title</strong>
                    <div :class="'input-group ' + showInputStatus(titleValidationStatus) "  >

                        <span class="input-group-addon"><i class="fa fa-font"></i></span>

                        <input type='text' class='form-control input' placeholder='title'  name="title" :value={this.title||this.name} @change="handleTitleChange" />

                        <AutoCompleteSelect :multi="false" class='border-focus-blue'  placeholder='title'  :value="title"  @select="handleTitleChangeSelect" style='z-index:0'  />

                        <span :class="showInputFeedback(this.titleValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.titleValidationStatus[1]}}</label> <br />



                    <strong>Description</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.descriptionValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <textarea type='text' class='form-control input' rows="5" placeholder='description'  name="description" :value={this.description} @change="this.handleDescriptionChange" />

                        <span :class="showInputFeedback(this.descriptionValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.descriptionValidationStatus[1]}}</label> <br />


                    <strong>Parent - Forum</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.parentValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                        <SearchAutoComplete multi={false} class='border-focus-blue'  placeholder='select a parent-forum'  :value="{label:this.parentName||this.parentName, value:this.parentId||this.parentId}"  onSelect="handleParentChangeSelect" style='z-index:0'  :clearable="false" />

                        <span :class="showInputFeedback(this.parentValidationStatus)"></span>
                    </div>
                    <label class="error" >{{this.state.parentValidationStatus[1]}}</label> <br />


                    <strong>Keywords</strong>
                    <div :class="'input-group ' + this.showInputStatus(this.keywordsValidationStatus)"  >

                        <span class="input-group-addon"><i class="fa fa-tags"></i></span>

                        <AutoCompleteSelect :selectOnClickOnly="false" controlId="keywordsSelect" :value="this.keywords" multi={true}   :onSelect="this.handleKeywordsSelect" style='z-index:0' placeholder="three keywords"/>

                    </div>
                    <label class="error" >{{this.keywordsValidationStatus[1]}}</label> <br />


                    <div class="row" >

                        <div class="col-sm-6">
                            <div :class="'input-group ' + this.showInputStatus(this.countryValidationStatus)"  >

                                <span class="input-group-addon"><i class="fa fa-flag"></i></span>

                                <CountrySelect :defaultCountry="localization.country||''"  :defaultCountryCode="localization.countryCode||''"  :onSelect="handleCountrySelect"/>

                                <span :class="this.showInputFeedback(this.countryValidationStatus)"></span>
                            </div>
                            <label class="error" >{{this.countryValidationStatus[1]}}</label> <br />
                        </div>

                        <div class="col-sm-6" style='padding-bottom: 5px'>
                            <div :class="'input-group ' + this.showInputStatus(this.cityValidationStatus)"  >

                                <span class="input-group-addon"><i class="fa fa-institution"></i></span>

                                <input type='text' class='form-control input' placeholder='city'  :value="this.localization.city||this.city" @change="handleCityChange" />

                                <span :class="showInputFeedback(this.cityValidationStatus)"></span>
                            </div>
                            <label class="error" >{{this.cityValidationStatus[1]}}</label> <br />
                        </div>

                    </div>


                    <div v-if="error !== ''">
                        <div class="alert alert-danger alert-dismissable">
                            {{error}}
                        </div>
                    </div>

                </form>

            </div>

            <div class="panel-footer text-right" style='padding-top:20px; padding-bottom:20px; padding-right:20px'>

                <LoadingButton class="btn-success" @click="handleAddForum" icon="fa fa-plus" text="Create Forum"  ref="refSubmitButton"  />

            </div>

        </div>

    </div>

</template>


<script>

    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';
    import CountrySelect from 'client/components/util-components/select/Country.select.vue';


    export default{
        name: 'AddForum',

        components:{
            "LoadingButton": LoadingButton,
            "CountrySelect": CountrySelect,
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


                parentId:'',
                parentName:'',
                parentValidationStatus: [null, ''],
            }
        },


        methods:{
            async handleAddForum(e){

                if (typeof e !== "undefined") {
                    e.preventDefault();
                    e.stopPropagation();
                }

                let onSuccess = this.props.onSuccess || function (){};
                let onError = this.props.onError || function (){};

                let nameValidationStatus = [null,''], titleValidationStatus = [null, ''], descriptionValidationStatus = [null, ''], keywordsValidationStatus = [null, ''], countryValidationStatus = [null, ''], cityValidationStatus = [null, ''];

                let bValidationError=false;
                this.setState({
                    error: '',
                    nameValidationStatus: nameValidationStatus,
                    titleValidationStatus: titleValidationStatus,
                    descriptionValidationStatus: descriptionValidationStatus,
                    keywordsValidationStatus: keywordsValidationStatus,
                    countryValidationStatus: countryValidationStatus,
                    cityValidationStatus: cityValidationStatus,
                });

                console.log('ADDing forum... ');

                if (!bValidationError)
                    try{
                        let answer = await ForumsService.forumAdd(this.state.parentId || this.props.parentId, this.state.name, this.state.title||this.state.name||'', this.state.description, this.state.keywords,
                            this.state.countryCode || this.props.localization.countryCode, '',
                            this.state.city || this.props.localization.city, this.state.latitude || this.props.localization.latitude, this.state.longitude || this.state.latitude, this.state.timeZone)

                        this.refSubmitButton.enableButton();

                        console.log("ANSWER FROM adding forum", answer);

                        if (answer.result === true) {
                            onSuccess(answer);

                            history.push(answer.forum.URL);// redirecting to the forum URL ;)
                        }
                        else if (answer.result === false) {

                            if ((typeof answer.errors.name !== "undefined") && (Object.keys(answer.errors.name).length !== 0 )) nameValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.name[0])];
                            if ((typeof answer.errors.title !== "undefined") && (Object.keys(answer.errors.title).length !== 0 )) titleValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.title[0])];
                            if ((typeof answer.errors.description !== "undefined") && (Object.keys(answer.errors.description).length !== 0)) descriptionValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.description[0])];
                            if ((typeof answer.errors.keywords !== "undefined") && (Object.keys(answer.errors.keywords).length !== 0)) keywordsValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.keywords[0])];
                            if ((typeof answer.errors.country !== "undefined") && (Object.keys(answer.errors.country).length !== 0)) countryValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.country[0])];
                            if ((typeof answer.errors.city !== "undefined") && (Object.keys(answer.errors.city).length !== 0)) cityValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.city[0])];

                            //in case there are no other errors, except the fact that I am not logged In
                            if ((typeof answer.errors.authorId !== "undefined") && (Object.keys(answer.errors.authorId).length !== 0))
                                if ((titleValidationStatus[0] === null) && (descriptionValidationStatus[0] === null) && (keywordsValidationStatus[0] === null) && (countryValidationStatus[0] === null) && (cityValidationStatus[0] === null))
                                    this.openLogin();

                            this.setState({
                                nameValidationStatus: nameValidationStatus,
                                titleValidationStatus: titleValidationStatus,
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
                        this.setState({error: "There was a internal problem publishing your forum... Try again"+Exception.toString()});
                    }

            },

            handleNameChangeSelect(value) {

                this.setState({
                    name : value,
                    nameValidationStatus  : [null, '']
                });

                value = (((value !== null)&&(value.hasOwnProperty("value"))) ? value.value : value);

                console.log("name",value);
                this.setState({ nameValidationStatus: [null, ''] });

                ContentService.getURLSlug('',value) .then( (answer)=>{

                    let netStateChange = {titleGenerated: value};

                    if (!answer.result)  netStateChange.nameValidationStatus = ["error", answer.message] ;
                    else netStateChange.urlSlug = answer.URLSlug;

                    if (netStateChange !== {}) this.setState(netStateChange);

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
