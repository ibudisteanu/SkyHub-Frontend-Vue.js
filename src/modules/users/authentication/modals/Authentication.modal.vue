<template>

    <ModalComponent modalId="AuthenticationModalComponent"  ref="refModal" :title="modalTitle" subTitle="" :buttons="{}" body="" >

        <div v-if="modalType === 'login'" slot="modal-content">
            <LoginForm v-show="modalType === 'login'" ref="refLogin" @onSuccess="loginSuccess" :onSwitch="switchLoginToRegistration" />
        </div>

        <div v-if="modalType === 'registration'" slot="modal-content">
            <RegistrationForm v-show="modalType === 'registration'" ref="refRegistration" @onSuccess="registrationSuccess" :onSwitch="switchRegistrationToLogin" />
        </div>

    </ModalComponent>

</template>





<script>

    import ModalComponent from 'client/components/util-components/UI/modals/Modal.component.vue';
    import LoginForm from 'modules/users/authentication/login/Login.form.vue';
    import RegistrationForm from 'modules/users/authentication/registration/Registration.form.vue';

    export default{
        name:  'AuthenticationModal',

        components: {
            'ModalComponent': ModalComponent,
            'LoginForm' : LoginForm,
            'RegistrationForm': RegistrationForm,
        },

        data: function() {
            return {
                modalType: {default: 'login'},
                modalTitle: {default: 'Login'},

                onSuccessFunction: {default: function () {}},
                onErrorFunction: {default: function () {}},
            }
        },

        props:{
            onSuccess: { default: function () { } },
            onError: { default: function () { } },
        },

        methods: {

            close() {
                this.$refs['refModal'].closeModal();
            },

            open() {
                this.$refs['refModal'].showAlert();
            },

            setLogin(){
                this.modalType = "login";
                this.modalTitle = "Login to SkyHub";
            },

            openLogin(){
                this.setLogin();
                this.open("login");
            },

            setRegistration(){
                this.modalType = "registration";
                this.modalTitle = "Register to SkyHub";
            },

            openRegistration(){
                this.setRegistration();
                this.open("registration");
            },

            loginSuccess(resource){

                let onSuccess = this.onSuccess||function(){};
                if (typeof onSuccess === 'function') onSuccess(resource);

                onSuccess = this.onSuccessFunction||function(){};
                if (typeof onSuccess === 'function') onSuccess(resource);

                this.close();
            },


            registrationSuccess(resource){
                let onSuccess = this.onSuccess||function(){};
                if (typeof onSuccess === 'function') onSuccess(resource);

                onSuccess = this.onSuccessFunction||function(){};
                if (typeof onSuccess === 'function') onSuccess(resource);

                this.close();
            },

            switchLoginToRegistration(e){
                e.preventDefault(); e.stopPropagation();
                this.setRegistration();
            },

            switchRegistrationToLogin(e){
                e.preventDefault(); e.stopPropagation();
                this.setLogin();
            },

            setOnSuccessEvent(newFunction){
                this.onSuccessFunction = newFunction;
            }

        }

    }
</script>
