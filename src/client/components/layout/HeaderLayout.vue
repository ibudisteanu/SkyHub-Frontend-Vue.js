<template>

    <div id="header" :style="{marginTop: this.alertsHeight}">
        <!--<img src="public/WebDollar-logo-black.png" id="logo"/>-->

        <div class="topnav" id="menu">

            <router-link to="/#mainSection" id="logoBox" class="active logoMenu" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <img v-on:click="this.collapseMenuBack" src="/public/assets/images/WebDollar-logo-white.png" alt="webDollar logo" id="logo" title="webDollar logo"/>
            </router-link>

            <a @click="this.collapseMenuBack" href="/public/doc/WebDollar-White-Paper.pdf" target="_blank" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Paper</div>
            </a>

            <a href="https://webdollar.network/#/" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' " target="_blank" >
                <!--<router-link to="/explorer" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">-->
                <div v-on:click="this.collapseMenuBack">Explorer</div>
                <!--</router-link>-->
            </a>

            <a href="https://webdollarforum.com" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' " target="_blank" >
                <div v-on:click="this.collapseMenuBack">Forum</div>
            </a>

            <router-link to="/faq" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">FAQ</div>
            </router-link>

            <router-link to="/#team" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Team</div>
            </router-link>

            <router-link to="/bounties" :class="mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Bounties</div>
            </router-link>

            <router-link to="/#what-is-WebDollar" :class="mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">About</div>
            </router-link>

            <router-link to="/mypool" :class="mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Pool</div>
            </router-link>

            <a href="javascript:void(0);" style="font-size:15px;" :style="{display: (mobileMenuOpened || isMobile==false) ? 'none':'block'}" class="icon showMenu" @click="this.showMobileMenu" :class="mobileMenuOpened ? 'openedMenuLink' : '' ">&#9776;</a>

        </div>
        <div id="WebDollarAlertsStickyBar"></div>
    </div>

</template>

<script>

    export default {

        name: "HeaderLayout",

        components: {
        },

        data () {
            return {
                screenWidth: 0,
                alertsHeight: 0,
                mobileMenuOpened: false,
                isMobile: false,
                alerts: [
                    {
                        message: 'test text'
                    },{
                        message: 'test text 2'
                    }
                ]
            }
        },

        methods:{

            collapseMenuBack(){

                this.mobileMenuOpened = false;

            },

            showMobileMenu() {

                this.mobileMenuOpened = true;

            },

            verifyIfIsMobile(){

                if (this.screenWidth<768){

                    this.isMobile=true;

                }else{

                    this.isMobile=false;

                }

            },

            addEvent (object, type, callback) {
                if (object === null || typeof(object) === 'undefined') return;
                if (object.addEventListener) {
                    object.addEventListener(type, callback, false);
                } else if (object.attachEvent) {
                    object.attachEvent("on" + type, callback);
                } else {
                    object["on"+type] = callback;
                }
            }

        },

        mounted(){

            if (typeof window === 'undefined') return;

            this.addEvent(window, "resize", (event) => {

                this.screenWidth = window.innerWidth;
                this.verifyIfIsMobile();

            });

            this.addEvent(window, "scroll", (event) =>{

                if (this.mobileMenuOpened==true){
                    this.mobileMenuOpened=false;
                }

            });

            this.screenWidth = window.innerWidth;
            this.verifyIfIsMobile();

        }

    }
</script>