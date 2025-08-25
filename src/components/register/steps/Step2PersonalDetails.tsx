// src/components/register/steps/Step2PersonalDetails.tsx
import React from 'react';
import {
  Box, Typography, TextField, FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Checkbox, InputAdornment,
  FormGroup
} from '@mui/material';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import { useTranslation } from 'react-i18next';

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  errors: { [key: string]: string };
}

const Step2PersonalDetails: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const { t } = useTranslation('common');
  
  const handleCoupleGenderDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentDetails = data.coupleGenderDetails || [];
    if (checked) {
      updateData({ coupleGenderDetails: [...currentDetails, value] });
    } else {
      updateData({ coupleGenderDetails: currentDetails.filter((item: string) => item !== value) });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>{t('step2.title')}</Typography>

      {/* --- My Gender --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step2.my_gender')}</FormLabel>
        <RadioGroup
          row
          value={data.gender}
          onChange={(e) => {
            updateData({ gender: e.target.value });
            if (e.target.value !== 'couple') {
              updateData({ coupleGenderDetails: [] });
            }
          }}
        >
          <FormControlLabel value="female" control={<Radio />} label={t('step2.gender_options.woman')} />
          <FormControlLabel value="male" control={<Radio />} label={t('step2.gender_options.man')} />
          <FormControlLabel value="couple" control={<Radio />} label={t('step2.gender_options.couple')} />
          <FormControlLabel value="unspecified" control={<Radio />} label={t('step2.gender_options.undefined')} />
        </RadioGroup>
        {data.gender === 'couple' && (
          <FormGroup sx={{ ml: 3, mt: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={(data.coupleGenderDetails || []).includes('Woman + Woman')} onChange={handleCoupleGenderDetailsChange} value="Woman + Woman" />}
              label={t('step2.couple_details.woman_woman')}
            />
            <FormControlLabel
              control={<Checkbox checked={(data.coupleGenderDetails || []).includes('Man + Woman')} onChange={handleCoupleGenderDetailsChange} value="Man + Woman" />}
              label={t('step2.couple_details.man_woman')}
            />
            <FormControlLabel
              control={<Checkbox checked={(data.coupleGenderDetails || []).includes('Man + Man')} onChange={handleCoupleGenderDetailsChange} value="Man + Man" />}
              label={t('step2.couple_details.man_man')}
            />
          </FormGroup>
        )}
      </FormControl>

      {/* --- My Parameters --- */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d81b60', mt: 4 }}>{t('step2.my_parameters')}</Typography>
      <TextField
        margin="normal" fullWidth label={t('step2.height')} type="number" value={data.height} onChange={(e) => updateData({ height: e.target.value })}
        error={!!errors.height} helperText={errors.height}
        InputProps={{ startAdornment: (<InputAdornment position="start"><HeightIcon sx={{ color: '#ff6384' }} /></InputAdornment>) }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
        disabled={data.preferNotToAnswerParams}
      />
      <TextField
        margin="normal" fullWidth label={t('step2.weight')} type="number" value={data.weight} onChange={(e) => updateData({ weight: e.target.value })}
        error={!!errors.weight} helperText={errors.weight}
        InputProps={{ startAdornment: (<InputAdornment position="start"><ScaleIcon sx={{ color: '#ff6384' }} /></InputAdornment>) }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' }, }}
        disabled={data.preferNotToAnswerParams}
      />
      <FormControlLabel
        control={<Checkbox checked={data.preferNotToAnswerParams} onChange={(e) => updateData({ preferNotToAnswerParams: e.target.checked })} />}
        label={t('step2.prefer_not_to_answer')}
        sx={{ mb: 3 }}
      />

      {/* --- My Age --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step2.my_age')}</FormLabel>
        <RadioGroup row value={data.ageRange} onChange={(e) => updateData({ ageRange: e.target.value })}>
          {['18-25', '25-35', '35-45', '45-55', '55-65', '65+'].map((range) => (
            <FormControlLabel key={range} value={range} control={<Radio size="small" />} label={range} />
          ))}
        </RadioGroup>
        {errors.age_range && <Typography color="error" variant="caption">{errors.age_range}</Typography>}
      </FormControl>
    </Box>
  );
};

export default Step2PersonalDetails;