import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { toast } from 'sonner';
import * as Yup from 'yup';

import QuadrantsList from './QuadrantsList';
const dataSchema = Yup.object().shape({
    zoneName: Yup.string().required('Zone Name is required'),
    blob: Yup.number()
        .required('Blob is required')
        .min(0, 'Blob must be greater than or equal to 0')
        .max(100, 'Blob must be less than or equal to 100'),
});
interface QuadrantDetailsInterface {
    zones: { name: string; points: { x: number; y: number }[] }[];
    selectedQuadInput: number | null;
    setSelectedQuadrants: React.Dispatch<React.SetStateAction<number | null>>;
    // modalControlFn?: React.Dispatch<React.SetStateAction<any>>;
    setZones: React.Dispatch<React.SetStateAction<any>>;
    sendDataFn: any;
}
const QuadrantDetails: React.FC<QuadrantDetailsInterface> = ({
    zones,
    selectedQuadInput,
    // modalControlFn,
    setSelectedQuadrants,
    setZones,
    sendDataFn,
}) => {
    const [data, setData] = useState<{ zoneName: string; blob: number }>();
    // const [inputError, setInputError] = useState();
    const handleSubmit = async () => {
        try {
            if (!zones || zones.length < 1) {
                toast.error('Please mark the required zones before continuing.');
                return;
            }
            dataSchema
                .validate(data, { abortEarly: false })
                .then((res) => {
                    console.log('Res', res);
                    // setInputError({});
                })
                .catch((error: any) => {
                    error.inner.forEach((err: any) => console.log(err.path, ':', err.message));
                });
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // console.log('Zone Change', zones);
    }, [zones]);

    return (
        <Card className="w-100  my-2 mt-3 mx-0 px-1 py-3  pt-0 h-100">
            <Card.Body>
                <Card.Header className="p-0">
                    <h4 className="text-center"> New Quadrants</h4>
                </Card.Header>
                <QuadrantsList
                    zones={zones}
                    selectedQuadInput={selectedQuadInput}
                    setSelectedQuadrants={setSelectedQuadrants}
                    setZones={setZones}
                    sendDataFn={sendDataFn}
                />
                <Col className="d-flex justify-content-end mt-3">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="ms-2 h-50"
                        style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                        Submit
                    </Button>
                </Col>
            </Card.Body>
        </Card>
    );
};

export default QuadrantDetails;
