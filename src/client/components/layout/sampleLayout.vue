<template>

    <div style="overflow-y: auto;">

        <HeaderLayout/>

        <div class="backgroundVideoWrap">
            <video autoplay loop class="backgroundVideo">
                <source src="public/assets/video/file.mp4" type="video/mp4">
            </video>
        </div>

        <div id="websiteBody">

            <div id="WebDollarAlertsStickyBar"></div>
            <slot name="content"></slot>

        </div>

    </div>

</template>

<script>


    import HeaderLayout from "client/components/layout/HeaderLayout.vue"
    import FooterLayout from "client/components/layout/FooterLayout.vue"

    export default{

        name: "Layout",

        components:{
            "HeaderLayout": HeaderLayout,
            "FooterLayout": FooterLayout,
        },

        computed:{

            screenHeight(){
                return this.$store.state.global.screenHeight;
            },

            screenWidth(){
                return this.$store.state.global.screenWidth;
            },

        },

        mounted(){

            if (typeof window === "undefined") return;

            this.$store.dispatch('GLOBAL_SCREEN', {screenHeight : window.innerHeight, screenWidth : window.innerWidth});

            //-----------------------
            // Int Script
            //-----------------------

            this.changeFullSectionHeight();

            document.body.style.backgroundColor='#000';

            this.fullHeightSectionOnMobile(document.getElementById("aboutSection"),768);


            this.addEvent(window, "resize", (event) => {

                this.$store.dispatch('GLOBAL_SCREEN', {screenHeight : window.innerHeight, screenWidth : window.innerWidth});

                this.changeFullSectionHeight();
            });

        },

        methods:{
            //-----------------------
            // Functions
            //-----------------------

            changeFullSectionHeight(){
                let fullSection = document.getElementsByClassName('fullSection');
                let fullSectionHeight = this.screenHeight-70;

                for (let i = 0; i < fullSection.length; i++)
                    fullSection[i].style.height = fullSectionHeight + 'px';

                this.fullHeightSectionOnMobile(document.getElementById("aboutSection"),768);
            },

            fullHeightSectionOnMobile(element,maxWidth){

                if (element === undefined || element === null) return;

                if(this.screenWidth<=maxWidth){

                    element.firstChild.className += " fullHeight";
                    element.setAttribute('style', 'height:auto !important');

                }else

                    element.firstChild.className = element.firstChild.className.replace("fullHeight", "");

            },

            //-----------------------
            // Screen size
            //-----------------------

            addEvent (object, type, callback) {
                if (object === null || typeof(object) === 'undefined') return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                } else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                } else {
                    object["on"+type] = callback;
                }
            },

        }

    }


</script>