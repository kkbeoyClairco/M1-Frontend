import React, { useEffect, useState } from 'react';
import { KonvaTest } from 'components/ClaircoWhiteBoard/KonvaTest';
import { FloorPlanEditor } from 'components/ClaircoWhiteBoard';
import { BuildingFloorSelector } from 'components';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
import { useLocation } from 'react-router-dom';
import { building, floor } from 'helpers/api/services/Clairco/customer';

const WhiteBoardPage = () => {
    const [siteData, setSiteData] = useState<{
        customer: Record<string, any> | null;
        building: Record<string, any> | null;
        floor: Record<string, any> | null;
    }>({ customer: null, building: null, floor: null });
    const [dropDownData, setDropDownData] = useState({
        building: [],
        floor: [],
    });
    const [isLoading, setIsLoading] = useState({});
    const [floorImage, setFloorImage] = useState('');
    const location = useLocation();

    const handleBuildingChange = async (building: SingleValue<selectTagType> | null) => {
        if (siteData?.customer?.customerId && building?.value) {
            await fetchFloorsList(siteData?.customer.customerId, building?.value);
        } else if (!building?.value) {
            setDropDownData((prev) => ({ ...prev, floor: [] }));
            setSiteData((prev) => ({ ...prev, floor: [] }));
        }
        setSiteData((prev) => ({ ...prev, building: building }));
        // console.log('Building changed', building);
    };

    const handleFloorChange = (floor: SingleValue<selectTagType> | null) => {
        setSiteData((prev) => ({ ...prev, floor: floor }));
    };
    const handleFloorPlanLoading = () => {
        try {
            console.log('Site data', siteData?.floor?.layout);
            setFloorImage(siteData?.floor?.layout ?? '');
            if (!siteData?.floor?.layout) window.alert('Floor Image unavailable');
        } catch (error) {
            console.log(error);
        }
    };

    const fetchFloorsList = async (customerId: string, buildingId: string) => {
        try {
            setIsLoading(true);
            setDropDownData((prev) => ({ ...prev, floor: [] }));

            const res = await floor.byCustomerId(customerId, buildingId ?? '');
            const floorData = res?.data?.map((doc: any) => ({
                value: doc?.id,
                label: doc?.name,
                layout: doc?.layout ?? '',
            }));
            setDropDownData((prev: any) => ({ ...prev, floor: floorData }));
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    const fetchBuldingsList = async (customerId: string) => {
        try {
            const res = await building.byCustomerId({ customerId });
            const buildings = res?.data?.map((doc: any) => ({
                label: doc.name,
                value: doc.id,
            }));

            setDropDownData((prev) => ({ ...prev, building: buildings }));
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(
        function extractCustomerInfo() {
            const path = location?.pathname;
            const paramsString = path?.split('/')?.pop(); // Extracts the last part of the path
            const searchParams = new URLSearchParams(paramsString);
            const customerName = searchParams.get('customerName') ?? '';
            const customerId = searchParams.get('customerId') ?? '';
            setSiteData((prev) => ({ ...prev, customer: { customerId, customerName } }));
            if (customerId) fetchBuldingsList(customerId);
        },
        [location?.pathname]
    );

    return (
        <>
            <PageHeading title={'Floor Plan'} />
            <Row className="mx-3" style={{}}>
                <Col xs={4}>
                    <BuildingFloorSelector
                        onBuildingChange={handleBuildingChange}
                        onFloorChange={handleFloorChange}
                        onFloorPlanButtonClick={handleFloorPlanLoading}
                        buildingOptions={dropDownData?.building ?? []}
                        floorOptions={dropDownData?.floor ?? []}
                    />
                </Col>
            </Row>

            <FloorPlanEditor siteData={siteData} floorPlanImageUrl={floorImage ?? ''} />
            {/* )} */}
        </>
    );
};

export default WhiteBoardPage;
