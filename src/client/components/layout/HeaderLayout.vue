<template>

    <div id="header" :style="{marginTop: this.alertsHeight}">
        <!--<img src="public/WebDollar-logo-black.png" id="logo"/>-->

        <div class="topnav" id="menu">

            <router-link to="/#mainSection" id="logoBox" class="active logoMenu"  @click="this.collapseMenuBack" >
                <img src="public/WebDollar-logo-white.png" id="logo"/>
            </router-link>

            <router-link to="/#timelineSection" @click="this.collapseMenuBack" >Timeline</router-link>

            <router-link to="/faq" @click="this.collapseMenuBack" > FAQ </router-link>
            <router-link to="/team" @click="this.collapseMenuBack" > Team </router-link>
            <a @click="this.collapseMenuBack" href="/public/doc/WebDollar-White-Paper.pdf" target="_blank">White Paper</a>
            <router-link to="/#what-is-WebDollar" @click="this.collapseMenuBack" > About </router-link>
            <router-link to="/#p2p-network" @click="this.collapseMenuBack" > Network </router-link>

            <a href="javascript:void(0);" style="font-size:15px;" class="icon showMenu" @click="this.showMobileMenu">&#9776;</a>
        </div>

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

            handleWallet(){

                this.$store.dispatch('WALLET_MENU_INVERT', {})

            },

            showMobileMenu() {
                let x = document.getElementById("menu");

                if (x.className === "topnav") {
                    document.getElementById('logoMenu').setAttribute('style', 'float:none !important');
                    x.className += " responsive";
                } else {
                    x.className = "topnav";
                    document.getElementById('logoMenu').setAttribute('style', 'float:left !important');
                }
            },

            collapseMenuBack(){

                if (this.screenWidth<768){

                    this.showMobileMenu();

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
            },

            bringMenu() {

                if (typeof window === "undefined") return;
                if (this.$refs['refMenu'] === undefined) return;


                if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0)
                    this.$refs['refMenu'].style.bottom = "-100%";
                else
                    this.$refs['refMenu'].style.bottom = "0";
            }

        },
        mounted(){

            if (typeof window === 'undefined') return;

            this.addEvent(window, "resize", (event) => {

                this.screenWidth = window.innerWidth;

            });

            this.screenWidth = window.innerWidth;

            this.bringMenu();

        }

    }
</script>