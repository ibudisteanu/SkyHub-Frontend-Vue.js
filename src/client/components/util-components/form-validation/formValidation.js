/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/24/2017.
 * (C) BIT TECHNOLOGIES
 */

//https://www.w3schools.com/bootstrap/bootstrap_forms_inputs2.asp DOC
export function showInputStatus (status){
    return status[0] === 'error' ? "has-error has-feedback" : (status[0] === 'success' ? "has-success has-feedback" : '');
}

export function showInputFeedback (status){
    return status[0] === 'error' ? "fa fa-remove form-control-feedback" : (status[0] === 'success' ?  "fa fa-check form-control-feedback" : '');
}

export function convertValidationErrorToString(error) {
    if (error === "notUnique") return "Already exists in the Database"; else
    if (error === "notEmpty") return "It's empty"; else
    if (error === "validateUsername") return " Invalid username";
    if (error === "validateKeywords") return " Too few keywords. Minimum 3";

    return error;
}