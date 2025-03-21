import { Button } from 'react-bootstrap';
type modelButtonType = {
    onClick : ()=>{},
    text:string
}
export const ModalButton = ({ onClick, text} :modelButtonType) => (
    <Button
        style={{ backgroundColor: '#008675', borderColor: '#008675' }}
        variant="primary"
        onClick={onClick}
        className="mb-3"
    >
        {text}
    </Button>
);