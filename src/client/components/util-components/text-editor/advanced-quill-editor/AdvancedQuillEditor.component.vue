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

    //console.log('MyQuillEditor'); console.log(window.Quill);
    var VueQuillEditor = null;

    if (typeof window === 'undefined') {
         VueQuillEditor = require('vue-quill-editor/ssr');
    } else {
        VueQuillEditor = require('vue-quill-editor');
    }
    var quillEditor = VueQuillEditor.quillEditor;
    var Quill = VueQuillEditor.Quill;

    // if you need register quill modules, you need to introduce and register before the vue program is instantiated
    import ImageResize from 'quill-image-resize-module';
    import Emoji from 'quill-emoji/dist/quill-emoji';
    //import {ImageDrop} from 'quill-image-drop-module';
    import { ImageDrop } from './modules/ImageDrop.js'

    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/imageDrop', ImageDrop);
    Quill.register('modules/emoji', Emoji);

    import {imageHandler, selectLocalImage} from './modules/ImageUpload'


    console.log('emoji');
    console.log(Emoji);


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
                    placeholder: 'Your text ...',
//                    imageHandler: imageHandler,
//                    imgHandler: imageHandler,
                    modules: {
                        toolbar: {
                            container: [
                                [{'size': ['small', false, 'large']}],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ 'header': 1 }, { 'header': 2 }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                [{ 'indent': '-1' }, { 'indent': '+1' }],
                                [{ 'direction': 'rtl' }],
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                [{ 'color': [] }, { 'background': [] }],
                                [{ 'font': [] }],
                                [{ 'align': [] }],
                                ['clean'],
                                ['link', 'image', 'video'],
                                ['emoji'],
                            ],
                            handlers: {
                                'emoji': function () {}
                            },
                        },
                        toolbar_emoji: true,
                        short_name_emoji: true,
                        textarea_emoji:true,
                        imageResize:{
                            displaySize: true,
                            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                        },
                        imageDrop:true,
                    },

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

            // quill editor add image handler
            this.editor.getModule('toolbar').addHandler('image', () => {
                selectLocalImage(this.editor);
            });

        }

    }


</script>

<style>
    @import "./../../../../../../node_modules/quill-emoji/dist/quill-emoji.css";

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