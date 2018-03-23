<template>

    <div>

        <div class="list">

            <div class="listHead listElement webSiteElement">

                <div>
                    No.
                </div>

                <div class="title">
                    Post Link
                </div>

                <div>
                    Alexa Score
                </div>

                <div>
                    Score
                </div>

            </div>

            <div class="listElement webSiteElement" v-for="(element, index) in list" :key="'FacebookRankingListElement '+index">
                <div>
                    {{index+1}}
                </div>

                <div class="title">
                    {{element.link}}
                </div>
                <div>
                    {{element.alexaScore}}
                </div>


            </div>

        </div>

    </div>

</template>

<script>

    export default{

        props:{
            list: {default: function (){ return { } }},
        },

        methods:{



        }

    }

</script>