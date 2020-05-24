export default function (POIList= [], action) {

    let POIListCopy = [...POIList];

    switch (action.type) {
        case 'savePOI' :
            POIListCopy.push(action.POI);
            return POIListCopy;

        case 'deletePOI' :
            POIListCopy = POIListCopy.filter(e => e.title !== action.POITitle);
            return POIListCopy;

        default :
            return POIList;
    }
};