import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AllRoutes } from './index';
import { Toaster } from 'sonner';
const Routes = () => {
    return (
        <HashRouter>
            <Toaster richColors expand={true} />
            <AllRoutes />
        </HashRouter>
        // <BrowserRouter>
        //     <AllRoutes />
        // </BrowserRouter>
    );
};

export default Routes;
