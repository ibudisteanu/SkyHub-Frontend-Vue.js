<template>

    <form @submit="handleSubmitContact" autoComplete="on">
        <label>Name</label>
        <div :class="'input-group ' + showInputStatus(userEmailValidationStatus)" >

            <span class="input-group-addon"><i class="fa fa-user"></i></span>

            <input autoFocus type='text' class='form-control input-lg' placeholder='your name'  name="username" :value="userEmail"    @change="handleUserEmailChange" />

            <span :class="showInputFeedback(userEmailValidationStatus)"></span>

        </div>
        <label class="error">{{userEmailValidationStatus[1]}}</label> <br/>


        <label>Email Address</label>
        <div :class="'input-group ' + showInputStatus(userEmailValidationStatus)" >

            <span class="input-group-addon"><i class="fa fa-user"></i></span>

            <input autoFocus type='text' class='form-control input-lg' placeholder='email'  name="username" :value="userEmail"    @change="handleUserEmailChange" />

            <span :class="showInputFeedback(userEmailValidationStatus)"></span>

        </div>
        <label class="error">{{userEmailValidationStatus[1]}}</label> <br/>


        <strong>Description</strong>
        <div :class="'input-group ' + this.showInputStatus(this.descriptionValidationStatus)"  >

            <span class="input-group-addon"><i class="fa fa-edit"></i></span>

            <textarea type='text' class='form-control input' rows="5" placeholder='description'  style="z-index:0" name="description" :value="this.description" @change="this.handleDescriptionChange"  />

            <span :class="showInputFeedback(this.descriptionValidationStatus)"></span>
        </div>
        <label class="error" >{{this.descriptionValidationStatus[1]}}</label> <br />

    </form>

    <div class="panel-footer text-right" style='padding-top:20px; padding-bottom:20px; padding-right:20px'>
        <LoadingButton class="btn-success" @onClick="handleSubmitContact" icon="fa fa-plus" text="Create Forum"  ref="refSubmitButton"  />
    </div>

</template>


<script>

    import LoadingButton from 'client/components/util-components/UI/buttons/LoadingButton.vue';

    export default{
        name: 'ContactForm',

        components{
            "LoadingButton": LoadingButton,
        },

        data: function (){
            return {
                name:'',
                emailAddress : '',
                body : '',

                error: '',

                countryCode : '', country : '',
                city : '',
                language : '',
                latitude : 0, longitude : 0,

                nameValidationStatus: [null,''],
                emailAddressValidationStatus: [null,''],
                bodyValidationStatus: [null,''],

                parentId:'', parentName:'',
                parentValidationStatus: [null, ''],
            }
        },

        methods:{
            async handleSubmitContact(e){

                if ((typeof e !== "undefined")&&(e !== null)) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                if (this.$refs['refSubmitButton'].disabled === true) // avoid multiple post requests
                    return false;

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

            handleNameChange(e){
                this.handleNameChangeSelect(e.target.value);
            },
        }


    }
</script>
