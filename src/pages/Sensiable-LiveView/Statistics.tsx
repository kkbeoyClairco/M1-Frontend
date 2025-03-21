import { Row, Col } from 'react-bootstrap';
import floor from 'assets/images/sensiable/floor.svg'
import clienIcon from 'assets/images/sensiable/Client icon.svg'
import Meetingroom from 'assets/images/sensiable/Meetingroom.svg'
import Environment from 'assets/images/sensiable/Environment.svg'
import StatisticsWidget from './StatisticsWidget';
import StatisticsChartWidget from './StatisticsChartWidget';
import StatisticsOfficeEnvironment from './StatisticsOfficeEnvironment ';
import { useEffect, useState } from 'react';


const Statistics = () => {
     let CharWidgetObject = {
        stats: '' ,
      percentage:'',
      stats1: '' ,
      stats2: '' ,
      stats3: '' ,
      temp:'',
      Humidity:'',
      Co2:'',
      VOC:'',
      apexData:'',
    } 

    const [liveiewData,setLiveviewData]=useState<any>([]);

    useEffect(() => {
      setLiveviewData({
            stats: '33,333',
            percentage:'90',
            stats1: '100' ,
            stats2: '90' ,
            stats3: '10' ,
            temp:'10',
            Humidity:'20',
            Co2:'10',
            VOC:'10',
            apexData: [44, 55, 67, 83], // Include apexData in the state

        });
      
    }, []);
const getLiveviewData=async()=>{
  try{
    const response = await getLiveviewData();
    const data = response
    setLiveviewData(data);
  }
  catch (e: any) {
    console.log(e.message);
}

}
    return (
        <Row>
                <Col md={6} xl={3}>
     <StatisticsWidget
        iconPath={floor} 
        title="Dubai-Floor 1"
        description="Widget description"
        stats={liveiewData.stats}
        trend={{
          time: "offline"
        }}
        additionalTitle="Total Assets Monitored" 
      />
                </Col>
                <Col md={6} xl={3}>
  <StatisticsChartWidget
    iconPath={clienIcon}
    description="Deals"
    title="Seats"
    stats1={liveiewData.stats1}
    stats2={liveiewData.stats2}
    stats3={liveiewData.stats3}
     dataPercentage={liveiewData.percentage} 
    trend={{
      textClass: 'text-success',
      icon: 'mdi mdi-arrow-up-bold',
      value: 'Available',
    }}
    colors={['#727cf5']}
  ></StatisticsChartWidget>
</Col>
            <Col md={6} xl={3}>
  <StatisticsChartWidget
    iconPath={Meetingroom}
    description="Deals"
    title="Meeting Room"
    stats1={liveiewData.stats1}
    stats2={liveiewData.stats2}
    stats3={liveiewData.stats3}
    dataPercentage={liveiewData.percentage} 
    trend={{
      textClass: 'text-success',
      icon: 'mdi mdi-arrow-up-bold',
      value: 'UnAvailable',
    }}
    colors={['#727cf5']}
  ></StatisticsChartWidget>
</Col>

            <Col md={6} xl={3}>
                <StatisticsOfficeEnvironment
                    iconPath={Environment}
                    description="Deals"
                    title="Office Environment"
                    temp={liveiewData.temp}
                    Humidity={liveiewData.Humidity}
                    Co2={liveiewData.Co2}  
                    Voc={liveiewData.VOC}  

                                      trend={{
                        textClass: 'text-success',
                        icon: 'mdi mdi-arrow-up-bold',
                        value: 'Not Ideal',
                    }}
                    colors={['#727cf5']}
                    apexData={liveiewData.apexData}

                ></StatisticsOfficeEnvironment>
                </Col>
        </Row>
    );
};

export default Statistics;
