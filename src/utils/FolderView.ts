import { iconConstant } from 'appConstants/claircoConstants';

export const getIcons = (type: string) => {
    // return iconConstant.folder;
    try {
        switch (type) {
            case 'Customer':
                return iconConstant.organization ?? '';
            case 'Building':
                return iconConstant.buildingBlack;
            case 'Floor':
                return iconConstant.floorPlan ?? '';
            case 'Device':
                return 'https://res.cloudinary.com/dlulq6hny/image/upload/v1740987619/technology_geqtsl.png';
            case 'Addition':
                return iconConstant.plusDarkBlack ?? '';
            case 'DownArrow':
                return iconConstant.arrowDown ?? '';

            case 'UpArrow':
                return iconConstant.arrowUp ?? '';

            default:
                return '';
        }
    } catch (error) {
        console.log(error);
        return '';
    }
};

// Helper to render the type name to additon
export const getTitles = (type: string) => {
    try {
        // const array=["Customer","Building","Floor","Device"]
        // return array
        switch (type) {
            case 'Customer':
                return 'Building';
            case 'Building':
                return 'Floor';
            case 'Floor':
                return 'Device';
            default:
                return '';
        }
    } catch (error) {
        console.log(error);
    }
};
