import { Col } from 'react-bootstrap';
export const ChooseBuildings = ({ buildingList = [], imageSrc='' ,setBuilding=(id:string)=>{},customerName=''}) => {
    const buildings = buildingList.map((building: any) => {
        return (
            <option value={building.value} key={building.value}>{building.label}</option>
        );
    });
    const handleOnchange = (event:any)=>{
        const data = event.target;
        setBuilding(data.value);
    }
    return (
        <>
            <Col md={3}>
                <div className="widget-flat-dummy">
                    <h1>{customerName}</h1>
                    <select name="Select Building"  placeholder='Select Building' onChange={handleOnchange}>
                        <option value='0'>Select Building</option>
                        {buildings}
                    </select>
                </div>
            </Col>
            {imageSrc && (
                <>
                    <Col md={3}>
                        <div className="widget-flat-dummy" style={{ background: 'white' }}>
                            <img
                                src={imageSrc}
                                style={{
                                    objectFit: 'fill',
                                    height: '100%',
                                    width: '100%',
                                    objectPosition: ' 80% 100%',
                                    marginLeft: '0',
                                }}
                                alt=""
                            />
                        </div>
                    </Col>
                </>
            )}
        </>
    );
};
