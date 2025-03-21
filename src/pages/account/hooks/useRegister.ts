import { yupResolver } from '@hookform/resolvers/yup';
import { useRedux } from 'hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loginUser, resetAuth } from 'redux/actions';
import * as yup from 'yup';
import { UserData } from '../Register';

export default function useRegister() {
    const { t } = useTranslation();
    const { dispatch, appSelector } = useRedux();

    const { loading, userSignUp, error } = appSelector((state) => ({
        loading: state.Auth.loading,
        error: state.Auth.error,
        userSignUp: state.Auth.userSignUp,
    }));

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required('Please enter Email').email('Please enter valid Email'),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = (formData: UserData) => {
        dispatch(loginUser( formData['email'], formData['password']));
        console.log(formData)
    };

    return {
        loading,
        userSignUp,
        error,
        schemaResolver,
        onSubmit,
    };
}
