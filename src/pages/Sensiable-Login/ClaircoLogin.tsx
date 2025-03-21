import { Navigate, Link } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { VerticalForm, FormInput } from 'components';
import AccountLayout2 from 'pages/account/AccountLayout2';
// import { useLogin } from 'pages/account/hooks';
import sensiableuseLogin from 'pages/account/hooks/sensiableuseLogin';
type UserData = {
    email: string;
    password: string;
};

const ClaircoLogin = () => {
    const { t } = useTranslation();
    const { loading, userLoggedIn, error, redirectUrl, schemaResolver, onSubmit } = sensiableuseLogin();
    console.log('onSubmit');
    return (
        <>
            <AccountLayout2>
                {userLoggedIn ? <Navigate to={redirectUrl} /> : null}

                <h4 className="mt-0">{t(' Sign In')}</h4>
                <p className=" mb-4">{t('Enter your email address and password to access account.')}</p>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {error}
                    </Alert>
                )}

                <VerticalForm<UserData>
                    onSubmit={onSubmit}
                    resolver={schemaResolver}
                    // defaultValues={{ email: 'test@gmail.com', password: 'test' }}
                >
                    <FormInput
                        label={t('Email address')}
                        type="email"
                        name="email"
                        placeholder={t('Enter your email')}
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}
                    />
                    <div className="mb-0 d-grid text-center">
                        <Button className="button button-login" type="submit" disabled={loading}>
                            {t('Log In')}
                        </Button>
                    </div>
                </VerticalForm>
            </AccountLayout2>
        </>
    );
};

export default ClaircoLogin;
