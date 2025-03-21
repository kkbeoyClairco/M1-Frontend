import React from 'react';
// import { Stepper, Step } from 'react-form-stepper';

const labelStyle = {
  color: '#A1A9B1',
  marginTop: '150px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const smallerStepStyle = {
  width: '25px',
  height: '20px',
  backgroundColor: '#A1A9B1',
};

const HorizontalStepper = () => (
  
  <div className='mb-5 '>
    <h3 className="page-title">Commisioning</h3>
    <h5  style={{fontWeight:'normal'}}> Add Building, Seat Type and Business Unit</h5>

    {/* <Stepper activeStep={4}>
    <Step  style={{...smallerStepStyle, backgroundColor: 'blue'}}>
        <div style={{ ...labelStyle, whiteSpace: 'nowrap',  color: '#144059',
 }}>Customer</div>
      </Step>
      <Step  style={{...smallerStepStyle, backgroundColor: 'blue'}}>
        <div style={{ ...labelStyle, whiteSpace: 'nowrap',  color: '#144059',
 }}>Create Building Seat Type and BU</div>
      </Step>
      <Step style={smallerStepStyle}>

        <div style={{ ...labelStyle, whiteSpace: 'nowrap', }}>Upload layout & Configure Floor</div>
      </Step>
      <Step style={smallerStepStyle}>
        <div style={{ ...labelStyle, whiteSpace: 'nowrap' }}>Seat Mapping & Meeting Room Mapping</div>
      </Step>
      <Step style={smallerStepStyle}>
        <div style={{ ...labelStyle, whiteSpace: 'nowrap' }}>Download Site commissioning sequence file</div>
      </Step>
      <Step style={smallerStepStyle}>
        <div style={{ ...labelStyle, whiteSpace: 'nowrap' }}>Verify & Configure sensors</div>
      </Step>
    </Stepper> */}
  </div>
);

export default HorizontalStepper;
