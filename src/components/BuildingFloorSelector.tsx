import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';

interface OptionType {
    label: string;
    value: string;
}

interface BuildingFloorSelectorProps {
    onBuildingChange?: (building: SingleValue<OptionType> | null) => void;
    onFloorChange?: (floor: SingleValue<OptionType> | null) => void;
    onFloorPlanButtonClick: () => void;
    buildingOptions?: OptionType[];
    floorOptions?: OptionType[];
    selectedBuilding?: string;
    selectedFloor?: string;
}

const BuildingFloorSelector: React.FC<BuildingFloorSelectorProps> = ({
    onBuildingChange,
    onFloorChange,
    onFloorPlanButtonClick,
    buildingOptions = [],
    floorOptions = [],
    selectedBuilding,
    selectedFloor,
}) => {
    const [building, setBuilding] = useState<OptionType | null>(
        selectedBuilding ? buildingOptions.find((opt) => opt.value === selectedBuilding) || null : null
    );
    const [floor, setFloor] = useState<OptionType | null>(
        selectedFloor ? floorOptions.find((opt) => opt.value === selectedFloor) || null : null
    );

    const handleBuildingChange = (selectedOption: SingleValue<OptionType>) => {
        setBuilding(selectedOption);
        if (onBuildingChange) {
            onBuildingChange(selectedOption ? selectedOption : null);
        }
    };

    const handleFloorChange = (selectedOption: SingleValue<OptionType>) => {
        setFloor(selectedOption);
        if (onFloorChange) {
            onFloorChange(selectedOption ? selectedOption : null);
        }
    };
    const handleFloorPlanLoadingClick = () => {
        if (onFloorPlanButtonClick) onFloorPlanButtonClick();
    };
    return (
        <Card>
            <Card.Body>
                <Row className="mb-2">
                    <Col md={12}>
                        <div className="mb-3">
                            <label className="form-label">Select Building</label>
                            <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                options={buildingOptions}
                                value={building}
                                onChange={handleBuildingChange}
                                placeholder="Choose a building..."
                                isClearable
                            />
                        </div>
                    </Col>
                    <Col md={12}>
                        <div className="mb-3">
                            <label className="form-label">Select Floor</label>
                            <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                options={floorOptions}
                                value={floor}
                                onChange={handleFloorChange}
                                placeholder="Choose a floor..."
                                isClearable
                            />
                        </div>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer className="text-end">
                <Button variant="success" onClick={handleFloorPlanLoadingClick}>
                    Load Floor Image
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default BuildingFloorSelector;
