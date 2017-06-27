/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 5/14/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
    <div class='text-center' style='padding: 10px'>

        <strong>SIGN UP with</strong>
        <div>
            <div style='margin-top: 12px; margin-bottom: 12px; display: inline-flex'>

                <div style='margin-right: 20px'>

                    <!--
                    <FacebookLogin
                            appId="622709767918813"
                            autoLoad={false}
                            fields="id,name,email,picture,cover,first_name,last_name,age_range,link,gender,locale,timezone,updated_time,verified"
                            scope="public_profile,user_friends,user_about_me"
                            icon="fa fa-facebook"
                            textButton=""
                            callback={::this.responseFacebook}
                            cssClass="btn btn-social-icon btn-facebook btn-lg"
                    />
                    -->

                </div>

                <div style='marginRight:20px'>

                    <!--
                    <GoogleLogin
                            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                            buttonText=""
                            autoLoad={false}
                            class="btn btn-social-icon btn-google btn-lg"
                            onSuccess={::this.responseSuccessGoogle}
                            //onFailure={::this.responseFailureGoogle }
                            fetchBasicProfile
                    >
                        <i class="fa fa-google-plus" />
                    </GoogleLogin>
                    -->

                </div>


                <a class="btn btn-social-icon btn-twitter " style='margin-right:20px'>
                    <span class="fa fa-twitter"></span>
                </a>

            </div>


            <div v-if="error !== ''">
                <div class="alert alert-danger alert-dismissable">
                    {{this.error}}
                </div>
            </div>

        </div>

    </div>
</template>


<script>
    
    export default{
        name: 'OAuthSocialNetworks',

        data: function (){
            return {
                error: '',
            }
        },

        props:{
            onSuccess: {default: function (){}},
            onError: {default: function (){}},
        },

        methods:{
            errorRegisteringFacebook (response){
                this.error = "Error registering with Facebook";

                //this.modalRef.showAlert('Error registering with Facebook','',"Ops! It didn't work");

                this.registrationFailure(response);
            },

            responseSuccessGoogle (response){
                this.error = '';
                console.log(response);
            },

            responseFailureGoogle (response){
                this.error = "Error registering with Google";

                this.modalRef.showAlert('Error registering with Google','',"Ops! It didn't work");
            },

            registrationSuccessfully(response){
                this.error = '';
                let onSuccess = this.onSuccess || function (){};

                onSuccess(response);
            },

            registrationFailure(response){
                let onError = this.onError || function (){};

                onError(response);
            },

            responseFacebook(response) {

                this.setState({
                        error: ''
                    }
                );

                // accessToken:"EAAI2WeqD1N0BAH11ZBrtE66a2ZAF1BMoVPNBf9WVS6thiRjLqsWloXNswva5uZAp48iFmNARJFYkd6y4OzqhyU36vyjhp5idDjSfGoEoC6TfaK7VZCE63u34WFwoeaqPLQBmzVJWAWxdqVkJUVBZBW2JZAZB72IrhRw7jSvTJ86mBK1GeJstFR1lSXZBgqZCSAqQZD"
                // age_range: {min: 21}
                // cover: {id: "" , offset_y: 2, source: "location.jpg"}
                // expiresIn:6803
                // first_name:"Alexandru"
                // gender:"male"
                // id:"1899824400275208"
                // last_name : "Ionut"
                // link:"https://www.facebook.com/app_scoped_user_id/1899824400275208/"
                // locale:"en_US"
                // name:"Alexandru Ionut"
                // picture:{ data: { is_silhoette: false, url : "picture"}}
                // signedRequest: "ASS-ky4D-1KsC1Rbksly-QiCPN5sYQDYAK7xqLN_v9I.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUJ6VXFicHlvNU1CVnNSTHRJbWwzcnBFOGwyN2xURTk4Ny1XRWNzZHQyWlJkc1JxR2k4QVE3SDEzMjFwTFFrTzJaWm80LUEwcWRyZDM1dHU4UUtMb0JKa3k2eWpGMUFkLVVLb0Q0Q3piU3hVdm1xeGhHWjRuQ2pqSDY5NXpFLWJfT0dMdDM0Sll4ZHdCTlN0aHNSaGZVWHJESno5Z2NaTDhaQlZqb3NFdmRIRV90dVpFQ3VKODVEZk9MVTZvZ1BhVkVFSnpqdkxhQ0tuWjg2ckw3c0cwY2w1UVdFb04ydEtVdks2UXJZcGtTZE9BUXlhUlpGc3N0Z2FkVWl2ZzA0SmstWGY4X1hXSmhuWnlQaTk0bmJOUUVQdlZyc3h0SW5PWnY3NGw0QUIzTHBlLXVQakxQQ2p5OVhnRHVvbUgtTkZkTkNlZEtUYjZtVGp1U2ZvSmtONEZFWSIsImlzc3VlZF9hdCI6MTQ5NDc4NTE5NywidXNlcl9pZCI6IjE4OTk4MjQ0MDAyNzUyMDgifQ"
                // timezone:3
                // updated_time:"2017-04-09T16:31:48+0000"
                // userID: "1899824400275208"
                // verified : true

                try{

                    let sFacebookId = response.id || '';

                    try {
                        let objCover = response.cover || {};
                        let sCoverImage = objCover.source || '';

                        let sProfilePic = "http://graph.facebook.com/"+sFacebookId+"/picture?type=large";

                        // var objProfile = response.picture || {};
                        //     objProfile = objProfile.data || {};
                        // var sProfilePic = objProfile.url || '';
                    } catch (Exception)
                    {
                        console.log('Error extracting CoverImage and Profile Pic');
                    }

                    let sAccessToken = response.accessToken || '';
                    let sEmail = response.email || '';
                    let sFirstName = response.first_name || '';
                    let sLastName = response.last_name || '';
                    let sGender = response.gender || '';
                    let iAge = response.age_range.min || 0;
                    let iTimeZone = response.time_zone || 0;
                    let sLanguage = response.locale;
                    let sShortBio = response.user_about_me || '';
                    let bVerified = response.verified;

                    console.log("OAUTH Instance", this);

                    AuthService.registerOAuthAsync('facebook',sFacebookId,  sAccessToken, sEmail, sFirstName, sLastName, sProfilePic, sCoverImage,
                        this.props.localization.countryCode, sLanguage, this.props.localization.city, this.props.localization.latitude, this.props.localization.longitude, sShortBio, iAge, sGender, iTimeZone, bVerified)

                        .then( (res) => {

                            console.log("Auth Service answer ",res);

                            if (res.result === true) this.registrationSuccessfully(res);
                            else if (res.result === false) {
                                this.errorRegisteringFacebook(response);
                            }

                        });

                } catch (Exception)
                {
                    console.log('error facebook registering', Exception);
                    this.errorRegisteringFacebook (response);
                }

                console.log(response);

            },
        }

    }

</script>

