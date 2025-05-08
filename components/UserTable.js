import PropTypes from 'prop-types';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function UserTable({ users, onDelete, onEdit }) {
  const router = useRouter();

  const handleDeleteClick = (userId) => {
    
      onDelete(userId); // Now safely calling the prop
    
  };

  const handleEditClick = (userId) => {
    if (onEdit) {
      onEdit(userId);
    } else {
      router.push(`/users/edit/${userId}`);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(user._id)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(user._id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UserTable.propTypes = {
  users: PropTypes.array,
  onDelete: PropTypes.func.isRequired, // Mark as required
  onEdit: PropTypes.func
};