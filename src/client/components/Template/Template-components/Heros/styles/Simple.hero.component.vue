/**
* Created by BIT TECHNOLOGIES on 5/28/2017.
*/

<template>

        <div class="header-cover row  border-bottom white-bg dashboard-header "  :style="{minHeight: this.height, backgroundImage: (this.cover||''), backgroundColor: (this.coverColor!=='' ? '#'+this.coverColor : 'darkblue') }">

            <div v-if="showLayOver === true" class='hero-layover-class'>
            </div>

            <div  v-if="showContent" class="col-xs-12 " >
                <div class='header-cover-description' >
                    <slot name="hero-content" />
                </div>
            </div>
        </div>


</template>


<script>

    export default{

        name: 'SimpleHero',

        components:{
        },

        data: function () {
            return{
                buttonsMouseOver: false,
            }
        },

        props:{
            url: {default: ''},

            showContent: {default: true},

            cover: {default: ''},
            coverColor: {default: ''},

            height: { default: "321px"},

            showLayOver: {default: false}, //lay over mask
            showPicBorder : {default: true},
        },


        methods:{

        }


    }
</script>