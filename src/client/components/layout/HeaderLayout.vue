<template>

    <div id="header" :style="{marginTop: this.alertsHeight}">
        <!--<img src="public/WebDollar-logo-black.png" id="logo"/>-->

        <div class="topnav" id="menu">

            <router-link to="/#mainSection" id="logoBox" class="active logoMenu" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <img v-on:click="this.collapseMenuBack" src="public/WebDollar-logo-white.png" id="logo"/>
            </router-link>

            <router-link to="/#timelineSection" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Timeline</div>
            </router-link>

            <router-link to="/faq" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">FAQ</div>
            </router-link>

            <router-link to="/#team" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Team</div>
            </router-link>

            <a @click="this.collapseMenuBack" href="/public/doc/WebDollar-White-Paper.pdf" target="_blank" :class="this.mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">White Paper</div>
            </a>

            <router-link to="/#what-is-WebDollar" :class="mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">About</div>
            </router-link>

            <router-link to="/#p2p-network" :class="mobileMenuOpened && this.isMobile ? 'openedMenuLink' : '' ">
                <div v-on:click="this.collapseMenuBack">Network</div>
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

            this.screenWidth = window.innerWidth;
            this.verifyIfIsMobile();

        }

    }
</script>