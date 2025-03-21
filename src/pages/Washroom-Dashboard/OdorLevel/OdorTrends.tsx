export{};// import React, { useState } from 'react';
// import ReactEcharts from 'echarts-for-react';
// import { Card, Pagination } from 'react-bootstrap';
// const RoundedPagination = () => {
//   let items = [];
//   for (let number = 1; number <= 5; number++) {
//       items.push(
//           <Pagination.Item key={number.toString()} active={number === 2}>
//               {number}
//           </Pagination.Item>
//       );
//   }
//   return (
    
//     <div className="d-flex justify-content-end mt-3">
//     <Pagination className="pagination-rounded">
//       <Pagination.Prev />
//       {items}
//       <Pagination.Next />
//     </Pagination>
//   </div>

      
//   );
// };

// const OdorTrends = () => {
//   const[odorTrends , setOdorTrends]=useState({
//     seriesData: [
//       [120, 132, 101, 134, 90, 230, 210],
//       [220, 182, 191, 234, 290, 330, 310],
//       [150, 232, 201, 154, 190, 330, 410],
//       [320, 332, 301, 334, 390, 330, 320],
//       [820, 932, 901, 934, 1290, 1330, 1320],
//     ],  
//   })
//   const option = {
//     title: {
//       text: 'Odor Trends'
//     },
//     tooltip: {
//       trigger: 'axis'
//     },
//     legend: {
//       data: ['WS1', 'WS2', 'WS3', 'WS4', 'WS5'],
//       align: 'right', // Align legends to the right
//       right: 10, // Adjust the distance from the right edge      
//     },
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '3%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//       type: 'value'
//     },
//     dataZoom: [
//       {
//         type: 'inside',
//         start: 50,
//         end: 52,
//         top: '93%',
//       },
//       {
//         start: 0,
//         end: 100,
//         top: '93%',
//       },
//     ],
//     series: [
//       {
//         name: 'WS1',
//         type: 'line',
//         stack: 'Total',
//         data: odorTrends.seriesData[0],
//       },
//       {
//         name: 'WS2',
//         type: 'line',
//         stack: 'Total',
//         data: odorTrends.seriesData[1],
//       },
//       {
//         name: 'WS3',
//         type: 'line',
//         stack: 'Total',
//         data: odorTrends.seriesData[2],
//       },
//       {
//         name: 'WS4',
//         type: 'line',
//         stack: 'Total',
//         data: odorTrends.seriesData[3],
//       },
//       {
//         name: 'WS5',
//         type: 'line',
//         stack: 'Total',
//         data: odorTrends.seriesData[4],
//       }
//     ]
//   };

//   return (
//     <Card>

//     <div>
//     <ReactEcharts option={option} style={{ height: '400px', width: '100%' }} />
//   </div>
//   <RoundedPagination />

//   </Card>

//   );
// };

// export default OdorTrends;
