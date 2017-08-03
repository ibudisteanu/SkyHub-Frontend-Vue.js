/**
 * Created by BIT TECHNOLOGIES on 7/12/2017.
 */

export function addSuffix(initialString, suffix, suffix2, maxLength){

    initialString = initialString || '';
    suffix = suffix || '';
    suffix2 = suffix2 || '';
    maxLength = maxLength || 100;

    if (initialString.length > maxLength)
        return initialString.substr(0, maxLength-3)+'...';

    if (initialString.length + suffix.length <= maxLength)
        return initialString +suffix;
    else
    if (initialString.length +suffix2.length <= maxLength)
        return initialString+suffix2;

    return initialString;
}