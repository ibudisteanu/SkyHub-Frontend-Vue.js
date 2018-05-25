<template>

    <div>

        <p class="poolDescription">Generate Mining Pool Link</p>

        <h2>SERVERS</h2>
        <textarea rows="5" cols="100" v-model="poolServers">
            server1.com
            server2.com
        </textarea>

        <p class="copyPoolLink" @click="generateLink">
            Generate Link
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
                poolSecret: '',
            }

        },

        methods: {

            generateLink() {

                WebDollar.Blockchain.PoolManagement.setPoolServers ( this.poolServers.split(",\n") );

                return '';

            },

            copyToClipboard(){
                this.$clipboard('test-link');
            }

        }

    }

</script>

