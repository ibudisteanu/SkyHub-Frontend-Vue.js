/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
* (C) BIT TECHNOLOGIES
*/

/*
    FREE IMAGE HOSING: https://httpbin.org/post
*/

<template>
        <dropzone :id="'fileUploadDropzone_'+this.idProp" :url="getFileTopicUploadURL" @vdropzone-success="successFile" @vdropzone-removed-file="removedfile" :useFontAwesome="true" :thumbnail-height="100" :thumbnail-width="100" acceptedFileTypes="image/jpeg,image/jpg,image/png,image/gif,application/pdf,application/doc,application/docx,application/zip,application/rar" >
            <!-- Optional parameters if any! -->
            <input type="hidden" name="token" value="xxx">
            <input type="hidden" name="authorId" :value="getAuthorId">
        </dropzone>

</template>



<script>

    import Dropzone from './vue2-dropzone/index.vue';
    import constants from 'root/constants.js'

    export default{

        name: 'FileUploadDropzone',

        components: {

            Dropzone,
        },

        props:{
            idProp: {default: 0},
        },

        //@onSuccessNewAttachment
        //@onRemoveAttachment

        computed:{
            getAuthorId(){
                return this.$store.state.authenticatedUser.user.id||'';
            },

            getFileTopicUploadURL(){
                return constants.SERVICE_FILE_UPLOAD_TOPIC_URL
            }
        },

        methods:{
            successFile(fileData, response){
                console.log("uploaded successfully ",fileData);

                if ((typeof fileData.xhr.responseText !== "undefined")&&(fileData.xhr.responseText !== '')){
                    let response = JSON.parse(fileData.xhr.responseText);
                    //console.log("FILE UPLOADED", response.type, response.name,  response.url, response.thumbnail);

                    if (response.result === true)
                        this.$emit('onSuccessNewAttachment',response.type, response.name,  response.url, response.thumbnail);

                }

            },

            removedfile(fileData, error, xhr){
                console.log("removed successfully ",fileData, error);

                if ((typeof fileData.xhr.responseText !== "undefined")&&(fileData.xhr.responseText !== '')){
                    let response = JSON.parse(fileData.xhr.responseText);
                    console.log("file removed", response.type, response.name,  response.url, response.thumbnail);

                    if (response.result === true)
                        this.$emit('onRemoveAttachment',response.type, response.name,  response.url, response.thumbnail);

                }
            }
        },

    }

</script>
