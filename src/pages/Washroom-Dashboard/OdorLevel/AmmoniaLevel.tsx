import { useState } from "react";
import { Badge, Breadcrumb, Card, ProgressBar } from "react-bootstrap";

const AmmoniaLevel=()=>{
    const[ammoniaStatistics,setAmmoniaStatistics]= useState({
        
        ammoniaLevel: {
            value: 65, // Example value, replace with your actual value
            trend: 59, // Example trend value
          },
    })
//     const getAmmonniaStatistics=async()=>{
//         try{
// const response=await getAmmonniaStatistics();
// setAmmoniaStatistics(response);
//         }
//         catch(error){
//             console.log('Error',error)

//         }

//     }
    return(
<>
<Card>
                <Card.Body>
                    <h4 className="fw-semibold mt-0 mb-3">
                        
     Ammonia Level 
      <Badge bg="success-lighten" className="text-success fw ms-sm-1">
                            <i className="mdi mdi-trending-up me-1"></i>{ammoniaStatistics.ammoniaLevel.trend}%
                        </Badge>
                    </h4>
                    <h5 className="float-end mt-0">{ammoniaStatistics.ammoniaLevel.value}</h5>
                    <Breadcrumb className='' style={{ marginTop: '-30px' }}>
            <Breadcrumb.Item href="/ui/breadcrumb">Location</Breadcrumb.Item>
            <Breadcrumb.Item href="/ui/breadcrumb">Building</Breadcrumb.Item>
            <Breadcrumb.Item active>Floor</Breadcrumb.Item>
          </Breadcrumb>               
          <ProgressBar now={ammoniaStatistics.ammoniaLevel.value} style={{ height: 3 }} variant="info" />
                </Card.Body>
            </Card>

</>
    );
}; export default AmmoniaLevel