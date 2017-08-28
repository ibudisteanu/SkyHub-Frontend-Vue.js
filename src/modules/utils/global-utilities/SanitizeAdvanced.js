import sanitizeHtml from 'sanitize-html';

export function sanitizeStripAllTags(text, allowedTags, allowedAttributes){

    if (text === null) return null;

    if (typeof allowedTags === 'undefined') allowedTags = [];
    if (typeof allowedAttributes === 'undefined') allowedAttributes = {};

    return sanitizeHtml(text,
        {
            allowedTags: allowedTags,
            allowedAttributes: allowedAttributes,
        });
}

export function sanitizeAdvanced(text, enableAnchors) {

    if (typeof enableAnchors === 'undefined') enableAnchors = true;

    text = sanitizeHtml(text,
        {
            allowedTags: [ (enableAnchors ? 'a' : ''),'b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li', 'br', 'span','p','div','em','iframe','img'],
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
        });

    return text
}

export function sanitizeAdvancedSimple(text, enableAnchors) {

    if (typeof enableAnchors === 'undefined') enableAnchors = true;

    text = sanitizeHtml(text,
        {
            allowedTags: [(enableAnchors ? 'a' : ''),'b','i','u','strong','div','font','ul','li', 'br', 'span','p','div','em','iframe','img'],
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
        });

    return text;
}

export function sanitizeAdvancedShortDescription(text, limit, enableAnchors) {

    if (typeof limit === 'undefined') limit = 512;
    if (typeof enableAnchors === 'undefined') enableAnchors = true;

    text = sanitizeAdvancedSimple(text, enableAnchors);
    if (text.length > 512) {
        text = text.substr(0, limit);
        text = sanitizeAdvancedSimple(text, enableAnchors);
    }

    return text;

}