import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
    redirect,
} from 'react-router-dom';
import './App.css';
import Home from './routes/Home';
import Signin from './routes/Signin';
import Signup from './routes/Signup';
import Dashboard from './routes/Dashboard';
import FeedbackList from './routes/FeedbackList';
import CreateFeedback from './routes/CreateFeedback';
import ViewFeedback from './routes/ViewFeedback';
import AnswerFeedback from './routes/AnswerFeedback';
import UserProfile from './routes/UserProfile';
import Report from './routes/Report';
import ProtectedRoutes from './layouts.tsx/ProtectedRoutes';
import PublicLayout from './layouts.tsx/PublicLayout';
import { loginAction, signupAction } from './lib/authUtils';
import { AuthProvider } from './context/AuthContext';
import { account } from './lib/appWrite/config';
import DashboardLayout from './layouts.tsx/DashboardLayout';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AuthProvider />}>
            {/* Public */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route
                    path="/sign-in"
                    element={<Signin />}
                    action={loginAction}
                    errorElement={<div>Oups</div>}
                />
                <Route
                    path="/sign-up"
                    element={<Signup />}
                    action={signupAction}
                    errorElement={<div>Oups</div>}
                />
            </Route>
            {/* Protected */}
            <Route
                path="/app"
                loader={async () => {
                    try {
                        // logged in? pass user to the route
                        const user = await account.get();
                        return { user };
                    } catch {
                        // not logged in? redirect to login
                        throw redirect('/sign-in');
                    }
                }}
                element={<ProtectedRoutes />}
            >
                <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="feedbacks" element={<FeedbackList />}>
                        <Route path="create" element={<CreateFeedback />} />
                        <Route
                            path="view/:campaignId"
                            element={<ViewFeedback />}
                        />
                        <Route path="report/:campaignId" element={<Report />} />
                        <Route
                            path="answer/:campaignId"
                            element={<AnswerFeedback />}
                        />
                    </Route>
                    <Route path="profile" element={<UserProfile />} />
                </Route>
            </Route>
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
