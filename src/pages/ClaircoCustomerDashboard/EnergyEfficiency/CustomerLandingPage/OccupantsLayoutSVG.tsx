import React, { useCallback, useEffect, useRef, useState } from 'react';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { useNavigate } from 'react-router-dom';
import throttle from 'lodash/throttle';
// import debounce from 'lodash/debounce';
// import image from 'assets/images/sensorDivyasreeFrontend.svg';

import { LayoutToolTip } from './LayoutToolTip';

export const OccupantsLayoutSVG = ({
    currentState,
    elementsToGreen,
    elementsToRed,
    occupancyDeviceIds,
    vrfTooltipData,
    occupancyTooltipData,
    isDataLoading,
    ahuData,
}: any) => {
    const [svgData, setSvgdata] = useState('');
    const [inactiveGtagId, setInactiveGtagId] = useState('');
    const [vrfMapper, setVrfMapper] = useState({});
    const [occupancyMapper, setOccupancyMapper] = useState({});
    const [greenElements, setGreenElements] = useState({});
    const [redElements, setRedElements] = useState({});
    const [showToolTip, setShowToolTip] = useState(false);
    const [toolTipPosition, setToolTipPosition] = useState({});
    const [tooltipData, setToolTipData] = useState({});
    const [toolTipMapper, setToolTipMapper] = useState([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const toolTipRef = useRef<HTMLDivElement | null>(null);
    const toolTipDataRef = useRef<typeof vrfTooltipData | undefined>();
    const navigate = useNavigate();
    // console.log('State from SVG COmpo', elementsToGreen, elementsToRed);

    const ElementId: Record<string, string> = {
        'VRF-VRV': 'layer2',
        OCCUPANCY: 'layer3',
    };
    const getInactiveElement = () => {
        try {
            const inactiveElementId = ElementId[currentState === 'OCCUPANCY' ? 'VRF-VRV' : 'OCCUPANCY'];
            // console.log('Inactive Id', inactiveElementId);
            setInactiveGtagId(inactiveElementId);
        } catch (error) {
            console.log(error);
        }
    };
    const handleClick = async (element: any) => {
        try {
            const mapper = currentState == 'VRF-VRV' ? vrfMapper : occupancyMapper;
            const id = element.srcElement.getAttribute('inkscape:label');
            let occupancyDeviceId = '';
            // console.log(
            //     'Mapper ',
            //     // element.srcElement
            //     id
            //     // mapper,
            //     // occupancyDeviceIds
            //     //  Object.keys(occupancyDeviceIds).includes(id)
            // );

            if (currentState !== 'VRF-VRV') occupancyDeviceId = occupancyDeviceIds[id];
            if (!id || !Object.keys(mapper).includes(id)) {
                // console.log('No id or id not in mapper');
                return;
            }

            // const url = `/energy-efficiency/ahu/claircoDemoAHU`;
            // navigate(url);
            const url =
                currentState === 'VRF-VRV'
                    ? `/energy-efficiency/ahu/claircoDemoAHU`
                    : `/energy-efficiency/occupancy/claircoDemoOccupancy`;
            if (currentState !== 'VRF-VRV' && !occupancyDeviceId) {
                // console.log(currentState !== 'VRF-VRV', 'No occupancy Id', occupancyDeviceId, occupancyDeviceIds[id]);
                return;
            }
            if (currentState == 'VRF-VRV') {
                const ahuDetails: any = ahuData.filter((doc: any) => doc.id == id)?.[0];
                // console.log('AHU details', ahuDetails);
                navigate(url, {
                    state: {
                        sensorName: ahuDetails?.rawData?.switch?.name,
                        btuName: 'CCBTU01',
                        deviceName: ahuDetails?.name,
                        customerId: ahuDetails.customerId ?? '',
                        floorId: ahuDetails.floorId ?? '',
                    },
                });
                return;
            }
            // const deviceName = occupancyTooltipData
            //     ?.filter((doc: any) => doc.id === id)
            //     ?.map((doc: any) => doc.name)[0];
            // console.log('URL', id, 'deviceName');
            navigate(url, { state: { key: id, name: '' } });
        } catch (error) {
            console.log(error);
        }
    };

    const handleHover = throttle((e: any) => {
        try {
            const id = e.srcElement.getAttribute('inkscape:label');
            const mapper = currentState == 'VRF-VRV' ? vrfMapper : occupancyMapper;
            if (!id || !Object.keys(mapper).includes(id)) {
                return;
            }
            if (!containerRef.current) return;
            if (!id || !Object.keys(mapper).includes(id)) {
                return;
            }
            let values = containerRef.current.getBoundingClientRect();
            // let values = {};

            const position = {
                xValue: Math.abs(e.clientX - values.x),
                yValue: Math.abs(e.clientY - values.y),
            };
            // const toolTipMapper = currentState == 'VRF-VRV' ? vrfTooltipData : occupancyTooltipData;
            if (!toolTipDataRef || toolTipDataRef.current.length < 1) {
                // console.log('Noting in tooltip mapper', toolTipMapper, vrfTooltipData, occupancyTooltipData);
                return;
            }
            // console.log('Hower ID', id, vrfTooltipData);
            const dataToToolTip = toolTipDataRef?.current.filter((doc: any) => {
                return id === doc.deviceId;
            });
            // console.log(
            //     'Tool tip data',
            //     id,
            //     toolTipDataRef?.current
            //     // dataToToolTip
            // );
            // if(currentState!=='VRF-VRV' )dataToToolTip.name=
            setToolTipData(dataToToolTip);
            setToolTipPosition(position);
            setShowToolTip(true);
        } catch (error) {
            console.log(error);
        }
    }, 500);

    const handleMouseOut = (e: any) => {
        try {
            // console.log('Mouse out');
            setShowToolTip(false);
        } catch (error) {
            console.log(error);
        }
    };
    const createMapObject = () => {
        try {
            const parser = new DOMParser();
            const svgDoc = parser?.parseFromString(svgData, 'image/svg+xml');
            const vrfComponent = svgDoc?.getElementById('layer2') as HTMLElement;

            const occupancyComponent = svgDoc?.getElementById('layer3') as HTMLElement;
            if (!vrfComponent || !occupancyComponent) return;
            const rectVRF = vrfComponent.getElementsByTagName('rect');
            const rectOccupancy = occupancyComponent.getElementsByTagName('rect');
            const pathVRF = vrfComponent.getElementsByTagName('path');
            const pathOccu = occupancyComponent.getElementsByTagName('path');

            if (!rectVRF || !rectOccupancy) return;
            const rectElementsVRF = Array.from(rectVRF);
            const rectElementsOccupancy = Array.from(rectOccupancy);
            const pathElementsVRF = Array.from(pathVRF);
            const pathElementsOccupancy = Array.from(pathOccu);

            const vrfIds: Record<string, string> = {};
            const occupancyIds: Record<string, string> = {};
            for (const rect of rectElementsVRF) {
                const zoneId = rect.getAttribute('inkscape:label'); // Get the attribute value
                // console.log('Rect', zoneId);
                if (zoneId) {
                    vrfIds[zoneId] = rect.id;
                }
            }
            for (const rect of rectElementsOccupancy) {
                const zoneId = rect.getAttribute('inkscape:label'); // Get the attribute value
                if (zoneId) {
                    occupancyIds[zoneId] = rect.id;
                }
            }
            // const zoneId = rect.getAttribute('inkscape:label')
            if (pathElementsVRF.length > 0) {
                const zoneId = pathElementsVRF[0].getAttribute('inkscape:label');
                if (zoneId) vrfIds[zoneId] = pathElementsVRF[0].id;
            }
            pathElementsOccupancy?.forEach((path) => {
                const zoneId = path.getAttribute('inkscape:label'); // Get the attribute value
                if (zoneId) {
                    occupancyIds[zoneId] = path.id;
                }
            });
            // console.log('VRF rect', rectElementsVRF, rectElementsOccupancy);
            // console.log('VRFids', pathElementsOccupancy, occupancyIds);
            setVrfMapper(vrfIds);
            setOccupancyMapper(occupancyIds);
            // console.log('Occupancy mapper:', occupancyIds);
        } catch (error) {
            console.log(error);
        }
    };
    const createColorCodeMaps = useCallback(async () => {
        try {
            // console.log('Color code', vrfMapper, occupancyMapper);

            if (!elementsToGreen || !elementsToRed || !vrfMapper || !occupancyMapper) {
                return;
            }
            const greenRects: { [key: string]: any } = {};
            const redRects: { [key: string]: any } = {};
            const mapperObject: { [key: string]: any } = currentState === 'VRF-VRV' ? vrfMapper : occupancyMapper;

            // console.log('Mapper object:', currentState, mapperObject, elementsToRed, elementsToGreen);
            elementsToGreen?.forEach((docId: any) => {
                // console.log(docId, mapperObject?.[docId]);

                // console.log('Doc id', docId == '66f683130b7e6d271d99499e');
                greenRects[docId] = mapperObject?.[docId];
            });
            elementsToRed?.forEach((docId: any) => {
                redRects[docId] = mapperObject?.[docId];
            });
            setGreenElements(greenRects);
            setRedElements(redRects);
        } catch (error) {
            console.log(error);
        }
    }, [elementsToGreen, elementsToRed, vrfMapper, occupancyMapper, currentState]);

    // Function which add event Listners
    const addEventListener = (
        ref: React.RefObject<HTMLElement>,
        event: keyof HTMLElementEventMap,
        executable: EventListenerOrEventListenerObject
    ) => {
        try {
            if (ref.current) {
                ref.current?.removeEventListener(event, executable);
                ref.current?.addEventListener(event, executable, true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const manipulateSvg = async () => {
        try {
            const parser = new DOMParser();
            const svgDoc = parser?.parseFromString(svgData, 'image/svg+xml');
            // console.log('inactive gtag', inactiveGtagId);
            const gtagActive = svgDoc?.getElementById(ElementId[currentState]) as HTMLElement;
            const gtagInactive = svgDoc?.getElementById(inactiveGtagId) as HTMLElement;
            if (!gtagActive || !gtagInactive) return;
            gtagInactive.setAttribute('visibility', 'hidden');
            gtagActive.setAttribute('visibility', 'visible');
            //Changing elements to Green
            // console.log('Green elements', greenElements);
            Object.values(greenElements)?.forEach((elementId: any, index: number) => {
                // if (elementId === 'rect1-9') console.log('green elememt rect1-9', elementId);
                const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
                if (!element) return;
                // const odd = index % 2 === 0;
                // console.log('Odd or even', odd); 32CD32
                return (element.style.fill = '#008000');
            });
            //To AHU regognition only
            if (currentState === 'VRF-VRV') {
                Object.values(greenElements)?.forEach((elementId: any, index: number) => {
                    if (index === 0) return;
                    const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
                    if (!element) return;

                    return (element.style.fill = '#32CD32');
                });
            }
            // Changing elements to Red
            Object.values(redElements)?.forEach((elementId: any) => {
                const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
                if (!element) return;

                return (element.style.fill = 'red');
            });

            const updatedSvgContent = new XMLSerializer().serializeToString(svgDoc);
            setSvgdata(updatedSvgContent);
            // console.log('SVG', updatedSvgContent);
            return;
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const pullSVG = () => {
            try {
                fetch(
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1728916726/Trail/sensorDivyasreeimg_1_lwvusj.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1733751266/Trail/Divyasree_New_hw2vnm.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1733759857/Trail/1_axtv2x.svg'
                    // 'https://res.cloudinary.com/dlulq6hny/image/upload/v1733984809/sensorDivyasreeimgT_twh2jb.svg'
                    'https://res.cloudinary.com/dlulq6hny/image/upload/v1754378112/sensorDivyasreeimgT_twh2jb_mlrmhv.svg'
                )
                    .then(async (response) => {
                        // const res = await response.json();
                        // console.log('Res', response);
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(async (svgContent) => {
                        const parser = new DOMParser();
                        const svgDoc = parser?.parseFromString(svgContent, 'image/svg+xml');
                        const svgElement = svgDoc?.getElementById('svg43715') as HTMLElement;
                        // console.log('SvgPulled Data', svgElement);
                        if (!svgElement) return;
                        svgElement.setAttribute('width', '750');
                        svgElement.setAttribute('height', '440');
                        const updatedSvgContent = new XMLSerializer().serializeToString(svgDoc);
                        setSvgdata(updatedSvgContent);
                        return;
                    })
                    .catch((error) => {
                        console.error('Error fetching SVG:', error);
                    });

                //    const svg=image.to.
                // const parser = new DOMParser();
                // const svgDoc = parser?.parseFromString(image, 'image/svg+xml');
                // console.log('Svg doc', svgDoc);
            } catch (error) {
                console.log(error);
            }
        };
        pullSVG();
        return () => setSvgdata('');
    }, []);
    useEffect(() => {
        createMapObject();
        addEventListener(containerRef, 'click', handleClick);
        addEventListener(containerRef, 'mouseover', handleHover);
        addEventListener(containerRef, 'mouseout', handleMouseOut);
    }, [svgData]);
    useEffect(() => {
        getInactiveElement();
        manipulateSvg();
    }, [svgData, currentState]);
    useEffect(() => {
        manipulateSvg();
    }, [inactiveGtagId, greenElements, redElements]);
    useEffect(() => {
        createColorCodeMaps();
    }, [vrfMapper, createColorCodeMaps, currentState, occupancyMapper, elementsToGreen, elementsToRed]);
    useEffect(() => {
        const toolTipMap = currentState === 'VRF-VRV' ? vrfTooltipData : occupancyTooltipData;
        // console.log('tool tip map:', toolTipMap);
        toolTipDataRef.current = toolTipMap;
    }, [currentState, vrfTooltipData, occupancyTooltipData]);

    return (
        <>
            {' '}
            <LayoutToolTip
                currentState={currentState}
                show={showToolTip}
                positionValues={toolTipPosition}
                layoutState={currentState}
                vrfTooltipData={vrfTooltipData}
                occupancyTooltipData={occupancyTooltipData}
                toolTipData={tooltipData}
            />
            <div ref={containerRef} style={{ padding: '10px' }}>
                {!isDataLoading && svgData ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: svgData ? svgData.toString() : '' }}
                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                    />
                ) : (
                    <div style={{ marginTop: '100px', width: '95%', marginInline: '20px' }}>
                        <TableSkelton />
                    </div>
                )}
            </div>
        </>
    );
};
