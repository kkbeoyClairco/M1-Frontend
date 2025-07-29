import { scalingFactorVGAdot3Camera, vgaCameradot3mpResolution } from 'appConstants/DeviceConstants';
import React, { useState } from 'react';
import { Card, Row } from 'react-bootstrap';
import { Circle, Image, Layer, Line, Stage, Text } from 'react-konva';
const imageURL =
    'https://res.cloudinary.com/dlulq6hny/image/upload/v1745990479/WhatsApp_Image_2025-04-30_at_10.48.55_66f50f99_vpshai.jpg';
//  `https://res.cloudinary.com/dlulq6hny/image/upload/v1738841215/estate-360-spotlight-1_mj2co0.jpg`;
const quadrilaterals = [
    [{ x: 50, y: 50 }, { x: 150, y: 50 }, { x: 150, y: 150 }, { x: 50, y: 150 }, 20],
    [{ x: 200, y: 100 }, { x: 300, y: 100 }, { x: 300, y: 200 }, { x: 200, y: 200 }, 15],
    [{ x: 100, y: 250 }, { x: 200, y: 250 }, { x: 200, y: 350 }, { x: 100, y: 350 }, 10],
    [{ x: 250, y: 300 }, { x: 350, y: 300 }, { x: 350, y: 390 }, { x: 250, y: 390 }, 5],
];
const scaleFactor = 1 / 2;

const getCenterPosition = (quad: any[]) => {
    const scaleFactor = 1 / 2;
    const x = (quad.reduce((sum, p) => sum + (p?.x ?? 0), 0) / 4) * scaleFactor - 5;
    const y = (quad.reduce((sum, p) => sum + (p?.y ?? 0), 0) / 4) * scaleFactor - 5;
    return { x, y };
};
const ThermalImageWithQuadrants = () => {
    const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
    React.useEffect(() => {
        const img = new window.Image();
        img.src = imageURL;
        img.onload = () => setImage(img);
    }, []);
    return (
        <Card
            className="d-flex justifyc-content-center align-item-center shadow-lg rounded-lg"
            style={{ height: '22em' }}>
            <Card.Body>
                {' '}
                <Row>
                    <h6>Thermal Image With Zones</h6>
                </Row>{' '}
                <Row>
                    <Stage
                        className="rounded-lg"
                        width={vgaCameradot3mpResolution.width * scaleFactor}
                        height={vgaCameradot3mpResolution.height * scaleFactor}>
                        <Layer>
                            {image && (
                                <Image
                                    image={image}
                                    width={vgaCameradot3mpResolution.width * scaleFactor}
                                    height={vgaCameradot3mpResolution.height * scaleFactor}
                                />
                            )}
                            {quadrilaterals?.map((quad: any, quadIndex: any) => {
                                const center = getCenterPosition(quad);
                                return (
                                    <>
                                        <Line
                                            points={quad
                                                ?.slice(0, 4)
                                                ?.flatMap((point: { x: any; y: any }) => [
                                                    point.x * scaleFactor,
                                                    point.y * scaleFactor,
                                                ])}
                                            closed={true}
                                            fill="rgba(0, 0, 10, 0.5)"
                                            stroke="green"
                                            strokeWidth={1}
                                        />
                                        <Text
                                            text={quad[4] ?? ''}
                                            x={center.x}
                                            y={center.y}
                                            fontSize={14}
                                            fill="yellow"
                                            align="center"
                                            verticalAlign="middle"
                                            // draggable
                                        />
                                    </>
                                );
                            })}
                        </Layer>
                    </Stage>
                </Row>
            </Card.Body>{' '}
        </Card>
    );
};

export default ThermalImageWithQuadrants;
