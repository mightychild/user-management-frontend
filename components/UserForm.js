import { useState, useCallback } from 'react';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Avatar, 
  IconButton,
  Box,
  Typography
} from '@mui/material';
import { CameraAlt, Delete } from '@mui/icons-material';

export default function UserForm({ onSubmit, disabled, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'user',
    status: initialData?.status || 'active',
    profilePhoto: initialData?.profilePhoto || null
  });

  const [previewUrl, setPreviewUrl] = useState(
    initialData?.profilePhoto?.url || null
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size should be less than 5MB');
      return;
    }

    // Create fake upload with preview
    const fakeFileUrl = URL.createObjectURL(file);
    setPreviewUrl(fakeFileUrl);
    setFormData(prev => ({
      ...prev,
      profilePhoto: {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        url: fakeFileUrl // This would be a server URL in real implementation
      }
    }));
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up memory
    }
    setPreviewUrl(null);
    setFormData(prev => ({
      ...prev,
      profilePhoto: null
    }));
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare form data (mocking server upload in this example)
    const submissionData = {
      ...formData,
      // For real implementation, you would send the file separately
      profilePhoto: formData.profilePhoto 
        ? { 
            name: formData.profilePhoto.name,
            // In real app, this would be the server-generated URL
            url: 'https://example.com/fake-upload/' + formData.profilePhoto.name 
          } 
        : null
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Profile Photo Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Profile Photo
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 1
        }}>
          <Avatar
            src={previewUrl}
            sx={{ 
              width: 100, 
              height: 100,
              border: '1px dashed #ddd',
              bgcolor: previewUrl ? 'transparent' : '#f5f5f5'
            }}
          >
            {!previewUrl && <CameraAlt fontSize="large" color="action" />}
          </Avatar>
          
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
            />
            <label htmlFor="profile-photo-upload">
              <Button 
                variant="outlined" 
                component="span"
                startIcon={<CameraAlt />}
                disabled={disabled}
                sx={{ mr: 1 }}
              >
                {previewUrl ? 'Change' : 'Upload'}
              </Button>
            </label>
            
            {previewUrl && (
              <IconButton
                onClick={handleRemovePhoto}
                color="error"
                disabled={disabled}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
        {previewUrl && (
          <Typography variant="caption" color="textSecondary">
            {formData.profilePhoto?.name} ({Math.round(formData.profilePhoto?.size / 1024)} KB)
          </Typography>
        )}
      </Box>

      <TextField
        name="name"
        label="Name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
        required
        disabled={disabled}
      />
      
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={disabled}
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={disabled}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Role"
          disabled={disabled}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Status"
          disabled={disabled}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={disabled}
        sx={{ mt: 3 }}
        fullWidth
      >
        {disabled ? 'Saving...' : 'Save User'}
      </Button>
    </form>
  );
}