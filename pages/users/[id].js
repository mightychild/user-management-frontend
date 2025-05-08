import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import UserForm from '../../components/UserForm';
import { getUser, updateUser } from '../../lib/api';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      const loadUser = async () => {
        try {
          const { user } = await getUser(id);
          setUser(user);
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      };
      loadUser();
    }
  }, [id]);

  const handleSubmit = async (userData) => {
    try {
      await updateUser(id, userData);
      router.push('/');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (!user) return <Layout>Loading...</Layout>;

  return (
    <Layout>
      <UserForm user={user} onSubmit={handleSubmit} />
    </Layout>
  );
}