<template>

    <div>
        <span v-if="this.message === ''">
            {{d}} {{h}} {{m}} {{s}}
        </span>
        <span v-if="this.message !== ''">
            {{message}}
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
            deadline : {default: "Sep 5, 2018 15:37:25" },
        },

        mounted(){

            if (typeof window === "undefined") return false;


            // Update the count down every 1 second
            this.interval = setInterval( this.countDown, 1000);

            this.countDown();

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

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(this.interval);
                    this.message = 'FINISHED';
                }

            }
            
        }

    }

</script>