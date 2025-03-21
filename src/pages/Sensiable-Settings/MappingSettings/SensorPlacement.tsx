import { Button, Card, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FormInput } from 'components';

const SensorPlacement = () => {
 
    const methods = useForm({
        defaultValues: {
            password: '12345',
            statictext: 'email@example.com',
            color: '#727cf5',
        },
    });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    return (
        <>
            <Row>
                <Col lg={3}>
                    <Button variant="primary">Add Sensors</Button>
                </Col>
                <Col>
                    <form onSubmit={handleSubmit(() => {})}>
                        <FormInput
                            label=""
                            type="text"
                            name="AddSensors"
                            placeholder="Enter the Number of sensors "
                            containerClass={'mb-3 ms-n3'}
                            register={register}
                            key="text"
                            errors={errors}
                            control={control}
                        />
                    </form>
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <Button variant="primary">Edit Sensor </Button>
                </Col>
                <Col lg={9}>
                    <form onSubmit={handleSubmit(() => {})}>
                        <Row >
                            <Col  sm = {12} md={6} lg={6}>
                                <FormInput
                                    label=""
                                    type="text"
                                    name="EditSensors-X"
                                    placeholder="X-axis Value"
                                    containerClass={'mb-3 ms-n3'}
                                    register={register}
                                    key="text"
                                    errors={errors}
                                    control={control}
                                />
                            </Col>
                            <Col sm = {12} md={6} lg={6}>
                                <FormInput
                                    label=""
                                    type="text"
                                    name="EditSensors-Y"
                                    placeholder="Y-axis Value"
                                    containerClass={'mb-3 ms-n3'}
                                    register={register}
                                    key="text"
                                    errors={errors}
                                    control={control}
                                />
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <Button variant="primary">Delete Sensor</Button>
                </Col>
                <Col>
                    <form onSubmit={handleSubmit(() => {})}>
                        <FormInput
                            label=""
                            type="text"
                            name="DeleteSensors"
                            placeholder="Enter Sensor ID"
                            containerClass={'mb-3 ms-n3'}
                            register={register}
                            key="text"
                            errors={errors}
                            control={control}
                        />
                    </form>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Button variant="primary" style={{width :'100%'}} >Mark Seat on Layout</Button>
                </Col>
                <Col>
                    <Button variant="primary" style={{width :'100%'}}>Auto Detect Seat & Sensor Placement</Button>     
                </Col>
            </Row>
        </>
    );
};

export default SensorPlacement;
