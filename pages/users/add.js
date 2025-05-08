import { useRouter } from 'next/router';
import { useState } from 'react';
import { 
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import UserForm from '../../components/UserForm';
import { createUser } from '../../lib/api';

export default function AddUser() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      await createUser(userData);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500); // Redirect after 1.5s
    } catch (err) {
      setError(err.message || 'Failed to create user');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ 
      py: isMobile ? 2 : 4,
      px: isMobile ? 1 : 3
    }}>
      <Box sx={{
        p: isMobile ? 2 : 4,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: 'background.paper'
      }}>
        {/* Header */}
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: 'primary.main',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}
        >
          Add New User
        </Typography>

        {/* Loading */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            my: 4 
          }}>
            <CircularProgress size={isMobile ? 40 : 60} />
          </Box>
        )}

        {/* User Form */}
        <UserForm 
          onSubmit={handleSubmit} 
          disabled={loading}
        />

        {/* Error */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="error"
            sx={{ 
              width: '100%',
              borderRadius: 1,
              alignItems: 'center'
            }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Success */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity="success"
            sx={{ 
              width: '100%',
              borderRadius: 1,
              alignItems: 'center'
            }}
          >
            User created successfully! Redirecting...
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}