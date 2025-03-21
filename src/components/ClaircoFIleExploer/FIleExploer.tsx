import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { getIcons, getTitles } from 'utils/FolderView';
import { convertDateToEpoch } from 'utils/timeFunctions';
import './folderView.css';
type FolderIteratorType = {
    index: number;
    data: {
        id: string;
    };
    isExpandedList: {
        [key: string]: boolean;
    };
    handleFolderExpansion: (data: any, type: string) => void;
    handleAddition: (data: any, type: string) => void;
};
type FIleExploerType = {
    dataInput: {
        id?: string;
        name?: string;
        isFolder?: boolean;
        type?: string;
        isExpanded?: boolean;
        children?: FIleExploerType['dataInput'][];
    };
    handleAPICalls: (type: string, data: any) => void;
    handleAddition: (type: string, data: any) => void;
};

// Recursive Componenet to render the folder sturcture
const FolderIterator: React.FC<FolderIteratorType> = ({
    index,
    data,
    isExpandedList,
    handleFolderExpansion,
    handleAddition,
}: any) => {
    return (
        <Row
            className="folder-row  rounded"
            key={data?.id ?? convertDateToEpoch(Date.now())}
            style={{
                // paddingLeft: '3em',
                color: 'black',
                paddingRight: '0px',
                width: '100%',
                maxWidth: '100%',
                minWidth: '105%',
                boxSizing: 'border-box',
            }}>
            <Row
                // className="card"
                className=" d-flex align-items-center mb-1 folder-item"
                style={{
                    cursor: 'pointer',
                    maxWidth: '100%',
                    // color: 'white',
                    // backgroundColor: 'rgba(64, 64, 64, 0.9)',
                }}>
                {/* Icon */}
                <Col xs={1} className="px-1  ">
                    <img
                        onClick={handleFolderExpansion?.bind(null, data ?? '', data?.type ?? 'trail')}
                        height={'24px'}
                        src={getIcons(data?.type ?? '')}
                        alt="icon"
                    />
                </Col>
                {/* Arrow indicating expanded or not */}
                {data?.isFolder && (
                    <Col
                        xs={1}
                        className="pl-0 align-bottom"
                        onClick={handleFolderExpansion?.bind(null, data ?? '', data?.type ?? '')}
                        title={'Add new' + ' ' + getTitles(data.type ?? '')}>
                        <img
                            src={
                                !isExpandedList[data?.id ?? ''] ? getIcons('DownArrow') : getIcons('UpArrow')
                                // : getIcons('DownArrow')
                            }
                            height={'12px'}
                            alt="expanded"
                        />
                    </Col>
                )}
                {/* Name */}
                <Col xs={8} onClick={handleFolderExpansion?.bind(null, data ?? '', data?.type ?? 'trail')}>
                    <h5
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                        }}
                        title={data?.name ?? ''}>
                        {data?.name ?? ''}
                    </h5>
                </Col>
                {/* //New Addition */}
                {data?.isFolder && isExpandedList[data?.id ?? ''] && (
                    <Col
                        xs={1}
                        className="pl-4 align-bottom"
                        onClick={handleAddition?.bind(null, data ?? '', data.type ?? '')}
                        title={'Add new' + ' ' + getTitles(data.type ?? '')}>
                        <img
                            src={
                                getIcons('Addition')
                                // : getIcons('DownArrow')
                            }
                            height={'12px'}
                            alt="new"
                        />
                    </Col>
                )}{' '}
            </Row>
            {data?.children &&
                data?.isFolder &&
                isExpandedList[data?.id ?? ''] &&
                data?.children?.map((node: any, index: number) => (
                    <div key={index} style={{ paddingLeft: '3em' }}>
                        {' '}
                        <FolderIterator
                            key={index}
                            index={node?.id ?? index}
                            data={node}
                            isExpandedList={isExpandedList}
                            handleFolderExpansion={handleFolderExpansion}
                            handleAddition={handleAddition}
                        />
                    </div>
                ))}
        </Row>
    );
};
const FIleExploer = ({ dataInput, handleAPICalls, handleAddition }: any) => {
    const [data, setData] = useState(dataInput);
    const [isExpandedList, setIsExpandedList] = useState<{ [key: string]: boolean }>({});
    const handleFolderExpansion = (data: any | number, type: string) => {
        try {
            if (!isExpandedList[data?.id ?? '']) handleAPICalls(type, data);
            setIsExpandedList((prev) => ({ ...prev, [data?.id]: !prev[data?.id] }));
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setData(dataInput);
    }, [dataInput]);

    return (
        <Fragment>
            {data?.map((data: any, index: number) => {
                return (
                    <div
                        className=" col-12 col-lg-6 pt-2 "
                        // style={{ background: 'rgba(150, 150, 150, 0.9)' }}
                    >
                        <FolderIterator
                            key={index}
                            index={index}
                            data={data}
                            handleFolderExpansion={handleFolderExpansion}
                            isExpandedList={isExpandedList}
                            handleAddition={handleAddition}
                        />
                    </div>
                );
            })}
        </Fragment>
    );
};

export default FIleExploer;
