import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUsers, deleteUser } from '../lib/api';
import Layout from '../components/Layout';
import UsersList from '@/components/UsersList';
import { 
  Box, 
  Button, 
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';

export default function Dashboard() {
  const [users, setUsers] = useState([]); // This is your state variable
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { users } = await getUsers();
        setUsers(users); // Setting the users state
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId); // API call to backend
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId)); // Update state
        setSnackbar({ open: true, message: 'User deleted successfully' });
      } catch (err) {
        setSnackbar({ open: true, message: err.message || 'Failed to delete user' });
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </Box>
  );

  if (error) return (
    <Layout>
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    </Layout>
  );

  return (
    <Layout>
      <Box sx={{ 
        p: isMobile ? 2 : 3,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: 'primary.main'
          }}>
            User Management
          </Typography>
          <Button 
            variant="contained" 
            href="/users/add"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Add User
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {/* Corrected: using 'users' instead of 'userList' */}
          <UsersList 
            users={users} 
            onDelete={handleDelete} 
          />
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity="success" 
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}