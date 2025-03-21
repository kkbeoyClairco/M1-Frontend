import { ModalButton } from './ModalButton';
import { Row, Col, Card } from 'react-bootstrap';
import { Table } from 'components';
import { sizePerPageList } from './columns';
type sectionType = {
    title: string;
    onAddClick: any;
    data: any;
    columns: any;
    modal: any;
    modalProps: any;
};

export const Section = ({ title, onAddClick, data, columns, modal = null, modalProps }: sectionType) => {
    return (
        <Row className="mt-4">
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Col lg={6}>
                                <h4 className="header-title mb-3">{title}</h4>
                            </Col>
                            <Col lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ModalButton onClick={onAddClick} text={`Add ${title.slice(0, -1)}`} />
                            </Col>
                        </Row>
                        <Table
                            columns={columns}
                            data={data ?? []}
                            pageSize={10}
                            sizePerPageList={sizePerPageList}
                            isSortable
                            pagination
                            isSearchable
                            tableClass="table-striped text-center"
                            searchBoxClass="mb-2"
                        />
                    </Card.Body>
                    {modal && <modal.Component {...modalProps} />}
                </Card>
            </Col>
        </Row>
    );
};
