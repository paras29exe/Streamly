import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { DisplayContextProvider } from './context/displayContext'
import { store } from './store/store.js'
import { Provider, useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { autoLogin } from './store/asyncThunks/authThunk.js'
import InitialSkeleton from './components/InitialSkeleton.jsx'
import ServerDown from './pages/ServerDown.jsx'
import AppRouter from './Routing.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import axios from 'axios'

function Main() {
    const dispatch = useDispatch();
    const { error, loading } = useSelector(state => state.auth);
    const [serverStatus, setServerStatus] = React.useState(true);
    const [initialLoading, setInitialLoading] = React.useState(true);

    React.useEffect(() => {
        const initiateAutoLogin = async () => {

            try {
                await dispatch(autoLogin()).unwrap(); // use .unwrap() to handle any errors
            } catch (error) {
                console.error('Error during auto login:', error);
            } finally {
                setInitialLoading(false); // Stop loading once auto-login completes
            }
        };

        axios.get(import.meta.env.VITE_BASE_BACKEND_URL + '/ping', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })
            .then(initiateAutoLogin)
            .catch(err => {
                setServerStatus(false);
                setInitialLoading(false); // Stop loading if server is down
                throw new Error('Server is down');
            })

    }, []);

    if (initialLoading) return <InitialSkeleton />

    if (serverStatus === false) {
        return <ServerDown />;
    }

    return <AppRouter />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
            <Provider store={store}>
                <DisplayContextProvider>
                    <Main />
                </DisplayContextProvider>
            </Provider>
        </GoogleOAuthProvider>

    </React.StrictMode>
)
