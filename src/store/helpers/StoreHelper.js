/**
 * Created by Alexandru Ionut Budisteanu - SkyHub on 6/25/2017.
 * (C) BIT TECHNOLOGIES
 */


export function calculateNewObjectsToBeAdded(newContentObjects, previousContentObjects){

    if (newContentObjects.constructor !== Array) newContentObjects = [newContentObjects];

    let toBeAdded = [];

    for (let i=0; i<newContentObjects.length; i++ ){

        let newObject = newContentObjects[i].object;

        let bFound=false;

        if ((previousContentObjects !== null) )
            for (let obj in previousContentObjects)
                if (newObject.id === obj.id){
                    bFound=true;
                    break;
                }

        if ((!bFound)&&(newObject!==null)&&(newObject.id !== null)) {
            newObject = ContentObjectService.createObject(newObject);

            if (newObject !== null)
                toBeAdded.push(newObject);
        }

    }

    return toBeAdded;
}