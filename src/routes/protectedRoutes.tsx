import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import Users from '@/pages/users';
import Blogs from '@/pages/blogs';
import Subscriptions from '@/pages/subscriptions';
import PaymentSuccess from '@/pages/payment-success';
import PaymentCancel from '@/pages/payment-cancel';
// import Settings from '@/pages/settings';
// import SystemConfig from '@/pages/system-config';
// import ThirdPartyIntegrations from '@/pages/third-party-integrations';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UserDetails from '@/pages/users/user-details';
import { useAuthContext } from '@/hooks/AuthContext';
import { useEffect, useState } from 'react';
import NotFound from '@/components/common/NotFound';
import { useCheckUserSubscription, useGetProfile } from '@/api/userManagement';
import PlanCards from '@/components/subscriptions/PlanCards';
import { useLogoutUser } from '@/api/login';
import { Button } from '@/components/ui/button';
import SocialMediaDetail from '@/pages/social-media/SocialMediaDetail';
import SocialMedia from '@/pages/social-media';

const ProtectedRoutes = () => {
  const { setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { data: user } = useGetProfile();
  const { data: userSubscription } = useCheckUserSubscription();
  const [hasActivePlan, setHasActivePlan] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const { mutate: logoutUser } = useLogoutUser();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
      if (!token) {
        navigate('/');
      }
    };

    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'User') {
      if (!userSubscription?.has_active_plan) {
        setHasActivePlan(false);
        setSubscriptionPlans(userSubscription?.available_plans);
      } else {
        setHasActivePlan(true);
      }
    }
  }, [userSubscription]);

  return (
    <div>
      <div className="flex max-h-screen bg-gray-100">
        <Sidebar />
        <div className="h-screen w-full flex-1 overflow-y-auto">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 xsm:p-6 sm:p-8">
            {hasActivePlan && (
              <Routes>
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/users" element={user?.role !== 'User' ? <Users /> : <Navigate to="/not-found" />}></Route>
                <Route path="/users/:id/*" element={<UserDetails currentLoggedInUser={user} />}></Route>
                <Route path="/blogs" element={<Blogs />}></Route>
                <Route path="/social-media" element={<SocialMedia />}></Route>
                <Route path="/social-media/:platform" element={<SocialMediaDetail />} />
                <Route path="/subscriptions" element={<Subscriptions userRole={user?.role} />}></Route>
                <Route
                  path="/payment-success"
                  element={user?.role === 'User' ? <PaymentSuccess /> : <Navigate to="not-found/" />}
                />
                <Route
                  path="/payment-cancel"
                  element={user?.role === 'User' ? <PaymentCancel /> : <Navigate to="not-found/" />}
                />
                {/* <Route path="/settings" element={<Settings />} ></Route>
                <Route path="/system-config" element={<SystemConfig />} ></Route>
                <Route path="/third-party-integrations" element={<ThirdPartyIntegrations />} ></Route> */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
      {!hasActivePlan && (
        <div className="max-w-screen absolute left-0 top-0 z-50 flex h-screen w-full flex-col overflow-y-auto bg-black bg-opacity-50 p-10">
          <div className="mb-4 mt-10 flex items-center justify-center gap-4">
            <h2 className="text-2xl text-white">Purchase plan to continue or </h2>
            <Button
              onClick={() => {
                logoutUser();
              }}
            >
              Logout
            </Button>
          </div>
          <PlanCards plans={subscriptionPlans || []} classNames="justify-center" />
        </div>
      )}
    </div>
  );
};

export default ProtectedRoutes;
