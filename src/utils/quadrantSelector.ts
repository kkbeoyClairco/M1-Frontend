// import { vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';
export const vgaCameradot3mpResolution = {
    width: 640,
    // 480,
    height: 640,
};

export const scalingFactorVGAdot3Camera = 2 / 3;

export const getNormalizedRectangles = (zonesList: any, scalingFactor: number) => {
    const width = vgaCameradot3mpResolution.width * scalingFactor;
    const height = vgaCameradot3mpResolution.height * scalingFactor;

    return zonesList.map((zone: any) => {
        const xs = zone.points.map((p: any) => p.x);
        const ys = zone.points.map((p: any) => p.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        // Normalize
        return [minX / width, minY / height, maxX / width, maxY / height];
    });
};
