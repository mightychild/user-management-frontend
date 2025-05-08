import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { login } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setError(
        err.message.includes('401') 
          ? 'Invalid email or password' 
          : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: isMobile ? 2 : 3
    }}>
      <Paper elevation={3} sx={{ 
        p: isMobile ? 3 : 4,
        width: '100%',
        borderRadius: 3,
        boxShadow: theme.shadows[4],
        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ 
          fontWeight: 600,
          mb: 4,
          color: 'primary.main'
        }}>
          User Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ 
            mb: 3,
            borderRadius: 2
          }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 3, 
              height: 48,
              borderRadius: 2,
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}