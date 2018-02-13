<template>

    <div id="mainSection" class="fullSection">
        <div class="verticalAlignMiddle alignCenter modifyTop verticalAlignMiddleMobileFix">

            <img src="/public/WebDollar-logo-white.png" class="mainLogo fadeIn">

            <h1 class="fadeIn fadeIn2">Web Dollar <b class="testnet">TEST NET# 3.0</b></h1>
            <h2 v-if=" this.maintenance " class="fadeIn fadeIn2"><b class="testnet">UNDER MAINTENANCE</b></h2>
            <h3 class="fadeIn fadeIn3">Currency of the Internet</h3>
            <h5 class="fadeIn fadeIn4">{{this.status}}</h5>
            <div class='btn-cont btnPosition fadeIn fadeIn5'> </div>

            <h5 class="fadeIn fadeIn3" v-if="this.loaded === false">
                <span class="alreadyMining">You are already mining...</span>
                <div class="minningSpinner">
                    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                      <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                        <animateTransform attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 25 25"
                          to="360 25 25"
                          dur="0.6s"
                          repeatCount="indefinite"/>
                        </path>
                  </svg>
                </div>
            </h5>

            <div class='btn-cont btnPosition fadeIn fadeIn4'>
                <a class='btn' href="#p2p-network">
                    See your Network
                    <span class='line-1'></span>
                    <span class='line-2'></span>
                    <span class='line-3'></span>
                    <span class='line-4'></span>
                </a>
            </div>

        </div>
    </div>

</template>

<script>

    export default{

        name: "WebDollarHero",

        data: ()=>{
            return {
                status: '',
                loaded: false,
                maintenance: false,
            }
        },

        mounted(){

            if (typeof window === "undefined") return;

            WebDollar.Blockchain.emitter.on("blockchain/status", (data)=>{

                this.status = data.message;

            });

            WebDollar.Blockchain.emitter.on("blockchain/status-webdollar", (data)=>{

                if (data.message === "Ready") {
                    this.loaded = true;

                    WebDollar.Blockchain.Mining.setWorkers(1);

                }

            });

        }

    }

</script>