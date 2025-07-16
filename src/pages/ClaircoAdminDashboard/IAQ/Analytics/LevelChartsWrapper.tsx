import React, { useCallback, useEffect, useState } from 'react';
import StepLineChart from './StepLineChart';
import { useSSR } from 'react-i18next';
import { coloursTable } from 'appConstants/propertyTable';
import {
    createParameters,
    createSeries,
    createSeriesForLevelTrends,
    getParametersForLevelChart,
    // parameterOrder,
    ParamNameForDisplay,
} from 'utils/AQI/analytics';
// import { dataLevels } from './fakeData';
import { Button, Col, Row } from 'react-bootstrap';
import { getLevelTimeAnalytics, getRealTimeAnalytics } from 'helpers/api/services/Clairco/customerSide/iaq';
import { stat } from 'fs';
import { HyperDatepicker } from 'components';
import { toast } from 'sonner';
import WarningModal from 'components/ClaircoModals/Warnings/WarningModal';
// './components/ClaircoModals/Warnings/WarningModal';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { SevendayWindowWarningMessage } from 'appConstants/text';
import VerticalParametersGroup from 'components/ClaircoIterators/VerticalParametersGroup';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';

const LevelChartsWrapper = ({ sensorName }: any) => {
    const [data, setData] = React.useState<Record<string, any>>({});
    const [selectedParam, setSelectedParam] = useState<string>('');
    const [parameters, setParameters] = useState<string[] | null>([]);
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [warningModal, setWarningModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const changeGraphParameter = async (parameter?: string) => {
        try {
            if (parameter) setSelectedParam(parameter);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async (sensorName: string) => {
        try {
            if (!sensorName) return;
            setIsLoading(true);
            const s = new Date(new Date().setDate(new Date().getDate() - 7));
            const e = new Date();
            const end = e?.toISOString()?.split('T')?.[0] ?? '';
            const start = s?.toISOString()?.split('T')?.[0] ?? '';

            const res: any = await getRealTimeAnalytics(sensorName, start, end);
            // const parameters = parameterOrder;
            const prams: any = getParametersForLevelChart(res?.data);
            // console.log('Params', prams);
            setSelectedParam(prams?.[0] ?? '');
            setParameters(prams ?? []);
            const data2 = createSeriesForLevelTrends(res?.data);

            setData(data2);
        } catch (error) {
            console.log(error);
            toast.error('Oops! Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleDatePickSubmission = useCallback(async () => {
        try {
            setIsLoading(true);
            const diffMs = endDate.getTime() - startDate.getTime();
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            if (diffDays > 7) {
                setWarningModal(true);
                toast.error('Oops! Something went wrong.');
                return;
            }
            const end = endDate.toISOString().split('T')?.[0] ?? '';
            const start = startDate.toISOString().split('T')?.[0] ?? '';
            const res: any = await getRealTimeAnalytics(sensorName, start, end);
            // const parameters = parameterOrder;
            // setSelectedParam(parameters?.[0] ?? '');
            // setParameters(parameters);
            const data2 = createSeriesForLevelTrends(res?.data);
            setData(data2);
        } catch (error) {
            console.log(error);
            toast.error('Oops! Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }, [endDate, startDate, sensorName]);
    const handleWarningModal = () => {
        setWarningModal((prev) => !prev);
    };
    useEffect(
        function intialAPICall() {
            fetchData(sensorName);
        },
        [sensorName]
    );
    return (
        <>
            {' '}
            {warningModal && (
                <WarningModal
                    modalState={warningModal}
                    modalControlFn={handleWarningModal}
                    WarningMessage={SevendayWindowWarningMessage}
                />
            )}
            <Row className="d-flex justify-content-end mt-2">
                <Col xs={12} className="d-flex flex-row flex-lg-row align-items-center p-2">
                    <label style={{ padding: '10px' }} htmlFor="">
                        From
                    </label>
                    <HyperDatepicker
                        value={startDate}
                        inputClass="form-control-light"
                        onChange={(date: any) => {
                            setStartDate(date);
                        }}
                    />
                    <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
                        To
                    </label>
                    <HyperDatepicker
                        value={endDate}
                        inputClass="form-control-light"
                        onChange={(date: any) => {
                            setEndDate(date);
                        }}
                    />{' '}
                    <Button
                        className="ms-md-3 mt-2 mt-md-0"
                        style={{
                            // margin: '20px',
                            // marginTop: '10px',
                            background: '#008675',
                            // borderWidth: '0px',
                        }}
                        onClick={handleDatePickSubmission}>
                        Submit
                    </Button>
                </Col>
            </Row>{' '}
            <Row className="d-flex">
                {/* Parameters */}
                <Col className="my-auto" sm={12} lg={3}>
                    <VerticalParametersGroup
                        parameters={parameters ?? []}
                        selectedParameter={selectedParam ?? ''}
                        onSelectFn={changeGraphParameter}
                        parameterDisplayNames={ParamNameForDisplay}
                    />
                    {/* {parameters?.map((parameter, index) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.35em',
                                    paddingLeft: '2em',
                                    justifyContent: 'start',
                                    // margin,
                                }}
                                // onClick={() => changeGraphParamer(parameter, index)}
                                key={parameter}>
                                <div
                                    style={{
                                        background: coloursTable[parameter],
                                        // [String(parameter)],
                                        height: '0.75em',
                                        width: '0.75em',
                                        borderRadius: '5px',
                                        marginRight: '1em',
                                    }}></div>
                                <div
                                    className="form-check"
                                    style={{
                                        paddingLeft: '20px',
                                        marginTop: '0.25em',
                                        // paddingTop: '0.35em',
                                        paddingBottom: '0px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`flexRadioDefault` + parameter}
                                        id={parameter}
                                        onChange={() => changeGraphParamer(parameter, index)}
                                        checked={selectedParam === parameter}
                                    />
                                    <label className="form-check-label" htmlFor={parameter}>
                                        {ParamNameForDisplay[parameter as keyof typeof ParamNameForDisplay]}
                                    </label>
                                </div>
                            </div>
                        );
                    })} */}
                </Col>
                <Col sm={12} md={8} style={{ height: '550px' }}>
                    {!isLoading ? (
                        <StepLineChart
                            series={data?.[selectedParam]?.data ?? []}
                            xAxis={data?.[selectedParam]?.timestamps ?? []}
                        />
                    ) : (
                        <TableSkelton2 />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default React.memo(LevelChartsWrapper);
