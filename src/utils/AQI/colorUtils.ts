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
    else if (value > 54 && value <= 154) return '#f2f262';
    else if (value > 154 && value <= 254) return '#f5b43e';
    else if (value > 254 && value <= 354) return '#FF4500';
    else if (value > 354 && value <= 424) return '#4EA4F8';
    else if (value > 424) return '#8B0000';
    else return '#A9A9A9';
};

export const getPM10Label = (value: number) => {
    if (value === 0) return 'N/A';
    if (value > 0 && value <= 54) return 'Good';
    else if (value > 54 && value <= 154) return 'Moderate';
    else if (value > 154 && value <= 254) return 'Poor';
    else if (value > 254 && value <= 354) return 'Unhealthy';
    else if (value > 354 && value <= 424) return 'Severe';
    else if (value > 424) return 'Hazardous';
    else return 'N/A';
};

export const getPM25Label = (value: number) => {
    if (value === 0) return 'N/A';

    if (value > 0 && value <= 13) return 'Good';
    else if (value > 13 && value <= 36) return 'Moderate';
    else if (value > 36 && value <= 56) return 'Poor';
    else if (value > 56 && value <= 151) return 'Unhealthy';
    else if (value > 151 && value <= 251) return 'Severe';
    else if (value > 251) return 'Hazardous';
    else return 'N/A';
};

export const getPMBgGradient = (pm10: number, pm25: number) => {
    // Get severity labels
    const pm10Label = getPM10Label(pm10);
    const pm25Label = getPM25Label(pm25);

    // Define severity order
    const severityOrder = ['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'];
    const gradients: Record<string, string> = {
        Good: 'linear-gradient(135deg, #e8fdf5 0%, #d2f8e5 100%)',
        Moderate: 'linear-gradient(135deg, #f7fafc 0%, #f2f262 100%)',
        Poor: 'linear-gradient(135deg, #fffbe7 0%, #f5b43e 100%)',
        Unhealthy: 'linear-gradient(135deg, #fff5f5 0%, #ffd6d6 100%)',
        Severe: 'linear-gradient(135deg, #ffeaea 0%, #ffd6d6 100%)',
        Hazardous: 'linear-gradient(135deg, #fff0f0 0%, #ffb3b3 100%)',
        'N/A': 'linear-gradient(135deg, #f7fafc 0%, #e0e0e0 100%)',
    };

    // Find the highest severity
    const pm10Idx = severityOrder.indexOf(pm10Label);
    const pm25Idx = severityOrder.indexOf(pm25Label);
    const highestLabel = pm10Idx > pm25Idx ? pm10Label : pm25Label;

    // Return the corresponding gradient
    return gradients[highestLabel] || gradients['N/A'];
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
    else return 'N/A';
};

// PM25 ARGB
export const getPM25ColorARGB = (value1: string) => {
    const value: number = Number(value1);
    if (!value || Number.isNaN(value)) {
        return;
    }
    if (value >= 0 && value <= 13) return 'FF59E759'; // Green
    else if (value > 13 && value <= 36) return 'FFF2F262'; //  Yellow
    else if (value > 36 && value <= 56) return 'FFF5B43E'; // Orange
    else if (value > 56 && value <= 151) return 'FFFF4500'; // Red
    else if (value > 151 && value <= 251) return 'FF4EA4F8'; //  Blue
    else if (value > 251) return 'FF8B0000'; // Dark Red
    else return 'FFFFFFFF'; // White
};

// PM 10 ARGB
export const getPM10ColorARGB = (value: number) => {
    if (value === 0) return 'FFFFFFFF';
    else if (value > 0 && value <= 54) return 'FF59e759';
    else if (value > 54 && value <= 154) return 'FFF2F262';
    else if (value > 154 && value <= 254) return 'FFF5B43E';
    else if (value > 254 && value <= 354) return 'FFFF4500';
    else if (value > 354 && value <= 424) return 'FF4EA4F8';
    else if (value > 424) return 'FF8B0000';
    else return 'FFFFFFFF';
};

//IAQ ARGB
export const getIAQColorARGB = (value: any) => {
    // if (value === 0) return 'FFFFFFFF';
    if (value > 0 && value <= 50) return 'FF59e759';
    else if (value > 50 && value <= 100) return 'FFf2f262';
    else if (value > 100 && value <= 200) return 'FFf5b43e';
    else if (value > 200 && value <= 300) return 'FFFF4500';
    else if (value > 300 && value <= 400) return 'FF4ea4f8';
    else if (value > 400) return 'FF8B0000';
    else return 'FFFFFFFF';
};
