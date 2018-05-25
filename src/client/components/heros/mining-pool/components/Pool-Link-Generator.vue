<template>

    <div>

        <p class="poolDescription">Invite friends to start mining in your pool, instantly</p>

        <p class="copyPoolLink disabledColors" @click="copyToClipboard">
            Copy invite link
        </p>

        <h2>SERVERS</h2>
        <textarea rows="5" cols="100">
            server1.com
            server2.com
        </textarea>

        <h2>PRIVATE PASSWORD POOL</h2>
        <div style="display: inline-block">
            <input type="password" class="input" v-model="poolPrivatePassword" placeholder="pool123" ><br> <p class="button">Set Password</p>
        </div>

    </div>

</template>

<script>

    import slider from 'client/components/UI/elements/Slider.vue';

    export default{

        data: ()=>{

            return {
                poolPrivatePassword: '',
            }

        },

        methods: {

            generateLink() {

            },

            copyToClipboard(){
                this.$clipboard('test-link');
            }

        }

    }

</script>

