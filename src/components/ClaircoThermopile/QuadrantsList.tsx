import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Collapse } from 'react-bootstrap';
import { Input } from 'react-bootstrap-typeahead';
import { handleInputChange } from 'react-select/dist/declarations/src/utils';
import { toast } from 'sonner';
import Slider from './Slider';
import { debounce } from 'lodash';

interface QuadrantsListInterface {
    zones: any;
    selectedQuadInput: null | number;
    setSelectedQuadrants: React.Dispatch<React.SetStateAction<number | null>>;
    setZones: React.Dispatch<React.SetStateAction<any>>;
    sendDataFn: any;
}
const arrowUp = `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001605/up-arrow_m9lzzm.png`;
const arrowDown = `https://res.cloudinary.com/dlulq6hny/image/upload/v1741001419/arrow-down-sign-to-navigate_u42dnf.png`;
const editIcon = `https://res.cloudinary.com/dlulq6hny/image/upload/v1747814144/edit_qfpqeu.png`;
const deleteIcon = `https://res.cloudinary.com/dlulq6hny/image/upload/v1747807327/trash_axvbbo.png`;
interface QuadrantIteratorProps {
    zone: any;
    isExpanded: boolean;
    index: number;
    handleDelete: any;
    handleEditing: any;
    handleNameChange: any;
    isEditable: boolean;
    thresholdControlFn: any;
}

const QuadrantIterator: React.FC<QuadrantIteratorProps> = ({
    zone,
    isExpanded,
    index,
    handleDelete,
    handleEditing,
    isEditable,
    handleNameChange,
    thresholdControlFn,
}) => {
    const [newName, setNewName] = useState<string | null>(null);
    return (
        <Card
            className=" my-2 mx-1 shadow-lg rounded-lg"
            style={{
                border: isExpanded ? '2px solid #007bff' : '1px solid #e0e0e0',
                background: isExpanded ? 'rgba(0,123,255,0.07)' : '#fff',
                boxShadow: isExpanded
                    ? '0 0 0 2px #007bff33, 0 4px 16px rgba(0,0,0,0.08)'
                    : '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
            }}>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    {' '}
                    {isExpanded && isEditable ? (
                        <div>
                            <label htmlFor="name" className="my-1">
                                Enter new Zone Name
                            </label>{' '}
                            <Input
                                onClick={(e) => {
                                    if (isExpanded) e.stopPropagation();
                                }}
                                id="name"
                                defaultValue={zone.name ?? ''}
                                className="rounded-lg my-1"
                                onChange={(e) => setNewName((e.target as HTMLInputElement)?.value ?? '')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleNameChange((e.target as HTMLInputElement)?.value ?? '', index);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <h4>{zone.name ?? ''}</h4>
                    )}{' '}
                    <img style={{ cursor: 'pointer' }} src={isExpanded ? arrowUp : arrowDown} height={20} alt="" />
                </div>
                <Collapse in={isExpanded}>
                    <div>
                        <p>Count : {zone?.count ?? 'N/A'}</p>
                        <p className="mt-1 mb-5">Threshold Temperature: {zone?.tTemp ? zone?.tTemp + '°C' : 'N/A'}</p>
                        {/* <div className="mt-2"> */}
                        <Slider
                            startInput={zone.tTemp ?? 0}
                            thresholdControlFn={(value: any) => thresholdControlFn(value, index)}
                            min={0}
                            max={15}
                        />
                        {/* </div> */}
                        <div className="d-flex justify-content-end mt-5">
                            <img
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // (index);
                                    handleEditing(index);
                                }}
                                className="me-2"
                                style={{ cursor: 'pointer' }}
                                src={editIcon}
                                // "https://res.cloudinary.com/dlulq6hny/image/upload/v1747807327/trash_axvbbo.png"
                                height={20}
                                alt="edit"
                            />
                            <img
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                }}
                                style={{ cursor: 'pointer' }}
                                src={deleteIcon}
                                // "https://res.cloudinary.com/dlulq6hny/image/upload/v1747807327/trash_axvbbo.png"
                                height={20}
                                alt=""
                            />
                        </div>
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
};
const QuadrantsList: React.FC<QuadrantsListInterface> = ({
    zones,
    setZones,
    selectedQuadInput,
    sendDataFn,
    setSelectedQuadrants,
}) => {
    const [isExpanded, setIsExpanded] = useState<number | null>(null);
    const [isEditable, setIsEditable] = useState<number | null>(null);
    const handleExpansion = (index: number) => {
        setIsExpanded(isExpanded === index ? null : index);
        setIsEditable(null);
    };

    const handleDelete = async (index: number) => {
        toast.warning(`Deleted ${index}`);

        setZones((zones: any) => zones?.filter((zone: any, i: number) => index !== i));
    };
    const handleEditing = async (index: number) => {
        setIsEditable(index);
        // toast.warning(`Editing ${index}`);
    };

    const handleThresholdControl = useMemo(
        () =>
            debounce(async (value: any, index: number) => {
                try {
                    console.log('THeshold Control', zones);
                    // const thresholds = zones.map((data: any, i: number) =>
                    //     index === i ? Number(value?.[0]) : data?.tTemp
                    // );
                    let thresholds: { [key: number]: any } = {};
                    for (let i = 0; i < zones.length; i++) {
                        thresholds[i] = zones[i]?.tTemp;
                    }
                    // thresho;
                    const zonesNew = zones.map((data: any, i: number) =>
                        i === index ? { ...data, tTemp: Number(value?.[0]) } : data
                    );
                    let data: any = {
                        type: 'thresholds',
                        thresholds,
                        //  JSON.stringify(thresholds),
                        // {"type":"thresholds","thresholds":{"0":6}}
                    };
                    data = JSON.stringify(data);
                    console.log('Data', data);
                    sendDataFn(data);
                    // console.log('THeshold Control', zones, thresholds, zonesNew);
                    setZones(zonesNew);
                } catch (error) {
                    console.log(error);
                }
            }, 400),
        [zones, sendDataFn, setZones]
    );
    const handleNameChange = async (name: string, index: number) => {
        try {
            // console.log('Enter', name, index);
            const newZoneData = zones.map((zone: any, i: number) => {
                if (index === i) zone.name = name;
                return zone;
            });
            setZones(newZoneData);
            setIsEditable(null);
        } catch (error) {
            toast.warning('Something went wrong');
        }
    };
    useEffect(
        function setSelectedQuadrantEffect() {
            if (setSelectedQuadrants) setSelectedQuadrants(isExpanded);
            console.log('is expanded changed', isExpanded);
        },
        [isExpanded, setSelectedQuadrants]
    );
    useEffect(() => {
        setIsExpanded(selectedQuadInput);
        setIsEditable(null);
    }, [selectedQuadInput]);

    useEffect(() => {
        console.log('ZOnes', zones);
    }, [zones]);
    return (
        <div className="h-100" style={{ maxHeight: '40em', overflowY: 'scroll' }}>
            {zones.length < 1 && <p className="text-center">Please select a new zone to display here.</p>}
            {zones.length >= 1 &&
                zones.map((zone: any, index: number) => {
                    return (
                        <div key={index} onClick={() => handleExpansion(index)}>
                            <QuadrantIterator
                                thresholdControlFn={handleThresholdControl}
                                key={index}
                                isEditable={index === isEditable}
                                zone={zone}
                                isExpanded={isExpanded === index}
                                index={index}
                                handleDelete={handleDelete}
                                handleEditing={handleEditing}
                                handleNameChange={handleNameChange}
                            />
                        </div>
                    );
                })}
        </div>
    );
};

export default QuadrantsList;
