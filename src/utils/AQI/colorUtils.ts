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
