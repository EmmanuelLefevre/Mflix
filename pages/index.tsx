// pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';


const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
      router.push('/api-doc');
    }
    else {
      router.push('/login');
    }
  }, [router]);

  return null;
};

export default Home;
