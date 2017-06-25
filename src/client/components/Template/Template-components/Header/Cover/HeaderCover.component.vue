/**
 * Created by BIT TECHNOLOGIES on 5/28/2017.
 */

<template>
    <div style="padding-bottom: 20px">

        <div class="header-cover row  border-bottom white-bg dashboard-header " :style="{backgroundImage: 'url('+(coverPic||'')+')', backgroundColor: (this.coverColor!=='' ? '#'+this.coverColor : 'darkblue')}">

            <div v-if="showLayOver === true" class='header-cover-layover'>

            </div>



            <div  v-if="showDescriptionMenu" class="col-xs-12 " >
                <div class='header-cover-description' >
                    <div>

                        <img :src="icon||'/public/SkyHub-logo.png'" />

                        <div class="row">
                            <h1 class='fg-white'>{{title}}</h1>
                            <br/>

                            <h2 v-if="subTitle !== ''" class='fg-white' style='opacity: 0.8'>
                                {{subTitle}}
                            </h2>
                        </div>

                        <div class="header-cover-toolbar" >
                            <div style='display: inline-block'>

                                {{buttons}}

                                <button type="button" id='likeCount' >
                                    <i class='fa fa-hart' />
                                </button>

                                <label class='header-cover-toolbar-label' >
                                    <span class=''>0 likes</span>
                                </label>

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

    export default{

        name: 'HeadCover',

        props:{
            url: {default: ''},
            title: {default: ''},
            subTitle: {default: ''},
            breadcrumbs: {default: function (){return []}},
            buttons: {default: function() {return []}},
            showDescriptionMenu: {default: true},
            coverPic: {default: 'http://spitfiresocial.com/wp-content/uploads/2015/03/worldsocial.jpg'},
            coverColor: {default: ''},
            icon: {default: ''},

            showLayOver: {default: false}, //lay over mask
        },

        components:{
            'DisplayBreadcrumbs' : DisplayBreadcrumbs,
        },

        methods:{

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