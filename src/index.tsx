import ReactDOM from 'react-dom';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from 'redux/store';
import { ToastContextProvider } from 'context/ToastContext';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorPage from 'pages/error/ErrorPage';
ReactDOM.render(
    <Provider store={configureStore({})}>
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <ToastContextProvider>
                <App />
            </ToastContextProvider>
        </ErrorBoundary>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
