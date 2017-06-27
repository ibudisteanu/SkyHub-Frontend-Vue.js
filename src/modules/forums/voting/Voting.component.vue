
<template>

    <div class="vote-actions">
        <a href="#">
            <i class="fa fa-chevron-up"> </i>
        </a>
        <div>votingValue</div>
        <a href="#">
            <i class="fa fa-chevron-down"> </i>
        </a>
    </div>
</template>


<script>
    export default {

        name: 'Voting',

        components: {
            "Voting":  this,
        },

        props:{
            votingValue :{default:1},

        },

        data: function () {
            return {

            }
        }
    }
 </script>