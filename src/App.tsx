import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Login from './pages/Authentication/Login';
import CreateTour from './pages/CreateTour';
import CreateTourPackage from './pages/CreateTourPackage';
import TourDetail from './pages/TourDetail';
import AllTourPackages from './pages/AllTourPackages';
import SeoPage from './pages/SeoPage';
import PackageDetail from './pages/PackageDetailPage';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Triangle India | Signin" />
              <Login />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/create-tour"
          element={
            <>
              <PageTitle title="Create Tour | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateTour />
            </>
          }
        />
        <Route
          path="/create-tour-package"
          element={
            <>
              <PageTitle title="Create Tour Package | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <CreateTourPackage />
            </>
          }
        />
        <Route
          path="/tour-detail/:id"
          element={
            <>
              <PageTitle title="Tour Detail | Triangle India Tour" />
              <TourDetail />
            </>
          }
        />
        <Route
          path="/all-tour-packages"
          element={
            <>
              <PageTitle title="All Packages | Triangle India Tour" />
              <AllTourPackages />
            </>
          }
        />
        <Route
          path="/manage-seo"
          element={
            <>
              <PageTitle title="SEO Mangement | Triangle India Tour" />
              <SeoPage />
            </>
          }
        />

        <Route
          path="/tour-package/:id"
          element={
            <>
              <PageTitle title="Tour package | Triangle India Tour" />
              <PackageDetail />
            </>
          }
        />
        <Route
          index
          path="*"
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
