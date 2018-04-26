<template>

    <div>

        <ul class="vuejs-countdown" v-if="this.message === ''">
            <li>
                <p class="digit">{{d}}</p>
                <p class="text">days</p>
            </li>
            <li>
                <p class="digit">{{h}}</p>
                <p class="text">hours</p>
            </li>
            <li>
                <p class="digit">{{m}}</p>
                <p class="text">min</p>
            </li>
            <li>
                <p class="digit">{{s}}</p>
                <p class="text">Sec</p>
            </li>
        </ul>

        <span class="finishedCount" v-if="this.message !== ''">
        </span>
    </div>

</template>

<script>

    export default {

        data: () => {

            return {
                interval: undefined,

                d: 0,
                h: 0,
                m: 0,
                s: 0,
                message: '',
            }

        },

        props:{
            deadline : {default: "April 26, 2018 13:00:00 GMT+0" },
            status : {default: true}
        },

        mounted(){

            if (typeof window === "undefined") return false;

            // Update the count down every 1 second
            if (this.interval !== undefined)
                clearInterval(this.interval);

            if (this.status===true){

                this.interval = setInterval( this.countDown, 1000);
                this.countDown();

            }

        },

        methods: {

            countDown(){

                let countDownDate = new Date(this.deadline).getTime();

                // Get todays date and time
                let now = new Date().getTime();

                // Find the distance between now an the count down date
                let distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                this.d = Math.floor(distance / (1000 * 60 * 60 * 24));
                this.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                this.s = Math.floor((distance % (1000 * 60)) / 1000);

                // Estetic redefine
                if (this.h < 10)
                    this.h = '0' + this.h;

                if (this.d < 10)
                    this.d = '0' + this.d;

                if (this.m < 10)
                    this.m = '0' + this.m;

                if (this.s < 10)
                    this.s = '0' + this.s;

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(this.interval);
                    this.interval = undefined;
                    this.message = 'FINISHED';
                    this.$emit('countDownFinished', this.deadline);
                }

            }

        },



    }

</script>