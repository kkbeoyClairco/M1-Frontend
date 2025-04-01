import React from 'react';
import { useNavigate } from 'react-router-dom';
interface BreadCrumbsProps {
    dataArray: (string | number)[];
}

/**
 * Breadcrumbs1 Component
 *
 * A reusable breadcrumb navigation component that displays a list of items
 * and allows navigation to previous steps when clicked.
 *
 * @component
 * @param {BreadCrumbsProps} props - The props for the Breadcrumbs1 component.
 * @param {(string | number)[]} props.dataArray - An array of breadcrumb items. Each item can be a string or a number.
 * @returns {JSX.Element} The rendered breadcrumb navigation component.
 *
 * @example
 * // Example usage:
 * const breadcrumbItems = ['Home', 'Dashboard', 'Settings'];
 * <Breadcrumbs1 dataArray={breadcrumbItems} />;
 */
const Breadcrumbs1: React.FC<BreadCrumbsProps> = ({ dataArray }) => {
    const navigate = useNavigate();
    const arrayLength = dataArray.length;
    const handleBackNavigation = async (index: number) => {
        try {
            const navCount = dataArray.length - 1 - index;
            if (navCount > 0) navigate(-navCount);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <nav aria-label="breadcrumb card">
            <ol className="breadcrumb mb-0 font-italic">
                {dataArray.map((item, index) => {
                    return (
                        <li
                            role="button"
                            onClick={() => handleBackNavigation(index)}
                            key={`${item}${index}`}
                            className={`breadcrumb-item cursor-pointer ${index === arrayLength - 1 ? 'active' : ''}`}
                            aria-current={index === arrayLength - 1 ? 'page' : undefined}>
                            {item ?? ''}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs1;
