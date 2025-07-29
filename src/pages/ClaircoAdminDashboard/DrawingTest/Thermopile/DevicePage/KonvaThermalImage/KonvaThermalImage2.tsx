import React, { useEffect, useState } from 'react';
import { Image, Layer, Rect, Stage, Text } from 'react-konva';
import Konva from 'konva';
import {
    formatTemperatureInput,
    getTemperatureColor,
    getTemperatureColorChroma,
    getTemperatureLimits,
} from './thermalImage';
import { vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';
// import { image } from '../constant';

const scalingFactor = 0.5;
interface KonvaThermalImageInterface {
    overlayState: boolean;
    temperatureArray: any[];
    opacity: number;
    image: string;
}
const KonvaThermalImage2: React.FC<KonvaThermalImageInterface> = ({
    overlayState,
    temperatureArray,
    opacity,
    image,
}) => {
    const [thermalData, setThermalData] = useState<[number, number, number][]>([]);
    // const stageRef = useRef<Konva.Stage>(null); // Reference the Konva Stage
    const [stageSize, setStageSize] = useState({
        width: vgaCameradot3mpResolution.width * scalingFactor,
        height: vgaCameradot3mpResolution.height * scalingFactor,
    });
    const [rawimage, setRawImage] = useState<HTMLImageElement | undefined>(undefined);
    const [limits, setLimits] = useState({ min: 18, max: 40 });

    const scaleX = 640 / 32;
    const scaleY = 480 / 24;
    useEffect(
        function setRawImageEffect() {
            // const image = new window.Image();
            // image.src = imageURL;
            // image.onload = () => setRawImage(image);
            const img = new window.Image();
            img.src = `data:image/jpeg;base64,${image}`;
            img.onload = () => setRawImage(img);
            console.log('Image Width and height', img.width, img.height);
        },
        [image]
    );

    useEffect(
        function setTemperatureData() {
            const temp = temperatureArray;
            console.log('Array size', temp.length, temp[0].length);
            const formattedTemp = formatTemperatureInput(temp);
            // const { min, max } = getTemperatureLimits(temp);
            console.log('Formatted TEmp', formattedTemp);
            setThermalData(formattedTemp);
            // setLimits({ min, max });
        },
        [temperatureArray]
    );
    // useEffect(() => {
    //     if (stageRef.current) {
    //         setStageSize({
    //             width: stageRef.current.width(),
    //             height: stageRef.current.height(),
    //         });
    //     }
    // }, []);

    return (
        <Stage
            className="d-flex justify-content-center align-items-center overflow-auto rounded-lg"
            // ref={stageRef}
            width={640}
            height={480}
            // style={{ position: 'absolute', top: 0, left: 0 }}
        >
            <Layer>
                {overlayState && rawimage && (
                    <Image
                        image={rawimage}
                        width={640}
                        height={480}
                        // rotation={180} // Rotate by 90 degrees
                        // offsetX={(stageSize.width * 2) / 3} // Half of width
                        // offsetY={(stageSize.height * 2) / 3} //
                    />
                )}
                {thermalData.map(([x, y, temp], index) => (
                    <React.Fragment>
                        <Rect
                            key={index}
                            x={x * scaleX}
                            y={y * scaleY}
                            width={scaleX}
                            height={scaleY}
                            draggable
                            fill={getTemperatureColorChroma(temp, limits.min, limits.max)}
                            opacity={opacity ?? 0.5}
                        />
                        <Text
                            x={x * scaleX}
                            y={y * scaleY}
                            width={scaleX}
                            height={scaleY}
                            text={temp.toFixed(1)}
                            fontSize={(stageSize.height / 24) * 0.5}
                            align="center"
                            // verticalAlign is not supported in react-konva Text
                            fill="#fff"
                            opacity={opacity ?? 0.5}
                            listening={false}
                            // Center the text vertically using offsetY
                            offsetY={-((stageSize.height / 24) * 0.5) / 2}
                        />
                    </React.Fragment>
                ))}
            </Layer>
        </Stage>
    );
};

export default KonvaThermalImage2;
