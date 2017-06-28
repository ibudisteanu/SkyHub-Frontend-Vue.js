/**
* Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
* (C) BIT TECHNOLOGIES
*/

/*
    FREE IMAGE HOSING: https://httpbin.org/post
*/

<template>
        <dropzone :id="'fileUploadDropzone_'+this.idProp" url="http://myskyhub.ddns.net:4000/upload/topic-file" @vdropzone-success="success" @vdropzone-removed-file="removedfile" :useFontAwesome="true" :thumbnail-height="100" :thumbnail-width="100" acceptedFileTypes="image/jpeg,image/jpg,image/png,image/gif,application/pdf,application/doc,application/docx,application/zip,application/rar" >
            <!-- Optional parameters if any! -->
            <input type="hidden" name="token" value="xxx">
            <input type="hidden" name="authorId" :value="getAuthorId">
        </dropzone>

</template>



<script>

    import Dropzone from './vue2-dropzone/index.vue';


    export default{

        name: 'FileUploadDropzone',

        components: {

            Dropzone,
        },

        props:{
            onSuccessNewAttachment: {default: function (){}},
            onRemoveAttachment: {default: function(){}},
            idProp: {default: 0},
        },

        computed:{
            getAuthorId(){
                return this.$store.state.authenticatedUser.user.id||'';
            },
        },

        methods:{
            success(fileData, response){
                console.log("uploaded successfully ",fileData);

                let onSuccessNewAttachment = this.onSuccessNewAttachment||function(){};

                if ((typeof fileData.xhr.responseText !== "undefined")&&(fileData.xhr.responseText !== '')){
                    let response = JSON.parse(fileData.xhr.responseText);
                    //console.log("FILE UPLOADED", response.type, response.name,  response.url, response.thumbnail);

                    if (response.result === true)
                        onSuccessNewAttachment(response.type, response.name,  response.url, response.thumbnail);

                }

            },

            removedfile(fileData, error, xhr){
                console.log("removed successfully ",fileData, error);

                let onRemoveAttachment = this.onRemoveAttachment||function(){};

                if ((typeof fileData.xhr.responseText !== "undefined")&&(fileData.xhr.responseText !== '')){
                    let response = JSON.parse(fileData.xhr.responseText);
                    console.log("file removed", response.type, response.name,  response.url, response.thumbnail);

                    if (response.result === true)
                        onRemoveAttachment(response.type, response.name,  response.url, response.thumbnail);

                }
            }
        },

    }

</script>
