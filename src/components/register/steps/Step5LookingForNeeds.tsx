// src/components/register/steps/Step5LookingForNeeds.tsx
'use client';

import React from 'react';
import {
  Box, Typography, TextField, FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Checkbox, FormGroup, MenuItem, Select, InputLabel
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  errors: { [key: string]: string };
}

const Step5LookingForNeeds: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const { t } = useTranslation('common');

  const handleLookingForCoupleDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentDetails = data.lookingForCoupleDetails || [];
    if (checked) {
      updateData({ lookingForCoupleDetails: [...currentDetails, value] });
    } else {
      updateData({ lookingForCoupleDetails: currentDetails.filter((item: string) => item !== value) });
    }
  };

  const handlePsychologicalNeedsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentNeeds = data.psychologicalNeeds || [];
    if (checked) {
      updateData({ psychologicalNeeds: [...currentNeeds, value] });
    } else {
      updateData({
        psychologicalNeeds: currentNeeds.filter((item: string) => item !== value),
        psychologicalNeedsDetails: { ...data.psychologicalNeedsDetails, [value]: undefined },
      });
    }
  };

  const handleWhatToFulfillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentFulfillments = data.whatToFulfill || [];
    if (checked) {
      updateData({ whatToFulfill: [...currentFulfillments, value] });
    } else {
      updateData({ whatToFulfill: currentFulfillments.filter((item: string) => item !== value) });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>{t('step5.title')}</Typography>

      {/* --- Who I'm looking for (Second Algorithm) --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step5.looking_for')}</FormLabel>
        <RadioGroup
          row
          value={data.lookingForGender}
          onChange={(e) => {
            updateData({ lookingForGender: e.target.value });
            if (e.target.value !== t('step5.looking_for_options.couple')) updateData({ lookingForCoupleDetails: [] });
          }}
        >
          {['man', 'woman', 'couple', 'undecided'].map((key) => (
            <FormControlLabel key={key} value={t(`step5.looking_for_options.${key}`)} control={<Radio />} label={t(`step5.looking_for_options.${key}`)} />
          ))}
        </RadioGroup>
        {data.lookingForGender === t('step5.looking_for_options.couple') && (
          <FormGroup sx={{ ml: 3, mt: 1 }}>
            {['woman_woman', 'woman_man', 'man_man'].map((key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox checked={(data.lookingForCoupleDetails || []).includes(t(`step5.looking_for_couple_details.${key}`))} onChange={handleLookingForCoupleDetailsChange} value={t(`step5.looking_for_couple_details.${key}`)} />}
                label={t(`step5.looking_for_couple_details.${key}`)}
              />
            ))}
          </FormGroup>
        )}
      </FormControl>

      {/* --- Person's Parameters --- */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d81b60', mt: 4 }}>{t('step5.persons_parameters')}</Typography>
      <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
        <InputLabel id="looking-for-height-label" sx={{ color: '#ff6384' }}>{t('step5.height')}</InputLabel>
        <Select
          labelId="looking-for-height-label" id="looking-for-height" value={data.lookingForHeight} label={t('step5.height')} onChange={(e) => updateData({ lookingForHeight: e.target.value as string })}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6384' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' }
          }}
        >
          <MenuItem value=""><em>{t('step5.select_height_range')}</em></MenuItem>
          {['140_160', '160_180', '180_plus'].map((key) => (
            <MenuItem key={key} value={t(`step5.height_options.${key}`)}>{t(`step5.height_options.${key}`)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
        <InputLabel id="looking-for-weight-label" sx={{ color: '#ff6384' }}>{t('step5.weight')}</InputLabel>
        <Select
          labelId="looking-for-weight-label" id="looking-for-weight" value={data.lookingForWeight} label={t('step5.weight')} onChange={(e) => updateData({ lookingForWeight: e.target.value as string })}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6384' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d81b60', borderWidth: '2px' }
          }}
        >
          <MenuItem value=""><em>{t('step5.select_weight_range')}</em></MenuItem>
          {['30_50', '50_70', '70_90', '90_120', '120_plus'].map((key) => (
            <MenuItem key={key} value={t(`step5.weight_options.${key}`)}>{t(`step5.weight_options.${key}`)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* --- What I'd like to fulfill --- */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#d81b60', mt: 4 }}>{t('step5.what_to_fulfill')}</Typography>

      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step5.intimacy')}</FormLabel>
        <RadioGroup row value={data.intimacyPreference} onChange={(e) => { updateData({ intimacyPreference: e.target.value }); if (e.target.value !== t('step5.intimacy_options.other')) updateData({ otherIntimacy: '' }); }}>
          {['bdsm', 'classic', 'swinger', 'other'].map((key) => (
            <FormControlLabel key={key} value={t(`step5.intimacy_options.${key}`)} control={<Radio size="small" />} label={t(`step5.intimacy_options.${key}`)} />
          ))}
        </RadioGroup>
        {data.intimacyPreference === t('step5.intimacy_options.other') && (
          <TextField
            margin="normal" fullWidth label={t('step5.specify_other_intimacy')} value={data.otherIntimacy} onChange={(e) => updateData({ otherIntimacy: e.target.value })}
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ff6384' },
                '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
                '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' },
              },
              '& .MuiInputLabel-root': { color: '#ff6384' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
            }}
          />
        )}
      </FormControl>

      <FormControlLabel
        control={<Checkbox checked={(data.whatToFulfill || []).includes(t('step5.open_relationship'))} onChange={handleWhatToFulfillChange} value={t('step5.open_relationship')} />}
        label={t('step5.open_relationship')}
        sx={{ mb: 2 }}
      />

      {/* --- Psychological Need for: (Partial) --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step5.psychological_need_for')}</FormLabel>
        <FormGroup>
          {['father', 'mother', 'sister', 'brother', 'grandmother', 'grandfather', 'aunt', 'uncle'].map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox checked={(data.psychologicalNeeds || []).includes(t(`step5.psychological_roles.${key}`))} onChange={handlePsychologicalNeedsChange} value={t(`step5.psychological_roles.${key}`)} />}
                label={t(`step5.psychological_roles.${key}`)}
              />
              {(data.psychologicalNeeds || []).includes(t(`step5.psychological_roles.${key}`)) && (
                <RadioGroup
                  row
                  value={data.psychologicalNeedsDetails[t(`step5.psychological_roles.${key}`)] || ''}
                  onChange={(e) => updateData({ psychologicalNeedsDetails: { ...data.psychologicalNeedsDetails, [t(`step5.psychological_roles.${key}`)]: e.target.value } })}
                  sx={{ ml: 2 }}
                >
                  <FormControlLabel value={t('step5.need_for_options.for_myself')} control={<Radio size="small" />} label={t('step5.need_for_options.for_myself')} />
                  <FormControlLabel value={t('step5.need_for_options.for_my_child')} control={<Radio size="small" />} label={t('step5.need_for_options.for_my_child')} />
                </RadioGroup>
              )}
            </Box>
          ))}
        </FormGroup>
      </FormControl>

      {/* --- Other Fulfillments (Partial) --- */}
      <FormGroup sx={{ mb: 3 }}>
        {['phone_conversations', 'mentor', 'friend', 'spouse', 'free_companion', 'free_skills_training', 'socialization', 'housing_for_help'].map((key) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControlLabel
              control={<Checkbox checked={(data.whatToFulfill || []).includes(t(`step5.other_fulfillments.${key}`))} onChange={handleWhatToFulfillChange} value={t(`step5.other_fulfillments.${key}`)} />}
              label={t(`step5.other_fulfillments.${key}`)}
            />
            {key === 'mentor' && (data.whatToFulfill || []).includes(t('step5.other_fulfillments.mentor')) && (
              <RadioGroup
                row
                value={data.psychologicalNeedsDetails[t('step5.psychological_roles.mentor')] || ''}
                onChange={(e) => updateData({ psychologicalNeedsDetails: { ...data.psychologicalNeedsDetails, [t('step5.psychological_roles.mentor')]: e.target.value } })}
                sx={{ ml: 2 }}
              >
                <FormControlLabel value={t('step5.need_for_options.for_myself')} control={<Radio size="small" />} label={t('step5.need_for_options.for_myself')} />
                <FormControlLabel value={t('step5.need_for_options.for_my_child')} control={<Radio size="small" />} label={t('step5.need_for_options.for_my_child')} />
              </RadioGroup>
            )}
            {key === 'free_skills_training' && (data.whatToFulfill || []).includes(t('step5.other_fulfillments.free_skills_training')) && (
              <RadioGroup row value={data.skillsTrainingType} onChange={(e) => updateData({ skillsTrainingType: e.target.value })} sx={{ ml: 2 }}>
                <FormControlLabel value={t('step5.skills_training_options.ready_to_teach')} control={<Radio size="small" />} label={t('step5.skills_training_options.ready_to_teach')} />
                <FormControlLabel value={t('step5.skills_training_options.need_to_be_taught')} control={<Radio size="small" />} label={t('step5.skills_training_options.need_to_be_taught')} />
              </RadioGroup>
            )}
          </Box>
        ))}
      </FormGroup>

      {/* --- Privacy Policy and User Agreement Checkbox --- */}
      <FormControlLabel
        control={
          <Checkbox
            checked={data.agreedToTerms || false}
            onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
            name="agreedToTerms"
          />
        }
        label={
          <Typography variant="body2" sx={{ color: '#555' }}>
            {t('step5.terms_and_agreement.text1')}{' '}
            <a href="/privacy" target="_blank" style={{ color: '#d81b60', textDecoration: 'underline' }}>
              {t('step5.terms_and_agreement.privacy_policy')}
            </a>
            {' '}
            {t('step5.terms_and_agreement.and')}{' '}
            <a href="/terms" target="_blank" style={{ color: '#d81b60', textDecoration: 'underline' }}>
              {t('step5.terms_and_agreement.user_agreement')}
            </a>.
          </Typography>
        }
        sx={{ mt: 3 }}
      />
      {errors.agreedToTerms && <Typography color="error" variant="caption">{errors.agreedToTerms}</Typography>}
    </Box>
  );
};

export default Step5LookingForNeeds;