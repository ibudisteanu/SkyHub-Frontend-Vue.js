/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>
    <div style="padding-bottom: 20px">

        <div class="header-cover row  border-bottom white-bg dashboard-header "  :style="{cursor: ( this.enableChangeCover ? 'pointer' : 'default'), backgroundImage: 'url('+(this.cover||'')+')', backgroundColor: (this.coverColor!=='' ? '#'+this.coverColor : 'darkblue') }" @mouseover="imageCoverMouseOver=true" @mouseout="imageCoverMouseOver=false" @click="handleShowCoverImageCropUploadModal">

            <ImageCropUpload :enableFileUpload="enableChangeCover" ref="refCoverImageCropUpload" @onImageChanged="coverChanged" :width="1500" :height="320"/>

            <div v-if="showLayOver === true" class='header-cover-layover'>
            </div>

            <div v-if="enableChangeIcon" style="position: absolute; padding-left: 10px; padding-right: 10px" :style="{color: 'white', backgroundColor: imageCoverMouseOver ?  'rgba(0,0,0, 0.8)' : 'rgba(0,0,0, 1)'}">
                <i class="fa fa-picture-o"/>
                {{imageCoverMouseOver && !imageIconMouseOver && !buttonsMouseOver ? ' Change Cover' : ''}}
            </div>


            <div  v-if="showDescriptionMenu" class="col-xs-12 " >
                <div class='header-cover-description' >
                    <div>

                        <ImageCropUpload :enableFileUpload="enableChangeIcon" ref="refIconImageCropUpload" @onImageChanged="iconChanged" :width="150" :height="150" />

                        <div class="image-with-caption-link" style="display: inline-block" @click="handleShowIconImageCropUploadModal"    @mouseover="imageIconMouseOver=true; " @mouseout="imageIconMouseOver=false">
                            <router-link :to="''" style="margin-bottom: 0">
                                <img :class="(showPicBorder ? 'profile-pic-white-border' : '')" :src="icon||'/public/SkyHub-logo-square.png'" />
                                <span v-if="enableChangeIcon" :style="showPicBorder ? 'margin-left: 5px; margin-bottom: 5px; width: 90%;' : '' + 'color:white' + 'opacity: '+(imageIconMouseOver ?  1 : 0.7)" ><i class="fa fa-picture-o"/> {{imageIconMouseOver ? 'Change Picture' : ''}}</span>
                            </router-link>
                        </div>

                        <div class="row">
                            <h1 class='fg-white'>{{title}}</h1>
                            <br/>

                            <h2 v-if="subTitle !== ''" class='fg-white' style='opacity: 0.8'>
                                {{subTitle}}
                            </h2>
                        </div>

                        <div class="header-cover-toolbar" >
                            <div style='display: inline-block; padding-top: 10px' @mouseover="buttonsMouseOver=true; " @mouseout="buttonsMouseOver=false; ">


                                <button type="button"
                                        v-for="(button, index) in buttons"
                                        :key="'HeaderButton'+'_'+index"
                                        :class="'btn btn-circle btn-lg '+button.class||'btn-warning'"
                                        :style="button.style||''"
                                        @click="button.onClick()"
                                >
                                    <i v-if="(button.icon||'').length > 0"  :class='button.icon' />
                                    <span v-if="(button.text||'').length > 0" class=''>  {{button.text}}</span>
                                </button>


                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <!--{(this.props.showDescriptionMenu||true) == true ? this.renderDescriptionMenu() : 'NU AFISEZ NIMIC' }-->

        </div>


        <div v-if="this.breadcrumbs !== []" class="row wrapper border-bottom white-bg page-heading" style='padding-bottom: 15px'>
            <DisplayBreadcrumbs :breadcrumbs="breadcrumbs" :currentPageTitle="title" :currentPageUrl="url" />
        </div>

    </div>

</template>


<script>

    import DisplayBreadcrumbs from 'client/components/util-components/UI/breadcrumbs/DisplayBreadcrumbs.component.vue';
    import ImageCropUpload from 'client/components/util-components/file-upload/vue-image-crop-upload/ImageCropUpload.component.vue';

    export default{

        name: 'HeadCover',

        components:{
            'ImageCropUpload':ImageCropUpload,
            'DisplayBreadcrumbs' : DisplayBreadcrumbs,
        },

        data: function () {
            return{
                imageIconMouseOver: false,
                imageCoverMouseOver: false,

                buttonsMouseOver: false,
            }
        },

        props:{
            url: {default: ''},
            title: {default: ''},
            subTitle: {default: ''},
            breadcrumbs: {default: function (){return []}},
            buttons: {default: function() {return []}},
            showDescriptionMenu: {default: true},
            //cover: {default: 'http://spitfiresocial.com/wp-content/uploads/2015/03/worldsocial.jpg'},
            cover: {default: 'http://i.imgur.com/hqLGii9.jpg'},
            coverColor: {default: ''},
            icon: {default: ''},

            showLayOver: {default: false}, //lay over mask
            showPicBorder : {default: true},

            enableChangeIcon : {default: false},
            enableChangeCover : {default: false},
        },


        methods:{
            handleShowIconImageCropUploadModal(e){
                //e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); //stil not working...

                this.imageCoverMouseOver = false;

                if (this.$refs['refCoverImageCropUpload'].show) return false;
                console.log('########## SHOW ICON', this.imageIconMouseOver, this.imageCoverMouseOver);

                if ((this.imageIconMouseOver)&&(typeof this.$refs['refIconImageCropUpload'] !== 'undefined'))
                    this.$refs['refIconImageCropUpload'].showModal();
            },

            iconChanged(imageURL, field){
                this.$emit('onIconChanged', imageURL);
            },

            handleShowCoverImageCropUploadModal(e){
                //e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); //stil not working...

                if (this.buttonsMouseOver) return;

                if (this.$refs['refIconImageCropUpload'].show) return false;
                console.log('########## SHOW COVER', this.imageIconMouseOver, this.imageCoverMouseOver);

                this.imageIconMouseOver = false;

                if ((this.imageCoverMouseOver)&&(typeof this.$refs['refCoverImageCropUpload'] !== 'undefined'))
                    this.$refs['refCoverImageCropUpload'].showModal();
            },

            coverChanged(imageURL, field){
                this.$emit('onCoverChanged', imageURL);
            }
        }


    }
</script>




/*
<div class="col-xs-12 col-sm-4">

    <div class='header-cover-avatar'>
        <image src='/imgs/app/avatars/avatar.jpg' height='100' width='100' style={{display: 'block', borderRadius: 100, border: '2px solid #fff', margin: 'auto', marginTop: 50}} />
        <h4 class='fg-white text-center'>Anna Sanchez</h4>
        <h5 class='fg-white text-center' style={{opacity: 0.8}}>DevOps Engineer, NY</h5>
        <hr class='border-black75' style={{borderWidth: 2}}/>
        <div class='text-center'>
            <button active={this.state.followActive} onClick={::this.handleFollow}>
                <span>{this.state.follow}</span>
            </button>
        </div>
    </div>
</div>
*/