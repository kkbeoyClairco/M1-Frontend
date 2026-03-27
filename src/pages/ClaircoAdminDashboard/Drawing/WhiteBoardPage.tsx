import React, { useEffect, useState, useContext } from 'react';
import { FloorPlanEditor } from 'components/ClaircoWhiteBoard';
import { BuildingFloorSelector } from 'components';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row, Button } from 'react-bootstrap';
import { SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
import { useLocation } from 'react-router-dom';
import { building, floor } from 'helpers/api/services/Clairco/customer';
import { uploadFloorImage } from 'helpers/api/services/Clairco/floorPlan';
import ImageUploadCropModal from 'components/ClaircoModals/AddNew/ImageUploadCropModal';
import { ToastContext } from 'context/ToastContext';
import { useAppDispatch } from 'redux/hooks';
import { loadFloorPlan, setFloorPlanImage } from 'redux/floorPlan/floorPlanSlice';
import { normData1 } from 'components/ClaircoWhiteBoard/fakeData';
import { deserializeShapesFromAPI } from 'utils/floorPlan/shapeTransform';

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
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState({});
    const [floorImage, setFloorImage] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const location = useLocation();
    const toastContext = useContext(ToastContext);

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
            const floorImageUrl = siteData?.floor?.layout ?? '';
            // console.log('Site data', floorImageUrl);

            // Update local state for image
            setFloorImage(floorImageUrl);

            // Update Redux with image (if you need it in Redux)
            if (floorImageUrl) {
                dispatch(setFloorPlanImage(floorImageUrl));
            }

            // ✅ Load shapes into Redux (without floorPlanImage to avoid conflicts)
            // normData1.shapes are already in PersistedShape format with normalized [0–1] coords.
            // Map top-level deviceType onto each shape since the fake data stores it on the wrapper.
            const transformedShapes = deserializeShapesFromAPI(
                normData1.shapes.map((s: any) => ({ deviceType: normData1.deviceType, ...s }))
            );
            dispatch(
                loadFloorPlan({
                    deviceType: 'VRV/VRF',
                    shapes: transformedShapes,
                    // Don't pass floorPlanImage here - handle it separately above
                })
            );

            if (!floorImageUrl) {
                window.alert('Floor Image unavailable');
            }
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

    /**
     * Handle floor image upload from the modal
     */
    const handleImageUpload = async (imageBlob: Blob, metadata: any) => {
        try {
            if (!siteData?.floor?.value) {
                throw new Error('Please select a floor first');
            }

            // Upload image to backend
            const response = await uploadFloorImage(siteData.floor.value, imageBlob, metadata);

            if (response.success) {
                // Update floor image in state
                setFloorImage(response.imageUrl);

                // Update siteData with new layout URL
                setSiteData((prev) => ({
                    ...prev,
                    floor: {
                        ...(prev.floor || {}),
                        layout: response.imageUrl,
                    },
                }));

                // ✅ Update Redux store with new floor plan image
                dispatch(setFloorPlanImage(response.imageUrl));

                // Show success toast
                toastContext?.showToast('Floor image uploaded successfully!', 'success');
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Error uploading floor image:', error);
            toastContext?.showToast(error.message || 'Failed to upload floor image. Please try again.', 'error');
            throw error; // Re-throw to let the modal handle it
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
                <Col xs={8} className="d-flex align-items-start justify-content-end">
                    <Button
                        variant="primary"
                        onClick={() => setShowUploadModal(true)}
                        disabled={!siteData?.floor?.value}
                        style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                        className="mb-3">
                        <i className="mdi mdi-upload me-1"></i>
                        Upload Floor Image
                    </Button>
                </Col>
            </Row>

            <FloorPlanEditor siteData={siteData} floorPlanImageUrl={floorImage ?? ''} />

            {/* Image Upload & Crop Modal */}
            <ImageUploadCropModal
                show={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onUpload={handleImageUpload}
                floorId={siteData?.floor?.value}
                floorName={siteData?.floor?.label}
            />
        </>
    );
};

export default WhiteBoardPage;
