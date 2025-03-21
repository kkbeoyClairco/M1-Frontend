import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetAuth, claircoAdminLogin } from 'redux/actions';
import { useRedux } from 'hooks';
import { useLocation, Location } from 'react-router-dom';

type LocationState = {
    from?: Location;
};

export type UserLoginData = {
    email: string;
    password: string;
};

export default function useClaircoAdminLogin() {
    const { t } = useTranslation();
    const { dispatch, appSelector } = useRedux();
    let redirectUrl: string = '/';
    const location: Location = useLocation();

    if (location.state) {
        const { from } = location.state as LocationState;
        redirectUrl = from ? from.pathname : '/';
    }

    const { loading, userLoggedIn, error, user } = appSelector((state) => ({
        loading: state.Auth.loading,
        error: state.Auth.error,
        user: state.Auth.user,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    //   form validation schema

    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required(t('Please enter Email')).email(t('Please enter a valid Email')),
            password: yup
                .string()
                .required(t('Please enter Password'))
                .min(8, t('Password must be at least 8 characters')),
        })
    );

    //   handle form submission

    const onSubmit = (formData: UserLoginData) => {
        dispatch(claircoAdminLogin(formData['email'], formData['password']));
        // console.log('bhanu')
    };

    return {
        redirectUrl,
        loading,
        userLoggedIn,
        error,
        user,
        schemaResolver,
        onSubmit,
    };
}
