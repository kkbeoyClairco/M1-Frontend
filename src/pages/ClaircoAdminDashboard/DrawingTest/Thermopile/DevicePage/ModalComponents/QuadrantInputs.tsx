import React, { useEffect, useState } from 'react';
import QuadrantsTable from './QuadrantsTable';
import InputForm from './InputForm';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'sonner';
import * as Yup from 'yup';
import classNames from 'classnames';
import { forEach } from 'lodash';
const dataSchema = Yup.object().shape({
    zoneName: Yup.string().required('Zone Name is required'),
    blob: Yup.number()
        .required('Blob is required')
        .min(0, 'Blob must be greater than or equal to 0')
        .max(100, 'Blob must be less than or equal to 100'),
});
interface QuadrantInputsInterface {
    points: { x: number; y: number }[];
    modalControlFn?: React.Dispatch<React.SetStateAction<any>>;
}
const QuadrantInputs: React.FC<QuadrantInputsInterface> = ({ points, modalControlFn }) => {
    const [data, setData] = useState<{ zoneName: string; blob: number }>();
    const [inputError, setInputError] = useState();
    const handleSubmit = async () => {
        try {
            if (points && points?.length < 4) {
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
        console.log('Points', points);
    }, [points]);

    return (
        <Row className="w-100 h-100 m-2 p-3">
            <InputForm data={data} setData={setData} />
            <QuadrantsTable points={points} />
            <Col className="d-flex justify-content-end mt-3">
                <Button
                    onClick={modalControlFn}
                    type="button"
                    className="ms-2 btn-secondary h-50"
                    // style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                >
                    Close
                </Button>{' '}
                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="ms-2 h-50"
                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                    Submit
                </Button>
            </Col>
        </Row>
    );
};

export default QuadrantInputs;
