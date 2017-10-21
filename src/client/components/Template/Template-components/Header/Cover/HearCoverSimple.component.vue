/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>
    <div style="padding-bottom: 20px">

        <div class="header-cover row  border-bottom white-bg dashboard-header "  :style="{backgroundImage: 'url('+(this.cover||'')+')', backgroundColor: (this.coverColor!=='' ? '#'+this.coverColor : 'darkblue') }">

            <div v-if="showLayOver === true" class='header-cover-layover'>
            </div>

            <div  v-if="showDescriptionMenu" class="col-xs-12 " >
                <div class='header-cover-description' >
                    <div>

                        <div class="image-with-caption-link" style="display: inline-block" >
                            <router-link :to="''" style="margin-bottom: 0">
                                <img :class="(showPicBorder ? 'profile-pic-white-border' : '')" :src="icon" />
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



    </div>

</template>


<script>

    export default{

        name: 'HeadCoverSimple',

        components:{
        },

        data: function () {
            return{
                buttonsMouseOver: false,
            }
        },

        props:{
            url: {default: ''},
            title: {default: ''},
            subTitle: {default: ''},

            buttons: {default: function() {return []}},
            showDescriptionMenu: {default: true},

            cover: {default: 'http://i.imgur.com/hqLGii9.jpg'},
            coverColor: {default: ''},

            icon: {default: ''},

            showLayOver: {default: false}, //lay over mask
            showPicBorder : {default: true},
        },


        methods:{

        }


    }
</script>