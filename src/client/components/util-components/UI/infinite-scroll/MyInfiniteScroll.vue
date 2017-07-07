/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 7/7/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div ref="refInfiniteScrollDiv" style="text-align: center">

        <i v-if="this.isLoading" class="fa fa-spinner fa-spin" style="font-size: 30px"></i>

    </div>

</template>


<script>
    export default{

        mounted(){
            if (this.$isServer) return false;
            console.log('########## mounted');

            window.onscroll  = this.scrollEvent;

        },

        props:{
            hasNext: {default: true},
            distance : {default: 2},
        },

        data(){
            return {
                isLoading: false,
            }
        },

        //@onScroll

        methods:{
            scrollEvent(){

                if (!this.hasNext) return;
                if (this.isLoading) return;

                let divTop = this.$refs['refInfiniteScrollDiv'].offsetTop;
                //let windowHeight = window.outerHeight;
                //let windowHeight = $(window).height();
                let windowHeight = window.outerHeight||document.body.offsetHeight;
                let pageHeight = document.body.offsetHeight;

                //console.log('--------- scroll', pageHeight, divTop, windowHeight, scrollY);

                let iDiff = divTop - window.scrollY - pageHeight ;

                if (iDiff <= this.distance ){
                    //console.log('################## EMITTING onSCROLL');
                    this.isLoading = true;
                    this.$emit('onScroll', iDiff)
                }

                //console.log(iDiff);
            },

            scrollContinue(){

                this.isLoading = false;

            },

            scrollFinish(){
                this.isLoading = false;
            }

        }

    }
</script>