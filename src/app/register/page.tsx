// src/app/register/page.tsx
'use client'; // This directive ensures the component runs on the client side

import { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation'; // Import useRouter
import RegisterForm from '../../components/register/RegisterForm'; // Your RegisterForm component

const RegisterPage = () => {
  const router = useRouter();

  // Redirect Logic
  useEffect(() => {
    // Check if a token or user data exists in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user'); // Assuming you store user data too

    if (token || user) {
      // If either exists, the user is likely logged in
      router.replace('/dashboard'); // Redirect to dashboard or another appropriate page
    }
  }, [router]); // Depend on router to ensure effect runs when router is ready

  return <RegisterForm />;
};

export default RegisterPage;