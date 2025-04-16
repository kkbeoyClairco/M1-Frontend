export const getIAQColor = (value: any) => {
    if (value > 0 && value <= 50) return '#59e759';
    else if (value > 50 && value <= 100) return '#f2f262';
    else if (value > 100 && value <= 150) return '#f5b43e';
    else if (value > 150 && value <= 200) return '#FF4500';
    else if (value > 200 && value <= 300) return '#4ea4f8';
    else if (value > 300) return '#8B0000';
    else return '#A9A9A9';
};
export const getAQILabels = (value: any) => {
    if (value > 0 && value <= 50) return 'Good';
    else if (value > 50 && value <= 100) return 'Moderate';
    else if (value > 100 && value <= 150) return 'Unhealthy ';
    else if (value > 150 && value <= 200) return 'Unhealthy ';
    else if (value > 200 && value <= 300) return 'Very Unhealthy';
    else if (value > 300) return 'Hazardous';
    return '';
};

export const getPM25Color = (value: number) => {
    if (value >= 0 && value <= 13) return '#59e759';
    else if (value > 13 && value <= 36) return '#f2f262';
    else if (value > 36 && value <= 56) return '#f5b43e';
    else if (value > 56 && value <= 151) return '#FF4500';
    else if (value > 151 && value <= 251) return '#4EA4F8';
    else if (value > 251) return '#8B0000';
    else return '#A9A9A9';
};

export const getPM10Color = (value: number) => {
    if (value >= 0 && value <= 54) return '#59e759';
    else if (value >= 55 && value <= 154) return '#f2f262';
    else if (value >= 155 && value <= 254) return '#f5b43e';
    else if (value >= 255 && value <= 354) return '#FF4500';
    else if (value >= 355 && value <= 424) return '#4EA4F8';
    else if (value > 424) return '#8B0000';
    else return '#A9A9A9';
};

export const getVocColor = (value: number) => {
    if (value > 0 && value <= 40) return '#59e759';
    else if (value > 40 && value <= 100) return '#f2f262';
    // else if (value <= 40 && value <= 100) return 'Poor';
    else if (value >= 101 && value <= 300) return '#f5b43e';
    else if (value >= 301 && value <= 1000) return '#FF4500';
    else if (value > 1000) return '#8B0000';
    else return '#A9A9A9';
};
export const getVoCLabel = (value: number) => {
    if (value > 0 && value <= 40) return 'Good';
    else if (value > 40 && value <= 100) return 'Moderate';
    // else if (value <= 40 && value <= 100) return 'Poor';
    else if (value >= 101 && value <= 300) return 'Poor';
    else if (value >= 301 && value <= 1000) return 'Unhealthy';
    else return '';
};
