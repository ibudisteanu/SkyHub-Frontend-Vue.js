<template>
    <li class="active">
        <router-link to="/" >
            <i class="fa fa-home"></i> <span class="nav-label">{{this.walletAddress.substr(0,17)}}</span>
            <span class="fa arrow"></span>
        </router-link>
        <ul class="nav nav-second-level collapse in" style="height: 0px;">
            <li class="active"><a href="index.html"><i class="fa fa-dollar"></i>0.0 WEB</a></li>
            <li ><a href="index.html"><i class="fa fa-arrow-right"></i>Send Money</a></li>


            <li class="">
                <a href="#" id="damian"><i class="fa fa-gears"></i> Settings <span class="fa arrow"></span></a>
                <ul class="nav nav-third-level collapse" style="height: 0px;">

                    <li ><a href="/"><i class="fa fa-money"></i>Check Balance</a></li>
                    <li ><a href="/"><i class="fa fa-times"></i>Remove</a></li>

                </ul>
            </li>



        </ul>
    </li>
</template>

<script>

    export default {
        name: 'ShowWallet',

        components:{
        },

        data: function () {
            return {
                imageAvatarActive: false,
            }
        },

        props:{
            walletAddress: {default: ''},
        },

        computed: {

        },

        methods:{

        }

    }
</script>


