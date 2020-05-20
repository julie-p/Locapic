export default function (pseudo = '', action) {
    
    switch (action.type) {
        case 'savePseudo' :
            return action.pseudo;
        default :
            return pseudo;
    }
};