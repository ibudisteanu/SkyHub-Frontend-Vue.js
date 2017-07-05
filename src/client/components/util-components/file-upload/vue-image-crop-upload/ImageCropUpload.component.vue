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


                field="img"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail"
                v-model="show"

                :width="300"
                :height="300"
                url="http://myskyhub.ddns.net:4000/upload/image"
                lang-type="en"


                img-format="png"
                :params="params"
                :headers="headers">

        </VueImageCropUploadComponent>

    </div>
</template>

<script>
    import VueImageCropUploadComponent from './VueImageCropUploadComponent.vue';

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
                imgDataUrl: '' // the datebase64 url of created image
            }
        },

        props:{
            enableFileUpload: {default: false},
            onImageChanged: {default: function(){}},
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

                if (typeof this.onImageChanged !== 'undefined') this.onImageChanged(imgDataUrl, field);
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
            }
        }

    }
</script>