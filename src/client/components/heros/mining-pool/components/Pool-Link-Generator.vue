<template>

    <div>

        <p class="poolDescription">Generate Mining Pool Link</p>

        <h2>SERVERS</h2>
        <textarea rows="5" cols="100" v-model="poolServers">
            server1.com
            server2.com
        </textarea>

        <h2>PRIVATE PASSWORD POOL</h2>
        <div style="display: inline-block">
            <input type="password" class="input" v-model="poolPrivatePassword" ><br>
        </div>

        <p class="copyPoolLink" @click="generateLink">
            Copy invite link
        </p>

    </div>

</template>

<script>

    import slider from 'client/components/UI/elements/Slider.vue';
    import Clipboard from 'v-clipboard';

    export default{

        data: ()=>{

            return {
                poolServers: 'server.com',
                poolPrivatePassword: '123',
            }

        },

        methods: {

            generateLink() {

                return '';

            },

            copyToClipboard(){
                this.$clipboard('test-link');
            }

        }

    }

</script>

