/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/28/2017.
 * (C) BIT TECHNOLOGIES
 */

<template>

    <div>
        <div id="test">

        </div>

    </div>


</template>



<script>

    console.log("window.........", typeof window);

    if (typeof window !== "undefined") {
        var vueditor = require('vueditor');
        //var vueditor = require('./vueditor-source/vueditor-master/src/main.js');
        var createEditor = vueditor.createEditor;
        console.log("XXXXXXXXXXXXXx")
    }
    //import {createEditor} from 'vueditor'

    //import {createEditor} from './vueditor/vueditor-develop/src/main.js'
    //import VueEditor from './vueditor/vueditor-develop/src/components/app.vue'

    import "vueditor/dist/style/vueditor.min.css"

    export default{
        name: 'MyVueEditor',
        components: {

        },

        mounted(){
            if (typeof window !== "undefined")
            this.editor = createEditor('#test', {
                                                    toolbar: [
                                                        'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider',
                                                        'bold', 'italic', 'underline', 'strikeThrough', 'links', 'divider', 'subscript', 'superscript',
                                                        'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', /*'justifyFull', '|', 'indent', 'outdent',*/
                                                        'insertOrderedList', 'insertUnorderedList', '|', 'emoji', 'picture', 'tables', 'markdown',/*'|' ,  'switchView' */
                                                    ],
                                                    fontName: [
                                    //                    {val: "宋体, SimSun", abbr: "宋体"}, {val: "黑体, SimHei", abbr: "黑体"},
                                    //                    {val: "楷体, SimKai", abbr: "楷体"}, {val: "微软雅黑, 'Microsoft YaHei'", abbr: "微软雅黑"},
                                                        {val: "arial black"}, {val: "times new roman"}, {val: "Courier New"}
                                                    ],
                                                    fontSize: [
                                                        '8px','10px','12px', '14px', '16px', '18px', '20px', '24px', '28px'
                                                    ],
                                                    emoji: [
                                                        "1f600", "1f601", "1f602", "1f923", "1f603", "1f604", "1f605", "1f606", "1f609", "1f60a", "1f60b",
                                                        "1f60e", "1f60d", "1f618", "1f617", "1f619", "1f61a", "263a", "1f642", "1f917", "1f914", "1f610",
                                                        "1f611", "1f636", "1f644", "1f60f", "1f623", "1f625", "1f62e", "1f910", "1f62f", "1f62a", "1f62b",
                                                        "1f634", "1f60c", "1f913", "1f61b", "1f61c", "1f61d", "1f924", "1f612", "1f613", "1f614", "1f615",
                                                        "1f643", "1f911", "1f632", "2639", "1f641", "1f616", "1f61e", "1f61f", "1f624", "1f622", "1f62d",
                                                        "1f626", "1f627", "1f628", "1f629", "1f62c", "1f630", "1f631", "1f633", "1f635", "1f621", "1f620",
                                                        "1f607", "1f920", "1f921", "1f925", "1f637", "1f912", "1f915", "1f922", "1f927"
                                                    ],
                                                    //lang: 'en',
                                                    mode: 'default',

                                                    uploadUrl: '',
                                                    id: '',
                                                    classList: []
                                                });
        },

        props:{
            onChange: {default : function (){} },
        },


        data(){
            return {
                content: '',
            }
        },

        computed:{

            getContent(){

                if (typeof this.editor === "undefined") return null;
                else return this.editor.getContent();
            },

        },

        created () {

            if (!this.$isServer)
                setInterval(function(){

                    this.fetchContent();

                }.bind(this),500);

        },

        methods:{

            fetchContent(){

                this.content = this.getContent;
                if (this.content === null){

                }
                //console.log('descriere',  this.content);


                this.$emit('onChange',this.content);

            },

        },

    }

</script>

<style>
    .vue-dropzone{
        padding:0 !important;
    }
    .ve-design{
        min-height: 200px;
    }
    .ve-design > div{
        min-height: 200px;
    }
</style>