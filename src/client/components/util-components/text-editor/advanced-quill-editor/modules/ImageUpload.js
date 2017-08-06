var constants = require('root/constants.js');

//------------------------------------------------------------------------------
//METHOD 1

var IMGUR_CLIENT_ID = 'bcab3ce060640ba';
var IMGUR_API_URL = 'https://api.imgur.com/3/image';

export function imageHandler(image, callback) {
    console.log('imageHandler');console.log('imageHandler');console.log('imageHandler');console.log('imageHandler');console.log('imageHandler');console.log('imageHandler');
    var data = new FormData();
    data.append('image', image);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', IMGUR_API_URL, true);
    xhr.setRequestHeader('Authorization', 'Client-ID ' + IMGUR_CLIENT_ID);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === 200 && response.success) {
                callback(response.data.link);
            } else {
                var reader = new FileReader();
                reader.onload = function(e) {
                    callback(e.target.result);
                };
                reader.readAsDataURL(image);
            }
        }
    }
    xhr.send(data);
}


//------------------------------------------------------------------------------
//METHOD 2

export function selectLocalImage(editor) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
            saveToServer(editor, file);
        } else {
            console.warn('You could only upload images.');
        }
    };
}

/**
 * Step2. save to server
 *
 * @param {File} file
 */

export function saveToServer(editor, file) {

    console.log("file", file);

    const fd = new FormData();
    fd.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', constants.SERVICE_FILE_UPLOAD_URL, true);
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
    xhr.onload = () => {
        console.log(xhr);
        if (xhr.status === 200) {
            // this is callback data: url
            let data = JSON.parse(xhr.responseText);

            if (data.result){
                const url = data.thumbnail;
                insertToEditor(editor, url);
            }
        }
    };
    xhr.send(fd);
}

/**
 * Step3. insert image url to rich editor.
 *
 * @param {string} url
 */
function insertToEditor(editor, url) {
    // push image url to rich editor.
    const range = editor.getSelection();
    editor.insertEmbed(range.index, 'image', `${url}`);
}
