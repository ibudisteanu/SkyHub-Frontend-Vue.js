/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/16/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>
        <div class="section">

            <multiselect v-model="value" @input="onChangeSelect" label="label" track-by="label" :placeholder="placeholder" :options="options" :multiple="multi" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="clearOnSelect" :close-on-select="closeOnSelect" :options-limit="300" :limit="this.limit" :limit-text="this.limitText" @search-change="getSuggestions">
                <span slot="noResult">Oops! No elements found. </span>
            </multiselect>


        </div>
</template>


<script>
    import Multiselect from 'vue-multiselect'
    import FetchService from 'services/communication/FetchService'
    import jsonp  from 'jsonp';

    export default{
        name: 'SearchAutoComplete',

        components: {
            'multiselect' : Multiselect,
        },

        props: {

            selectId: {default: ''},

            defaultValue : {default: ''},
            defaultLabel : {default: ''},
            limitText : {default: function (count){}},
            limit: 0,
            multi: {default: false},
            closeOnSelect: {default: true},
            clearOnSelect: {default: false},
            placeholder: {default: 'Type to search'},
            onSelect: {default: function (){}},
            dataSuggestion: {default: 'google'},
            createNewElement: {default: true}, //show even what the user typed as an option

            returnObjects: {default:false},
        },

        data () {

            let value = {value: this.defaultValue||'', label: this.defaultLabel||''};
            if (this.multi) {
                if ((this.defaultValue === '') &&(this.defaultLabel === '')) value = []; //it is empty
                else value = [value];
            }

            return {
                value: value,
                isLoading: false,
                options: [],
            }

        },


        computed:{
            localization(){
                return this.$store.state.localization;
            }
        },

        methods: {


            onChangeSelect (value) {

                this.value = value;

                console.log("VALUES:: ",value);

                let answer;
                if ((this.multi||false)===true){//multiple keywords

                    if (!Array.isArray(value)) value = [value];

                    answer = []; let returnObjects = this.returnObjects;
                    value.forEach (function(element){
                        if (returnObjects === false) answer.push(element.value);
                        else
                        answer.push({
                            value: element.value,
                            label: element.label,
                        })
                    }.bind(this));

                } else { //just value
                    if (this.returnObjects === false) answer = value.value;
                    else
                        answer = {
                            value: value.value,
                            label: value.label,
                        };
                }

                console.log("AUTOCOMPLETE:: ",answer);

                let onSelect = this.onSelect||function(){};
                onSelect(answer);

                this.isLoading = false;
            },


            getSuggestions(input){
                if (this.dataSuggestion === "google") return this.getSuggestionsGoogle(input);
                if (this.dataSuggestion === "parents") return this.getSuggestionsParents(input);
            },

            //using Google http://google.com/complete/search?client=firefox&hl=ro&q=theory
            getSuggestionsGoogle( input){

                if (!input) return ;

                this.isLoading = true;
                this.options = [];

                jsonp('http://google.com/complete/search?client=firefox&hl='+(this.localization.countryCode||'us')+'&q='+input, null, function (err, data) {
                    if (err) {
                        console.error('Error getting KEYWORDS '+err.message);
                        resolve([]);
                    } else {
                        //console.log({options: data[1]});

                        var options = [];

                        var keywords = data[1];

                        if (this.createNewElement)
                            options.push({value: input, label: input});


                        keywords.forEach(function (entry){
                            if (entry !== input)
                                options.push({
                                    value: entry,
                                    label: entry,
                                });
                        });

                        this.options = options;
                        this.isLoading = false;
                    }
                }.bind(this));
            },


            getSuggestionsParents( input){

                if (!input) return ;

                this.isLoading = true;
                this.options = [];
                console.log("calculating suggestions");

                FetchService.sendRequestGetData("search/parents", {text: input}).then ((data)=>{

                    if (data === null) { resolve ({options: []}); console.log("ERROR getting keywords "); }
                    else {

                        console.log("DATA",data);

                        var options = [];


                        if (this.createNewElement)
                            options.push({value: input, label: input});


                        data.forEach(function (entry){
                            if ((entry !== input)&&(entry.text !== '')&&(entry.text !== null))
                                options.push({
                                    value: entry.id,
                                    label: entry.text,
                                });
                        });

                        this.options = options;
                        this.isLoading = false;

                    }

                });

            }
        }



    }

</script>
