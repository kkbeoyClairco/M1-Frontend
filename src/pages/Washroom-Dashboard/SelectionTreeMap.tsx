import ECharts from 'echarts-for-react';
import {  Card, Col, Row } from 'react-bootstrap';
import Building from 'assets/images/sensiable/Building.svg'
import { useState } from 'react';
const SelectionTreemap = () => {
  const[selectionTreemap, setSelectionTreemap] = useState();
//   const getselectionTreemap=async()=>{
//     try{
// const response =await getselectionTreemap ();
// setSelectionTreemap(response);

//     }
//     catch(error){
//       console.log("Error", Error);

//     }
    

//   }

  const option = {
    series: {
      type: 'sunburst',
      data: [
        {
          name: 'BOSCH',
          itemStyle: {
            color: '#77C87C' 
          },
          label: {
            color: 'black' // Change the text color of the "Bosch" label to black
          },

          children: [
            {
              name: '605',
              value: 15,
              itemStyle: {
                color: '#FFC262' // Change the color of the "Bosch" section to red
              },
              children: [
                {
                  name: 'Floor1',
                  value: 2 ,
                   itemStyle: {
                    color: '#FF925E' // Change the color of the "Bosch" section to red
                  },
                  
                },
                {
                  name: 'Floor2',
                  value: 5,
                  itemStyle: {
                    color: '#FFB060' // Change the color of the "Bosch" section to red
                  },
                  children: [
                    {
                      name: 'Sales',
                      value: 2,
                      itemStyle: {
                        color: '#FF925E' // Change the color of the "Bosch" section to red
                      },
                    }
                  ]
                },
                {
                  name: 'Floor3',
                  value: 4,
                  itemStyle: {
                    color: '#FFB060' // Change the color of the "Bosch" section to red
                  },
                }
              ]
            },
            {
              name: '603',
              value: 10,
              itemStyle: {
                color: '#E0C468' // Change the color of the "Bosch" section to red
              },
              children: [
                {
                  name: 'R&D',
                  value: 5,
                  itemStyle: {
                    color: '#FFC262' // Change the color of the "Bosch" section to red
                  },
                },
                {
                  name: 'Operations',
                  value: 3,
                  itemStyle: {
                    color: '#FF925E' // Change the color of the "Bosch" section to red
                  },
                }
              ]
            }
          ]
        },
        {
   
        }
      ],
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      }
    }
  };


  return (
    <>
    <Card>
      <Card.Body>
        <Row>
          <Col md={8}>
            <Card.Title>SELECTION</Card.Title>
          </Col>
          <Col md={4}>
            <button type="button" className="btn btn-sm btn-light float-end">
              View
            </button>
          </Col>
        </Row>
        <ECharts
          option={option}
          style={{ height: '550px' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </Card.Body>
    </Card>
   
        </>

  );
};

export default SelectionTreemap;
