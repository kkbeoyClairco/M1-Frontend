import { Row } from 'react-bootstrap';
import SensorsTable from './SensorsTable';
import HorizontalStepper from './HorizontalStepper';

const SensorsMapping = () => {
    return (
<>         
<Row className='mb-5 '>
                <HorizontalStepper />
            </Row>
          
            <Row>
                <SensorsTable />
            </Row>
        </>
    );
};
export default SensorsMapping;
