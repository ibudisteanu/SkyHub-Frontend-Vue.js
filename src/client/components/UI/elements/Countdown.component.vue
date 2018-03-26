<template>

    <div>

        COUNT DOWN {{this.deadline}}

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
            {{message}}
        </span>
    </div>

</template>

<script>

    export default {



    }

</script>