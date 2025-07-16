import { coloursTable } from 'appConstants/propertyTable';
import LeanParallelSketon from 'components/ClaircoCustomer/Skeltons/LeanParallelSketon';
import React, { useState } from 'react';
interface VerticalParametersGroupProp {
    isLoading?: boolean;
    parameters: (string | number)[];
    selectedParameter: string;
    parameterDisplayNames?: Record<string, string>;
    onSelectFn: (selected?: string, index?: number) => Promise<void>;
}
const VerticalParametersGroup: React.FC<VerticalParametersGroupProp> = ({
    isLoading = false,
    parameters,
    selectedParameter,
    parameterDisplayNames,
    onSelectFn,
}: any) => {
    const [hovered, setHovered] = useState<string | number | null>(null);

    return (
        <>
            {' '}
            {!isLoading ? (
                parameters.map((parameter: string, index: number) => {
                    const isHovered = parameter === hovered;

                    return (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.35em',
                                paddingLeft: '2em',
                                cursor: 'pointer',
                                marginBottom: '0.5em',
                                borderRadius: '8px',
                                background:
                                    parameter === selectedParameter ? '#e0f7fa' : isHovered ? '#b2dfdb' : 'transparent',
                                border: parameter === selectedParameter ? '2px solid #008675' : '1px solid #eee', // colored border
                                boxShadow: parameter === selectedParameter ? '0 2px 8px rgba(0,105,92,0.08)' : 'none',
                                transition: 'background 0.2s, border 0.2s',
                            }}
                            onClick={() => onSelectFn(String(parameter), index)}
                            key={parameter}
                            onMouseEnter={() => setHovered(parameter)}
                            onMouseLeave={() => setHovered(null)}>
                            {' '}
                            <div
                                style={{
                                    background: Object.values(coloursTable)[index],
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
                                    fontWeight: parameter === selectedParameter ? 'bold' : '',
                                    color: parameter === selectedParameter ? '#00695C' : '#333', // use a dark green for selected
                                }}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id={`param-${parameter}`}
                                    onClick={() => onSelectFn(parameter)}
                                    checked={selectedParameter === parameter}
                                    readOnly
                                />
                                <label
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    className="form-check-label"
                                    htmlFor={`param-${parameter}`}>
                                    {parameterDisplayNames
                                        ? parameterDisplayNames[parameter as keyof typeof parameterDisplayNames]
                                        : parameter}
                                </label>
                            </div>
                        </div>
                    );
                })
            ) : (
                <LeanParallelSketon />
            )}
        </>
    );
};

export default React.memo(VerticalParametersGroup);
