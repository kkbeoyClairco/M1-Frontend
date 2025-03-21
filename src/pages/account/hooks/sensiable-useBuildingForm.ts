import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addBuilding } from 'helpers/api/services/addBulding';


export default function useBuildingForm(onClose: () => void) {
    const { t } = useTranslation();

    const schemaResolver = yupResolver(
        yup.object().shape({
            building: yup.string().required(t('Please enter building')),
            city: yup.string().required(t('Please enter city')),
            cost: yup.string().required(t('Please enter cost per sqft')),
            floors: yup.string().required(t('Please enter number of floors')),
        })
    );

    const onSubmit = async (formData: any) => {
        try {
                await addBuilding(formData);      
                window.location.reload()
                onClose();
        } catch (e: any) {
            console.error(e.message);
        }
    };

    return {
        schemaResolver, 
        onSubmit,
    };
}


