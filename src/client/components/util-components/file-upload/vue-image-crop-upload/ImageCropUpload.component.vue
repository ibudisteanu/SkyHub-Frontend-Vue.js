/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/5/2017.
 * (C) BIT TECHNOLOGIES
 */

/*
    DOCUMENTATION IT BASED ON https://github.com/dai-siki/vue-image-crop-upload
*/

<template>

    <div>

        <VueImageCropUploadComponent  v-if="enableFileUpload"


                field="file"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail"
                v-model="show"

                :width="this.width"
                :height="this.height"
                :url="getFileUploadURL"
                lang-type="en"


                img-format="png"
                :params="params"
                :headers="headers"
                ref="refVueImageCropUploadComponent"
        >

        </VueImageCropUploadComponent>

    </div>
</template>

<script>
    import VueImageCropUploadComponent from './VueImageCropUploadComponent.vue';
    import constants from 'root/constants'

    export default{

        name: 'ImageCropUpload',

        components:{
            'VueImageCropUploadComponent' : VueImageCropUploadComponent,
        },

        data: function(){
            return {
                show: false,
                params: {
                    token: '123456798',
                    name: 'avatar'
                },
                headers: {
                    smail: '*_~'
                },
            }
        },

        props:{
            enableFileUpload: {default: false},
            width: {default: 300},
            height: {default: 300},
            //onImageChanged: {default: function(){}},
        },

        methods: {

            showModal(){
                this.show=true;
            },

            /**
             * crop success
             *
             * [param] imgDataUrl
             * [param] field
             */
            cropSuccess(imgDataUrl, field){
                console.log('-------- crop success --------');

                //this.$emit('onImageChanged',[imgDataUrl, field]);
            },
            /**
             * upload success
             *
             * [param] jsonData  server api return data, already json encode
             * [param] field
             */
            cropUploadSuccess(jsonData, field){
                console.log('-------- upload success --------');
                console.log(jsonData);
                console.log('field: ' + field);

                this.$emit('onImageChanged',jsonData.url, field);
                this.$refs['refVueImageCropUploadComponent'].off();
            },
            /**
             * upload fail
             *
             * [param] status    server api return error status, like 500
             * [param] field
             */
            cropUploadFail(status, field){
                console.log('-------- upload fail --------');
                console.log(status);
                console.log('field: ' + field);
            },
        },

        computed:{
            getFileUploadURL(){
                return constants.SERVICE_FILE_UPLOAD_URL
            }
        }

    }
</script>