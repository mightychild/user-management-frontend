import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/auth';

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, []);

  return isAuthenticated() ? children : null;
}