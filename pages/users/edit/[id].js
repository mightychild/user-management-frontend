import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUser, updateUser } from '../../../lib/api';
import UserForm from '../../../components/UserForm';
import { 
  Container, CircularProgress, Alert, 
  Snackbar, Typography 
} from '@mui/material';

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(id);
        setUser(user);
      } catch (err) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (userData) => {
    try {
      await updateUser(id, userData);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit User
      </Typography>
      <UserForm 
        initialData={user} 
        onSubmit={handleSubmit} 
      />
    </Container>
  );
}