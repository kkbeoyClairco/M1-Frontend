import { Button, Modal } from 'react-bootstrap';
import { useToggle } from 'hooks';
import { useState } from 'react';
import classNames from 'classnames';
import { FormInput } from 'components';
import { useForm } from 'react-hook-form';

const FilterModal = () => {
    const [isOpen, toggleModal] = useToggle();
    const [scroll, setScroll] = useState<boolean>(false);
    const [className, setClassName] = useState<string>('');

    const openModalWithClass = (className: string) => {
        setClassName(className);
        setScroll(false);
        toggleModal();
    };

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    const methods = useForm({
        defaultValues: {
            password: '12345',
            statictext: 'email@example.com',
            color: '#727cf5',
        },
    });
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = methods;

    return (
        <>
            <Button className="btn btn-primary ms-1 float-end" onClick={() => openModalWithClass('primary')}>
                <i className="mdi mdi-filter-variant"></i>
            </Button>
            <Modal show={isOpen} onHide={toggleModal}>
                <Modal.Header
                    onHide={toggleModal}
                    closeButton
                    className={classNames('modal-colored-header', 'bg-' + className)}>
                    <h4 className="modal-title text-light">Filter</h4>
                </Modal.Header>
                <Modal.Body>
                    {/* test input form */}
                    <form onSubmit={handleSubmit(() => {})}>
                        <FormInput
                            label="Text"
                            type="text"
                            name="text"
                            containerClass={'mb-3'}
                            register={register}
                            key="text"
                            errors={errors}
                            control={control}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={toggleModal}>
                        Close
                    </Button>{' '}
                    <Button variant={className} onClick={toggleModal}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FilterModal;
