/*
IT IS BASED ON THIS TUTORIAL https://github.com/surmon-china/vue-quill-editor

modules:
    image resize: https://github.com/kensnyder/quill-image-resize-module
*/

<template>

    <quillEditor :content="content"
                 ref="myQuillEditor"
                 :options="editorOption"
                 @blur="onEditorBlur($event)"
                 @focus="onEditorFocus($event)"
                 @ready="onEditorReady($event)"
                 @change="onEditorChange($event)">

    </quillEditor>

</template>

<script>

    console.log('MyQuillEditor');
    //import Quill from 'quill';
    var quillEditor = null;
    console.log(window.Quill);

    if (typeof window === 'undefined') {
        const VueQuillEditor = require('vue-quill-editor/ssr');
        quillEditor = VueQuillEditor.quillEditor;
    } else {
        const VueQuillEditor = require('vue-quill-editor');

        var Quill = VueQuillEditor.Quill;
        quillEditor = VueQuillEditor.quillEditor;

    }

    // if you need register quill modules, you need to introduce and register before the vue program is instantiated

    import ImageResize from 'quill-image-resize-module';
    import {ImageDrop} from 'quill-image-drop-module';

    //import ImageResize from './modules/quill-image-resize-module-master/src/ImageResize';
    //let ImageResize = Quill.import('quill-image-resize-module');
    //var ImageResize = require('quill-image-resize-module').ImageResize;

    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/imageDrop', ImageDrop);

    //WORKING 2nd version....
/*    import { ImageImport } from './modules/ImageImport.js'
    import { ImageResize } from './modules/ImageResize.js'

    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/imageImport', ImageImport);*/

    export default{
        components: {
            'quillEditor': quillEditor,
        },

        data () {
            return {
                content: '', //default value
                text: '',
                editorOption: {
                    // some quill options
                    modules: {
//                        toolbar: [
//                            [{ 'size': ['small', false, 'large'] }],
//                            ['bold', 'italic'],
//                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//                            ['link', 'image']
//                        ],

                        imageResize:{
                            displaySize: true,
                            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                        },
                        imageDrop:true,
                    }
                }
            }
        },

        methods: {
            onEditorBlur(editor) {
                console.log('editor blur!', editor)
            },
            onEditorFocus(editor) {
                console.log('editor focus!', editor)
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            },
            onEditorChange({ editor, html, text }) {
                console.log('editor change!', editor, html, text);
                this.content = html;
                this.text = text;

                this.$emit('onChange', editor, this.content, this.text);
            }
        },
        // get the current quill instace object.
        computed: {
            editor() {
                return this.$refs.myQuillEditor.quill
            }
        },
        mounted() {
            // you can use current editor object to do something(quill methods)
            console.log('this is current quill instance object', this.editor)
        }

    }


</script>

<style>
    .ql-container .ql-editor {
        min-height: 20em;
        padding-bottom: 1em;
        max-height: 25em;
    }
    .html {
        height: 9em;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
        resize: vertical;
    }
</style>