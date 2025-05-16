import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/app-sidebar'
import { Toaster } from './components/ui/sonner'
import { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/protected-route';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from './pages/Home';
import Collections from './pages/collections/Page';
import { ThemeProvider } from './components/theme-provider';
import Products from './pages/products/page';
import Orders from './pages/orders/page';
import Customers from './pages/Customers';
import NewProduct from './pages/products/new/page';
import EditProduct from './pages/products/id/page';
import NewCollection from './pages/collections/new/page';
import EditCollection from './pages/collections/id/page';
import IsOnline from './components/IsOnline';
import OrderDetails from './pages/orders/id/page';
import HomePageData from './pages/HomePageData/page';
import LoginPage from './pages/login/page';
import { useAuth } from './hooks/useAuth';
import { fetchUser } from './lib/api';
import { toast } from 'sonner';
import Loader from './components/custom ui/Loader';
import { ModeToggle } from './components/ui/theme-toggle';
import useDynamicMeta from './hooks/useDynamicMetaData';
import Breadcrumb from './components/BreadCrumb';
import ImageUploadPage from './pages/ImageUpload/page';

export const API_BASE = import.meta.env.VITE_API_URL;
function App() {
  const [queryClient] = useState(() => new QueryClient());
  const { user, loading, shouldFetch, setUser, clearUser } = useAuth()

  useDynamicMeta();

  useEffect(() => {
    async function loadUser() {
      try {
        if (user) return;
        const userFetch = await fetchUser()
        if (typeof userFetch !== 'string') {
          setUser(userFetch)
        } else {
          toast.error(userFetch);
          clearUser();
        }
      } catch (error) {
        toast.error((error as Error).message)
      }
    }

    loadUser()
  }, [shouldFetch, user])
  if (loading) return <Loader />;
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider defaultOpen={false}>
          <Toaster position='top-right' />
          <IsOnline />
          {user && <AppSidebar />}
          <main className='w-full'>

            <SidebarTrigger title={user ? 'Press Crtl + B To Open Sidebar' : 'Login first to open sidebar'} className='cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 mx-[9.5px] mt-[9.5px]' />
            <ModeToggle />
            <Breadcrumb/>
            <Suspense fallback={'<Loader />'}>
              <Routes>
                {/* Not logged In Route */}
                <Route
                  path="/login"
                  element={
                    <ProtectedRoute isAuthenticated={user ? false : true} redirect='/'>
                      <LoginPage />
                    </ProtectedRoute>
                  }
                />
                {/* Logged In User Routes */}
                <Route
                  element={<ProtectedRoute isAuthenticated={user ? true : false} redirect='/login' />}
                >
                  <Route path="/" element={<Home />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/home-page" element={<HomePageData />} />
                  <Route path="/collections/new" element={<NewCollection />} />
                  <Route path="/collections/edit/:id" element={<EditCollection />} />
                  <Route path="/products/new" element={<NewProduct />} />
                  <Route path="/products/edit/:id" element={<EditProduct />} />
                  <Route path="/orders/manage/:id" element={<OrderDetails />} />
                  <Route path="/image-upload" element={<ImageUploadPage />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
