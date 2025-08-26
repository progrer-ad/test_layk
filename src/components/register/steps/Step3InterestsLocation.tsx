// src/components/register/steps/Step3InterestsLocation.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // <-- ADDED THIS IMPORT!

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  errors: { [key: string]: string };
}

const Step3InterestsLocation: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const { t } = useTranslation('common'); // <-- ADDED THIS!
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const apiUrl = "https://68ac5f519148d.xvest1.ru/api";

  const handleSnackbarClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      if (!apiUrl) {
        setError(t('step3.api_error'));
        setSnackbarMessage(t('step3.contact_support'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoadingCountries(false);
        setLoadingLanguages(false);
        return;
      }

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const countriesResponse = await axios.get(`${apiUrl}/countries`, { headers });
        if (countriesResponse.data && Array.isArray(countriesResponse.data.countries)) {
          setCountries(countriesResponse.data.countries);
        } else {
          setError(t('step3.failed_to_fetch_countries'));
          setSnackbarMessage(t('step3.could_not_load_countries'));
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (err: any) {
        setError(`${t('step3.failed_to_load_countries_internet')}: ${err.message}`);
        setSnackbarMessage(t('step3.failed_to_load_countries_internet'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoadingCountries(false);
      }

      try {
        const languagesResponse = await axios.get(`${apiUrl}/languages`, { headers });
        if (languagesResponse.data && Array.isArray(languagesResponse.data.languages)) {
          setLanguages(languagesResponse.data.languages);
        } else {
          setError(t('step3.failed_to_fetch_languages'));
          setSnackbarMessage(t('step3.could_not_load_languages'));
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (err: any) {
        setError(`${t('step3.failed_to_load_languages_internet')}: ${err.message}`);
        setSnackbarMessage(t('step3.failed_to_load_languages_internet'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchDropdownData();
  }, [apiUrl, handleSnackbarClose, t]); // <-- Added 't' to the dependency array!

  const handleInterestsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentInterests = data.interests || [];
    const newInterests = checked
      ? [...currentInterests, value]
      : currentInterests.filter((item: string) => item !== value);
    updateData({ interests: newInterests });
  }, [data.interests, updateData]);

  const handleCountryChange = useCallback((event: React.SyntheticEvent, newValue: string | null) => {
    updateData({ country: newValue || '' });
  }, [updateData]);

  const handleLanguagesChange = useCallback((event: React.SyntheticEvent, newValue: string[]) => {
    updateData({ languages: newValue || [] });
  }, [updateData]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>{t('step3.title')}</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* --- My Interests --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step3.my_interests')}</FormLabel>
        <FormGroup row>
          {['sports', 'music', 'esotericism', 'cooking', 'computers', 'travel', 'other'].map((interestKey) => (
            <FormControlLabel
              key={interestKey}
              control={<Checkbox checked={(data.interests || []).includes(t(`step3.interests.${interestKey}`))} onChange={handleInterestsChange} value={t(`step3.interests.${interestKey}`)} />}
              label={t(`step3.interests.${interestKey}`)}
            />
          ))}
        </FormGroup>
        {(data.interests || []).includes(t('step3.interests.other')) && (
          <TextField
            margin="normal" fullWidth label={t('step3.specify_other_interests')} value={data.otherInterests || ''} onChange={(e) => updateData({ otherInterests: e.target.value })}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
          />
        )}
      </FormControl>

      {/* --- Place of residence (Autocomplete) --- */}
      <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
        <Autocomplete
          id="country-select"
          options={countries}
          loading={loadingCountries}
          value={data.country || null}
          onChange={handleCountryChange}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('step3.residence')}
              margin="normal"
              InputLabelProps={{ sx: { color: '#ff6384' } }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingCountries ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6384' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
                }
              }}
            />
          )}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ff6384' },
              '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
              '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
            },
            '& .MuiInputLabel-root': { color: '#ff6384' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
          }}
        />
      </FormControl>

      {/* --- Languages I speak (Autocomplete, multiple selection) --- */}
      <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
        <Autocomplete
          multiple
          id="language-select"
          options={languages}
          loading={loadingLanguages}
          value={data.languages || []}
          onChange={handleLanguagesChange}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('step3.languages_spoken')}
              margin="normal"
              InputLabelProps={{ sx: { color: '#ff6384' } }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loadingLanguages ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6384' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
                }
              }}
            />
          )}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ff6384' },
              '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
              '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
            },
            '& .MuiInputLabel-root': { color: '#ff6384' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
          }}
        />
      </FormControl>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Step3InterestsLocation;