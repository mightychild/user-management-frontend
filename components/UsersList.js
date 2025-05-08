import { useState, useEffect } from 'react';
import { 
  Button,
  ButtonGroup,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  MenuItem,
  Select,
  Grid
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage
} from '@mui/icons-material';
import UserTable from './UserTable';
import { getUsers } from '../lib/api';

export default function UsersList({ users: initialUsers = [], onDelete }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0
  });

  const updateUsers = (updatedUsers) => {
    setUsers(updatedUsers);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { users, pagination: apiPagination } = await getUsers(
        pagination.page + 1,
        pagination.limit
      );
      setUsers(users);
      setPagination(prev => ({
        ...prev,
        total: apiPagination.total
      }));
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (e) => {
    setPagination(prev => ({
      ...prev,
      limit: Number(e.target.value),
      page: 0
    }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentStart = Math.min(
    (pagination.page * pagination.limit) + 1,
    pagination.total
  );
  const currentEnd = Math.min(
    (pagination.page + 1) * pagination.limit,
    pagination.total
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          <UserTable 
            users={users} 
            onDelete={onDelete}
          />
          
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Rows per page:
                </Typography>
                <Select
                  value={pagination.limit}
                  onChange={handleLimitChange}
                  size="small"
                  sx={{ 
                    height: '36px',
                    '& .MuiSelect-select': { py: 0.65 }
                  }}
                >
                  {[5, 10, 25, 50, 100].map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                <strong>Pg {pagination.page + 1}</strong> | {currentStart}-{currentEnd} of {pagination.total}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ButtonGroup variant="outlined" size="small">
                <IconButton 
                  disabled={pagination.page === 0}
                  onClick={() => handlePageChange(0)}
                  aria-label="first page"
                >
                  <FirstPage />
                </IconButton>
                <IconButton 
                  disabled={pagination.page === 0}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  aria-label="previous page"
                >
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton 
                  disabled={pagination.page >= totalPages - 1}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  aria-label="next page"
                >
                  <KeyboardArrowRight />
                </IconButton>
                <IconButton 
                  disabled={pagination.page >= totalPages - 1}
                  onClick={() => handlePageChange(totalPages - 1)}
                  aria-label="last page"
                >
                  <LastPage />
                </IconButton>
              </ButtonGroup>
            </Grid>
          </Grid>

          {totalPages > 5 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 0.5 }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.page < 3) {
                  pageNum = i;
                } else if (pagination.page > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "contained" : "outlined"}
                    onClick={() => handlePageChange(pageNum)}
                    size="small"
                    sx={{ minWidth: '32px' }}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}