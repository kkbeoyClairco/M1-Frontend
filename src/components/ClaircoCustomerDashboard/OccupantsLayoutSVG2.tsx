import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import throttle from 'lodash/throttle';
import { LayoutToolTip } from './ToolTip/LayoutToolTip';
import { MODIFY_ALERT } from 'appConstants/claircoConstants';
import SkeltonLoader from 'components/ClaircoCustomer/Skeltons/SkeltonLoader';
import { conforms, escape } from 'lodash';
import { useEventListener } from 'hooks/useEventListner';
export const OccupantsLayoutSVG = ({
    floorPlanUrl,
    currentState,
    elementsToGreen,
    elementsToRed,
    isDataLoading,
    activeDevice,
    toolTipData1,
}: any) => {
    const [svgData, setSvgdata] = useState('');
    const [inactiveGtagId, setInactiveGtagId] = useState<any>([]);
    const [mapper, setMapper] = useState({});

    const [greenElements, setGreenElements] = useState({});
    const [redElements, setRedElements] = useState({});
    const [showToolTip, setShowToolTip] = useState(false);
    const [toolTipPosition, setToolTipPosition] = useState({});
    const [tooltipData, setToolTipData] = useState({});
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    // console.log('SVG link', floorPlanUrl);
    //SVG Constants
    const ElementId: Record<string, string> = {
        'VRF-VRV': 'vrf-layer',
        OCCUPANCY: 'layer3',
        AHU: 'layer2',
        // 'ahu-layer',
    };

    //Returns the Inactive Gtag Layers as array
    const getInactiveElement = () => {
        try {
            // const inactiveElementId = [];
            // const states = Object.keys(ElementId);
            // for (let i = 0; i < states.length; i++) {
            //     if (currentState !== states[i]) inactiveElementId.push(states[i]);
            // }
            let gtag = '';
            if (currentState === 'AHU') gtag = ElementId['OCCUPANCY'];
            else gtag = ElementId['AHU'];
            setInactiveGtagId(gtag);
        } catch (error) {
            console.log(error);
        }
    };

    // Click Handler Function
    const handleClick = async (element: any) => {
        try {
            element.stopImmediatePropagation();
            const id = element.srcElement.getAttribute('inkscape:label');
            if (!toolTipData1 || !id) return;
            // console.log('Current state', currentState, toolTipData1);
            // MODIFY_ALERT Pass the correct paramerters to the following pages
            if (currentState === 'AHU') {
                const url = `/energy-efficiency/ahu/claircoDemoAHU`;
                navigate(url);
                // }
                // else if (currentState === 'VRF-VRV') {
                //     const url = `/customer/outdoor-devices/name=Outdoor+Device&building=&location=&floor=14`;
                //     navigate(url);
            } else if (currentState === 'OCCUPANCY') {
                // const occupancySensorName = toolTipData1.filter((doc: any) => id === doc.id)?.[0]?.name;
                const url = `/energy-efficiency/occupancy/claircoDemoOccupancy`;
                // if (!occupancySensorName) return;
                navigate(url);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Hover Handler Function
    const handleHover = throttle((e: any) => {
        try {
            const id = e.srcElement.getAttribute('inkscape:label');

            if (!id) return;
            const idArray = toolTipData1?.map((doc: any) => doc.deviceId);
            if (!id || !idArray.includes(id)) {
                return;
            }
            if (!containerRef.current) return;
            let values = containerRef.current.getBoundingClientRect();
            // let values = {};
            const position = {
                xValue: Math.abs(e.clientX - values.x),
                yValue: Math.abs(e.clientY - values.y),
            };
            const dataToToolTip = toolTipData1?.filter((doc: any) => {
                return id === doc.deviceId;
            });

            setToolTipData(dataToToolTip);
            setToolTipPosition(position);
            setShowToolTip(true);
        } catch (error) {
            console.log(error);
        }
    }, 500);

    // Mouse out Handler function
    const handleMouseOut = (e: any) => {
        try {
            setShowToolTip(false);
        } catch (error) {
            console.log(error);
        }
    };

    //Creates mapper objects from the svg for cross referencing with the ids. FORMAT : {id:rect/path}
    const createMapObject = () => {
        try {
            const parser = new DOMParser();
            const svgDoc = parser?.parseFromString(svgData, 'image/svg+xml');
            if (currentState === 'VRF-VRV') {
                const vrfComponent = svgDoc?.getElementById(ElementId['VRF-VRV']) as HTMLElement;

                if (!vrfComponent) return;
                const rectVRF = vrfComponent.getElementsByTagName('rect');
                const pathVRF = vrfComponent.getElementsByTagName('path');

                if (!rectVRF) return;
                const rectElementsVRF = Array.from(rectVRF);
                const pathElementsVRF = Array.from(pathVRF);

                const vrfIds: Record<string, string> = {};
                for (const rect of rectElementsVRF) {
                    const zoneId = rect.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        vrfIds[zoneId] = rect.id;
                    }
                }
                for (const path of pathElementsVRF) {
                    const zoneId = path?.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        vrfIds[zoneId] = path?.id;
                    }
                }
                setMapper(vrfIds);
            }
            if (currentState === 'OCCUPANCY') {
                const occupancyComponent = svgDoc?.getElementById(ElementId['OCCUPANCY']) as HTMLElement;
                if (!occupancyComponent) return;
                //Extracting Rects and Path from the occupancy Layer
                const rectOccupancy = occupancyComponent.getElementsByTagName('rect');
                const pathOccupancy = occupancyComponent.getElementsByTagName('path');

                if (!rectOccupancy) return;
                const rectElementsOccupancy = Array.from(rectOccupancy);
                const pathElementsOccupancy = Array.from(pathOccupancy);

                const occupancyIds: Record<string, string> = {};
                for (const rect of rectElementsOccupancy) {
                    const zoneId = rect.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        occupancyIds[zoneId] = rect.id;
                    }
                }
                for (const path of pathElementsOccupancy) {
                    const zoneId = path?.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        occupancyIds[zoneId] = path?.id;
                    }
                }
                setMapper(occupancyIds);
            }
            if (currentState === 'AHU') {
                const ahuComponent = svgDoc?.getElementById(ElementId['AHU']) as HTMLElement;
                if (!ahuComponent) return;
                //Extracting Rects and Path from the occupancy Layer

                const rectAHU = ahuComponent.getElementsByTagName('rect');
                const pathAHU = ahuComponent.getElementsByTagName('path');

                if (!rectAHU) return;
                const rectElementsAHU = Array.from(rectAHU);
                const pathElementsAHU = Array.from(pathAHU);
                const ahuIds: Record<string, string> = {};
                for (const rect of rectElementsAHU) {
                    const zoneId = rect?.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        ahuIds[zoneId] = rect?.id;
                    }
                }
                for (const path of pathElementsAHU) {
                    const zoneId = path?.getAttribute('inkscape:label'); // Get the attribute value
                    if (zoneId) {
                        ahuIds[zoneId] = path?.id;
                    }
                }
                // console.log('AHU mapper', ahuIds);
                setMapper(ahuIds);
            }
        } catch (error) {
            console.log('Error creating Mapping objects', error);
        }
    };

    // Creates maps for color coding. Seperate map for red and green are created. Optimization opportunity here
    const createColorCodeMaps = async () => {
        try {
            if (!elementsToGreen || !elementsToRed || !mapper) {
                return;
            }
            const greenRects: { [key: string]: any } = {};
            const redRects: { [key: string]: any } = {};
            const mapperObject: { [key: string]: any } = mapper;

            elementsToGreen?.forEach((docId: any) => {
                greenRects[docId] = mapperObject?.[docId];
            });

            elementsToRed?.forEach((docId: any) => {
                redRects[docId] = mapperObject[docId];
            });
            // console.log('Green elements', greenElements);
            setGreenElements(greenRects);
            setRedElements(redRects);
        } catch (error) {
            console.log(error);
        }
    };

    // Function which add event Listners
    const addEventListener = (
        ref: React.RefObject<HTMLElement>,
        event: keyof HTMLElementEventMap,
        executable: EventListenerOrEventListenerObject
    ) => {
        try {
            if (ref.current) {
                // Function to remove all event listeners of the same type
                // console.log('1');
                // const cloneElement = ref.current.cloneNode(true);
                // ref?.current?.parentNode?.replaceChild(cloneElement, ref.current);

                // console.log('2');
                ref.current?.removeEventListener(event, executable);
                ref.current?.addEventListener(event, executable, true);
            }
        } catch (error) {
            console.log(error);
        }
    };
    //SVG Manipulation Function. This makes changes to the SVG- Adding Colors, Switching Layers
    // const manipulateSvg = async () => {
    //     try {
    //         const parser = new DOMParser();
    //         const svgDoc = parser?.parseFromString(svgData, 'image/svg+xml');
    //         const gtagActive = svgDoc?.getElementById(ElementId[currentState]) as HTMLElement;
    //         // Activates the selected layer
    //         gtagActive.setAttribute('visibility', 'visible');
    //         // Deactivates the current Layer
    //         inactiveGtagId.forEach((inactiveId: string) => {
    //             svgDoc?.getElementById(ElementId[inactiveId])?.setAttribute('visibility', 'hidden');
    //         });

    //         //Changing elements to Green
    //         console.log('Colors', inactiveGtagId);

    //         Object.values(greenElements)?.forEach((elementId: any) => {
    //             const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;

    //             if (!element) return;
    //             return (element.style.fill = 'green');
    //         });
    //         // Changing elements to Red
    //         Object.values(redElements)?.forEach((elementId: any) => {
    //             const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
    //             if (!element) return;
    //             return (element.style.fill = 'red');
    //         });
    //         const updatedSvgContent = new XMLSerializer().serializeToString(svgDoc);
    //         setSvgdata(updatedSvgContent);
    //         return;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const manipulateSvg = async () => {
        try {
            const parser = new DOMParser();
            const svgDoc = parser?.parseFromString(svgData, 'image/svg+xml');

            const gtagActive = svgDoc?.getElementById(ElementId[currentState]) as HTMLElement;
            const gtagInactive = svgDoc?.getElementById(inactiveGtagId) as HTMLElement;
            if (!gtagActive || !gtagInactive) return;
            gtagInactive.setAttribute('visibility', 'hidden');
            gtagActive.setAttribute('visibility', 'visible');
            // gtagActive.style.visibility = 'visible';
            const pathsInActive = gtagInactive.querySelectorAll('path');
            const pathsActive = gtagActive.querySelectorAll('path');
            pathsInActive.forEach((path) => {
                path.style.visibility = 'hidden';
            });
            pathsActive.forEach((path) => {
                path.style.visibility = 'visible';
            });
            // console.log('Green', gtagActive, gtagInactive, elementsToGreen);
            //Changing elements to Green
            // console.log('active:', gtagActive, 'inactive', gtagInactive, 'greenele:', greenElements, redElements);
            // Object.values(greenElements)?.forEach((elementId: any) => {
            //     const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
            //     console.log('Element', element);
            //     if (!element) return;
            //     // element.setAttribute('visibility', 'visible');
            //     element.setAttribute('visibility', 'visible');
            //     // return (element.style.fill = '#00A300');
            // });
            // Object.values(redElements)?.forEach((elementId: any) => {
            //     const element = gtagInactive?.querySelector(`#${elementId}`) as HTMLElement;
            //     console.log('Element', element);
            //     if (!element) return;
            //     // element.setAttribute('visibility', 'visible');
            //     element.setAttribute('visibility', 'hidden');
            //     // return (element.style.fill = '#00A300');
            // });
            Object.values(greenElements)?.forEach((elementId: any) => {
                const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
                // console.log('Green', element);

                if (!element) return;
                // element.setAttribute('visibility', 'visible');
                return (element.style.fill = '#00A300');
            });
            // Object.values(greenElements)?.forEach((elementId: any) => {
            //     const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
            //     if (!element) return;
            //     // element.setAttribute('visibility', 'visible');
            //     return (element.style.fill = '#00A300');
            // });
            // Changing elements to Red
            Object.values(redElements)?.forEach((elementId: any) => {
                const element = gtagActive?.querySelector(`#${elementId}`) as HTMLElement;
                if (!element) return;
                // element.setAttribute('visibility', 'visible');
                return (element.style.fill = '#FF0000');
            });

            const updatedSvgContent = new XMLSerializer().serializeToString(svgDoc);
            setSvgdata(updatedSvgContent);
            // console.log('SVG', updatedSvgContent);
            return;
        } catch (error) {
            console.log(error);
        }
    };
    useEventListener(containerRef, 'click', handleClick, [currentState, toolTipData1]);
    useEventListener(containerRef, 'mouseover', handleHover, [toolTipData1]);
    useEventListener(containerRef, 'mouseout', handleMouseOut, []);
    useEffect(() => {
        const pullSVG = () => {
            try {
                fetch(
                    // 'https://cloudqa-bucket.s3.ap-south-1.amazonaws.com/panasonicDivyaSreeFloor14.svg'
                    // '  https://res.cloudinary.com/dlcsyyk7z/image/upload/v1730898380/Trail/vios-trail1_e9rigd.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1730897024/Trail/oic-trail_vuvsey.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1730898380/Trail/vios-trail1_e9rigd.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1732205956/test/VIOS_New_gpe3v0.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1732272080/test/Divyasree_New_twn5wo.svg'
                    // 'https://res.cloudinary.com/dlcsyyk7z/image/upload/v1732278822/test/IIC_-New_w8sucm.svg'
                    floorPlanUrl
                )
                    .then((response) => response.text())
                    .then(async (svgContent) => {
                        const parser = new DOMParser();
                        const svgDoc = parser?.parseFromString(svgContent, 'image/svg+xml');
                        const svgElement = svgDoc?.getElementById('svg1') as HTMLElement;
                        // console.log('SvgPulled Data1', svgElement);

                        if (!svgElement) return;
                        svgElement.setAttribute('width', '750');
                        svgElement.setAttribute('height', '440');
                        const updatedSvgContent = new XMLSerializer().serializeToString(svgDoc);
                        setSvgdata(updatedSvgContent);
                        // console.log('SvgPulled Data', svgElement);
                        return;
                    })
                    .catch((error) => {
                        console.error('Error fetching SVG:', error);
                    });
            } catch (error) {
                console.log(error);
            }
        };
        pullSVG();
    }, [floorPlanUrl]);
    useEffect(() => {
        createMapObject();
        // addEventListener(containerRef, 'click', handleClick);
        // addEventListener(containerRef, 'mouseover', handleHover);
        // addEventListener(containerRef, 'mouseout', handleMouseOut);
    }, [svgData]);
    useEffect(() => {
        createMapObject(); // Modified to handle three parameters
    }, [svgData, activeDevice]);
    useEffect(() => {
        getInactiveElement();
        manipulateSvg();
    }, [svgData, currentState]);
    useEffect(() => {
        manipulateSvg();
    }, [inactiveGtagId, greenElements, redElements]);
    useEffect(() => {
        createColorCodeMaps();
    }, [currentState, mapper, elementsToGreen, elementsToRed]);
    // useEffect(() => {
    //     // console.log('tool tip map:', toolTipMap);
    //     toolTipDataRef.current = toolTipData1;
    // }, [currentState, toolTipData1]);

    return (
        <>
            {' '}
            <LayoutToolTip
                currentState={currentState}
                show={showToolTip}
                positionValues={toolTipPosition}
                // layoutState={currentState}
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
                        <SkeltonLoader />
                    </div>
                )}
            </div>
        </>
    );
};
