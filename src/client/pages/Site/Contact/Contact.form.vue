<template>
    <div style="text-align: left">
        <form @submit="handleSubmitContact" autoComplete="on">
            <strong>Name</strong>
            <div :class="'input-group ' + showInputStatus(nameValidationStatus)" >

                <span class="input-group-addon"><i class="fa fa-user"></i></span>

                <input autoFocus type='text' class='form-control input-lg' placeholder='your name'  name="name" :value="this.name"    @change="handleNameChange" />

                <span :class="showInputFeedback(nameValidationStatus)"></span>

            </div>
            <label class="error">{{nameValidationStatus[1]}}</label> <br/>


            <strong>Email Address</strong>
            <div :class="'input-group ' + showInputStatus(emailAddressValidationStatus)" >

                <span class="input-group-addon"><i class="fa fa-user"></i></span>

                <input autoFocus type='text' class='form-control input-lg' placeholder='email'  name="email" :value="this.email"    @change="handleEmailChange" />

                <span :class="showInputFeedback(emailAddressValidationStatus)"></span>

            </div>
            <label class="error">{{emailAddressValidationStatus[1]}}</label> <br/>



            <strong>Title</strong>
            <div :class="'input-group ' + showInputStatus(titleValidationStatus)" >

                <span class="input-group-addon"><i class="fa fa-user"></i></span>

                <input autoFocus type='text' class='form-control input-lg' placeholder='message title'  name="name" :value="this.title"    @change="handleTitleChange" />

                <span :class="showInputFeedback(titleValidationStatus)"></span>

            </div>
            <label class="error">{{titleValidationStatus[1]}}</label> <br/>


            <strong>Description</strong>
            <div :class="'input-group ' + this.showInputStatus(this.bodyValidationStatus)"  >

                <span class="input-group-addon"><i class="fa fa-edit"></i></span>

                <textarea type='text' class='form-control input' rows="5" placeholder='message body'  style="z-index:0; background-color: white !important;" name="body" :value="this.body" @change="this.handleBodyChange"  />

                <span :class="showInputFeedback(this.bodyValidationStatus)"></span>
            </div>
            <label class="error" >{{this.bodyValidationStatus[1]}}</label> <br />

        </form>

        <div class="text-right" style='padding-top:20px; padding-bottom:20px; padding-right:20px'>
            <LoadingButton class="btn-success" @onClick="handleSubmitContact" icon="fa fa-envelope" text="Send Message"  ref="refSubmitButton"  />
        </div>

    </div>

</template>


<script>
    import {showInputStatus, showInputFeedback, convertValidationErrorToString} from 'client/components/util-components/form-validation/formValidation';
    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    export default{
        name: 'ContactForm',

        components: {
            "LoadingButton": LoadingButton,
        },

        data: function (){
            return {
                name:'',
                email: '',
                title: '',
                body : '',

                error: '',

                countryCode : '', country : '',
                city : '',
                language : '',
                latitude : 0, longitude : 0,

                nameValidationStatus: [null,''],
                emailAddressValidationStatus: [null,''],
                titleValidationStatus: [null,''],
                bodyValidationStatus: [null,''],

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
            },

            authenticatedUser(){
                return this.$store.state.authenticatedUser.user;
            }
        },

        methods:{
            showInputStatus(status) {return showInputStatus(status)},
            showInputFeedback(status) {return showInputFeedback(status)},
            convertValidationErrorToString(error) {return convertValidationErrorToString(error)},


            async handleSubmitContact(e){

                if ((typeof e !== "undefined")&&(e !== null)) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (this.$refs['refSubmitButton'].disabled === true) // avoid multiple post requests
                    return false;

                let bValidationError=false;
                this.error =  ''; this.nameValidationStatus =  [null, '']; this.emailAddressValidationStatus = [null,'']; this.titleValidationStatus = [null,'']; this.bodyValidationStatus = [null,''];

                console.log('Sending Contact Message... ');

                let name = this.name;
                let email = this.emailAddress;

                if (this.$store.getters.isAuthenticatedUserLoggedIn){
                    name = this.$store.getAuthenticatedUserFullName;
                    email = this.$store.state.authenticatedUser.user.email;
                }

                if (!bValidationError)
                    try{
                        let answer = await this.$store.dispatch('CONTACT_SEND_EMAIL',{ parentId:this.parentId || this.parentId, name: name||'', emailAddress: email||'' , authorId: this.authenticatedUser.id||'',  title: this.title||'', body:this.body,
                            country: this.countryCode || this.localization.countryCode, language:'',  city: this.city || this.localization.city||'', latitude: this.latitude || this.localization.latitude||0, longitude: this.longitude || this.localization.longitude||0,
                            timezone: this.localization.timeZone||''});

                        this.$refs['refSubmitButton'].enableButton();

                        console.log("ANSWER FROM submit Contact Message", answer);

                        if (answer.result === true) {
                            this.$emit('onSuccess',answer);

                            this.$router.push(answer.forum.URL);  // redirecting to the forum URL ;)
                        }
                        else if (answer.result === false) {

                            if ((typeof answer.errors.name !== "undefined") && (Object.keys(answer.errors.name).length !== 0 )) this.nameValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.name[0])];
                            if ((typeof answer.errors.email !== "undefined") && (Object.keys(answer.errors.email).length !== 0 )) this.emailAddressValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.email[0])];
                            if ((typeof answer.errors.title !== "undefined") && (Object.keys(answer.errors.title).length !== 0 )) this.titleValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.title[0])];
                            if ((typeof answer.errors.body !== "undefined") && (Object.keys(answer.errors.body).length !== 0)) this.bodyValidationStatus = ["error", this.convertValidationErrorToString(answer.errors.body[0])];

                            //in case there are no other errors, except the fact that I am not logged In
                            if ((typeof answer.errors.authorId !== "undefined") && (Object.keys(answer.errors.authorId).length !== 0))
                                if ((this.titleValidationStatus[0] === null) && (this.descriptionValidationStatus[0] === null) && (this.keywordsValidationStatus[0] === null) && (this.countryValidationStatus[0] === null) && (this.cityValidationStatus[0] === null))
                                    this.openLogin();


                            this.$emit('onError', answer);
                        }
                    }
                    catch(Exception){
                        this.$refs['refSubmitButton'].enableButton();
                        this.error = "There was a internal problem sending your contact message ... Try again <br/> <strong> "+Exception.toString()+" </strong>";
                    }


            },

            handleNameChange(value){
                if (typeof value === 'object') value = value.target.value;

                this.name = value;
                this.nameValidationStatus = [null, ''];
            },

            handleEmailChange(value){
                if (typeof value === 'object') value = value.target.value;
                this.name = value;
                this.nameValidationStatus = [null, ''];
            },


            handleTitleChange(value){
                if (typeof value === 'object') value = value.target.value;

                this.title = value;
                this.titleValidationStatus = [null, ''];
            },

            handleBodyChange(value){
                if (typeof value === 'object') value = value.target.value;

                this.body = value;
                this.bodyValidationStatus = [null, ''];
            },
        }


    }
</script>
