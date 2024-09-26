import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
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
import {
    addOrganisationAction,
    addOrUpdateResponse,
    addUserToOrganisation,
    checkoutSuccess,
    compiledResponsesLoader,
    createFeedback,
    createQuestion,
    deleteQuestion,
    getAllFeedbacks,
    getAllQuestions,
    getOrganisation,
    getQuestionById,
    getUserOrganisations,
    loginAction,
    signupAction,
    updateCampaign,
    updateQuestion,
} from './lib/authUtils';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts.tsx/DashboardLayout';
import NewOrganisation from './routes/NewOrganisation';
import Organisations from './routes/Organisations';
import Organisation from './routes/Organisation';
import AddUser from './routes/AddUser';
import AddQuestion from './routes/AddQuestion';
import EditQuestion from './routes/EditQuestion';
import CheckoutSuccess from './routes/CheckoutSuccess';

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
            <Route path="/app" element={<ProtectedRoutes />}>
                <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard />}></Route>
                    <Route
                        path="checkout/success"
                        element={<CheckoutSuccess />}
                        loader={checkoutSuccess}
                        errorElement={<div>Impossible d'afficher checkout</div>}
                    />
                    <Route path="feedbacks">
                        <Route
                            index
                            element={<FeedbackList />}
                            loader={getAllFeedbacks}
                        ></Route>
                        <Route
                            path="create"
                            element={<CreateFeedback />}
                            action={createFeedback}
                            errorElement={
                                <div>Impossible de créer le feedback</div>
                            }
                        />
                        <Route
                            path="update-campaign/:campaignId"
                            action={updateCampaign}
                        />
                        <Route
                            path="add-question/:campaignId"
                            element={<AddQuestion />}
                            action={createQuestion}
                            errorElement={
                                <div>Impossible de créer la question</div>
                            }
                        />
                        <Route
                            path="edit-question/:campaignId/:questionId"
                            element={<EditQuestion />}
                            loader={getQuestionById}
                            action={updateQuestion}
                            errorElement={
                                <div>Impossible de modifier la question</div>
                            }
                        />
                        <Route
                            path="delete-question/:campaignId"
                            action={deleteQuestion} // Fonction d'action pour la suppression
                        />
                        <Route
                            path="add-response/:campaignId/:questionId"
                            action={addOrUpdateResponse} // Fonction d'action pour ajouter ou mettre à jour une réponse
                        />

                        <Route
                            path="view/:campaignId"
                            element={<ViewFeedback />}
                            loader={getAllQuestions}
                        />
                        <Route
                            path="report/:campaignId"
                            element={<Report />}
                            loader={compiledResponsesLoader}
                        />
                        <Route
                            path="answer/:campaignId"
                            element={<AnswerFeedback />}
                        />
                    </Route>
                    <Route path="profile" element={<UserProfile />} />
                    <Route
                        path="organisations"
                        element={<Organisations />}
                        loader={getUserOrganisations}
                        errorElement={
                            <div>Impossible de charger vos organisations</div>
                        }
                    />
                    <Route
                        path="organisations/:organisationId"
                        element={<Organisation />}
                        loader={getOrganisation}
                        errorElement={
                            <div>Impossible de charger l' organisation</div>
                        }
                    />
                    <Route
                        path="organisations/:organisationId/addUser"
                        element={<AddUser />}
                        action={addUserToOrganisation}
                        errorElement={
                            <div>Impossible d'ajouter un utilisateur</div>
                        }
                    />
                    <Route
                        path="add-organisation"
                        element={<NewOrganisation />}
                        action={addOrganisationAction}
                        errorElement={<div>Oups</div>}
                    />
                </Route>
            </Route>
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
