// src/components/register/steps/Step1BasicInfo.tsx
import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  errors: { [key: string]: string };
}

const Step1BasicInfo: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { t } = useTranslation('common');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>{t("register_step1.your_information")}</Typography>
      <TextField
        margin="normal" required fullWidth id="name" label={t("register_step1.full_name")} name="name"
        autoComplete="name" autoFocus value={data.name} onChange={(e) => updateData({ name: e.target.value })}
        error={!!errors.name} helperText={errors.name}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#ff6384' }} /></InputAdornment>) }}
      />
      <TextField
        margin="normal" required fullWidth id="email" label={t("register_step1.email_address")} name="email"
        autoComplete="email" value={data.email} onChange={(e) => updateData({ email: e.target.value })}
        error={!!errors.email} helperText={errors.email}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#ff6384' }} /></InputAdornment>) }}
      />
      <TextField
        margin="normal" required fullWidth name="password" label={t("register_step1.password")}
        type={showPassword ? 'text' : 'password'} id="password" // <--- FIX IS HERE: Added missing "
        autoComplete="new-password" value={data.password} onChange={(e) => updateData({ password: e.target.value })}
        error={!!errors.password} helperText={errors.password}
        InputProps={{
          startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#ff6384' }} /></InputAdornment>),
          endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment>),
        }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
      />
      <TextField
        margin="normal" required fullWidth name="password_confirmation" label={t("register_step1.password_confirm")}
        type={showPassword ? 'text' : 'password'} id="password_confirmation" autoComplete="new-password"
        value={data.passwordConfirmation} onChange={(e) => updateData({ passwordConfirmation: e.target.value })}
        error={!!errors.password_confirmation || (data.passwordConfirmation !== data.password && data.passwordConfirmation !== '')}
        helperText={errors.password_confirmation || (data.passwordConfirmation !== data.password && data.passwordConfirmation !== '' ? 'Passwords do not match' : '')}
        InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#ff6384' }} /></InputAdornment>) }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
      />
    </Box>
  );
};

export default Step1BasicInfo;