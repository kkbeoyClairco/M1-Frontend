import { FormInput } from 'components';
import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useSSR } from 'react-i18next';
interface InputFormState {
    zoneName: string;
    blob: number;
}
interface InputFormInterface {
    data: any;
    setData: React.Dispatch<React.SetStateAction<InputFormState | undefined>>;
}
const InputForm: React.FC<InputFormInterface> = ({ data, setData }) => {
    // const [data, setData] = useState<{ zoneName: string; blob: number }>();
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            let { name, value } = e.target;

            setData((prev: any) => ({
                ...prev,
                [name]: name === 'blob' ? (value ? Number(value) : null) : value,
            }));
            console.log(name, value);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            {' '}
            <Form.Label>{'Zone Name'}</Form.Label>
            <FormInput
                placeholder={'Enter Zone Name... '}
                type="text"
                name={'zoneName'}
                containerClass={'mb-1'}
                key="zoneName"
                value={data?.zoneName ?? ''}
                onChange={handleInputChange}
            />
            <Form.Label className="mt-2">{'Blob %'}</Form.Label>
            <FormInput
                placeholder={'Enter the Blob Percentage... '}
                type="number"
                name={'blob'}
                containerClass={'mb-1'}
                key="blob"
                value={data?.blob}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default InputForm;
