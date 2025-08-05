import React from 'react';
import { Container } from 'react-bootstrap';
import { KonvaLayer } from './KonvaLayer';
import { KonvaErrorBoundary } from './KonvaErrorBoundary';

export const KonvaTest: React.FC = () => {
    return (
        <Container className="py-4">
            <h3>Floor Plan Editor</h3>
            {/* <p>This is a simple test component to verify Konva is working properly.</p> */}

            <KonvaErrorBoundary>
                <KonvaLayer
                    floorPlanImage="https://res.cloudinary.com/dlulq6hny/image/upload/v1745837864/HCLlayout_4_k7jefr.svg"
                    onShapesChange={(shapes) => {
                        console.log('Shapes updated:', shapes);
                    }}
                    initialShapes={[]}
                />
            </KonvaErrorBoundary>
        </Container>
    );
};
