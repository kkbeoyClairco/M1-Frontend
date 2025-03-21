import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import StatisticsWidget from './StatisticsWidget';
import Tissue4 from 'assets/images/sensiable/Tissue4.svg'
import Soap2 from 'assets/images/sensiable/Soap2.svg'
import BroomStick from 'assets/images/sensiable/BroomStick.svg'
import Dust from 'assets/images/sensiable/Dust.svg'




const Statistics = () => {
    const [statistics,setStatistics]=useState({
        tissue:{
            stats:'36,254',
            value:'5.44%',
        },
        soap:{
            stats:'36,254',

            value:'5.44%', 
        },
        cleanups:{
            stats:'36,254',
            value:'5.44%',
        },
        washroom:{
            stats:'36,254',
            value:'5.44%', 
        }
    })
    // const getStatistics=async()=>{
    //     try{
    //         const response=await getStatistics();
    //         setStatistics(response);
    //     }
    //     catch(error){
    //         console.log('Error',error)
    //     }
    // }
    return (
        <>
            <Row>
                <Col sm={6}>
                    <StatisticsWidget
                        iconPath={Tissue4}
                        description="Number of Customers"
                        title="Tissue Paper Dispenser Refills"
                        stats={statistics.tissue.stats}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: statistics.tissue.value,  
                            time: 'Since last month',
                        }}
                    ></StatisticsWidget>
                </Col>

                <Col sm={6}>
                    <StatisticsWidget
                        iconPath={Soap2}
                        description="Revenue"
                        title="Soap Dispensers Refills"
                        stats={statistics.soap.stats}
                        trend={{
                            textClass: 'text-danger',
                            icon: 'mdi mdi-arrow-down-bold',
                            value: statistics.soap.value,  
                            time: 'Since last month',
                        }}
                    ></StatisticsWidget>
                </Col>
            </Row>

            <Row>
            <Col sm={6}>
                    <StatisticsWidget
                        iconPath={BroomStick}
                        description="Customers"
                        title="Clean ups Required"
                        stats={statistics.cleanups.stats}
                        trend={{
                            textClass: 'badge badge-light-lighten',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: statistics.cleanups.value,  
                            time: 'Since last month',
                        }}
                        bgClass="bg-primary"
                        textClass="text-white"></StatisticsWidget>
                </Col>
                <Col sm={6}>
                    <StatisticsWidget
                        iconPath={Dust}
                        description="Customers"
                        title="Dustbin Clean Up Required"
                        stats={statistics.washroom.stats}
                        trend={{
                            textClass: 'badge badge-light-lighten',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: statistics.washroom.value,  
                            time: 'Since last month',
                        }}
                        bgClass="bg-primary"
                        textClass="text-white"></StatisticsWidget>
                </Col>
                
            </Row>
        </>
    );
};

export default Statistics;
