<template>

    <p style="text-align: center">

        Tags:
        <button class="btn btn-default btn-rounded"
           v-for="(keyword, index) in keywords"
                :key="'KeywordButton'+'_'+index"
        >
            {{keyword}}
        </button>

    </p>

</template>

<script>
export default{

    name: "ViewKeywords",

    props: {
        keywords: {default: function (){return []}},
    }

}
</script>