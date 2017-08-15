import sanitizeHtml from 'sanitize-html';

export function sanitizeAdvanced(text) {
    return sanitizeHtml(text,
        {
            allowedTags: ['a','b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li','img', 'br', 'span','p','div','em','iframe'],
            allowedAttributes: {
                'a': [ 'href' ],
                'img': ['class','src','width','height', 'style','width','height'],
                'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                'font': ['class','style'],
                'div': ['class','style'],
                'p': ['class','style'],
                'em': ['class','style'],
                'span': ['class','style'],
            }
        })
}

export function sanitizeAdvancedSimple(text) {
    return sanitizeHtml(text,
        {
            allowedTags: ['a','b','i','u','strong','div','font','ul','li', 'br', 'span','p','div','em','iframe'],
            allowedAttributes: {
                'a': [ 'href' ],
                'img': ['class','src','width','height', 'style','width','height'],
                'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                'font': ['class'],
                'div': ['class'],
                'p': ['class'],
                'em': ['class'],
                'span': ['class'],
            }
        })
}

export function sanitizeAdvancedShortDescription(text, limit) {

    if (typeof limit === 'undefined') limit = 512;

    text = sanitizeAdvancedSimple(text);
    if (text.length > 512) text = text.substr(0, limit);
    text = sanitizeAdvancedSimple(text);

    return text;

}