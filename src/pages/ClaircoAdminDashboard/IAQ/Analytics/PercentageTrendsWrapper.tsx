import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import StackedBarChart from './Stacked BarChart';
import { coloursTable } from 'appConstants/propertyTable';
import { createDataForStacked2, getParametersForLevelChart, ParamNameForDisplay } from 'utils/AQI/analytics';
// import { percentages } from './fakeData';
import { HyperDatepicker } from 'components';
import WarningModal from 'components/ClaircoModals/Warnings/WarningModal';
import { getLevelTimeAnalytics } from 'helpers/api/services/Clairco/customerSide/iaq';
import { toast } from 'sonner';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { SevendayWindowWarningMessage } from 'appConstants/text';
import VerticalParametersGroup from 'components/ClaircoIterators/VerticalParametersGroup';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
interface WrapperInterfaceProps {
    sensorName: string;
}
const PercentageTrendsWrapper: React.FC<WrapperInterfaceProps> = ({ sensorName }) => {
    const [parameters, setParameters] = useState<string[] | null>(null);
    const [selectedParam, setSelectedParam] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const [rawData, setRawData] = useState<any>(null);
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [warningModal, setWarningModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //   Data Fetching
    const getPercentageData = useCallback(
        async (sensorName: string) => {
            try {
                if (!sensorName) return;
                setIsLoading(true);

                const end = endDate.toISOString().split('T')?.[0] ?? '';
                const start = startDate.toISOString().split('T')?.[0] ?? '';

                const res: any = await getLevelTimeAnalytics(sensorName, start, end);

                // percentages;
                const params: string[] = getParametersForLevelChart(res?.data?.data.reverse()) as string[];
                const initialParameter = params?.[0] ?? '';
                // console.log('Prameters', params);
                const data = createDataForStacked2(res?.data?.data, initialParameter);
                // const dates = extractDates(res?.data?.data);
                // console.log('Stacked Bar input', data);
                setSelectedParam(initialParameter);
                setParameters(params);
                setData(data.series ?? ([] as number[][]));
                setXAxis(data?.xAxis ?? []);
                setRawData(res.data?.data);
            } catch (error) {
                console.log(error);
                toast.error('Oops! Something went wrong.');
            } finally {
                setIsLoading(false);
            }
        },
        [endDate, startDate]
    );

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

            const res: any = await getLevelTimeAnalytics(sensorName, start, end);
            const data = createDataForStacked2(res?.data?.data?.reverse(), selectedParam ?? '');
            // const dates = extractDates(res?.data?.data);

            setData(data?.series ?? ([] as number[][]));
            setXAxis(data?.xAxis ?? []);
            setRawData(res?.data?.data);
        } catch (error) {
            console.log(error);
            toast.error('Oops! Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate, selectedParam, sensorName]);
    // Event Handlers
    const handleWarningModal = () => {
        setWarningModal((prev) => !prev);
    };
    const changeGraphParameter = async (parameter?: string, index?: number) => {
        try {
            if (!parameter) return;
            setSelectedParam(parameter);
            const data = createDataForStacked2(rawData ?? [], parameter);
            setData(data?.series ?? []);
            setXAxis(data?.xAxis ?? []);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getPercentageData(sensorName);
    }, [sensorName]);
    return (
        <>
            <WarningModal
                modalState={warningModal}
                modalControlFn={handleWarningModal}
                WarningMessage={SevendayWindowWarningMessage}
            />
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
            </Row>
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
                                key={'parameter' + parameter}>
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
                                        name={'flexRadioDefault' + parameter}
                                        id={'parameter' + parameter}
                                        onChange={() => changeGraphParameter(parameter, index)}
                                        checked={selectedParam === parameter}
                                    />
                                    <label className="form-check-label" htmlFor={'parameter' + parameter}>
                                        {ParamNameForDisplay[parameter as keyof typeof ParamNameForDisplay]}
                                    </label>
                                </div>
                            </div>
                        );
                    })} */}
                </Col>
                <Col sm={12} md={8} style={{ height: '550px' }}>
                    {!isLoading ? (
                        <StackedBarChart
                            parameters={['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous']}
                            xAxisData={xAxis}
                            data={data}
                            colors={['#59e759', '#129F17', '#E7E75F', '#f39c12', '#e74c3c']}
                        />
                    ) : (
                        <TableSkelton2 />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default React.memo(PercentageTrendsWrapper);
