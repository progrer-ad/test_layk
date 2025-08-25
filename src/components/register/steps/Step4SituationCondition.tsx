// src/components/register/steps/Step4SituationCondition.tsx
'use client';

import React from 'react';
import {
  Box, Typography, TextField, FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Checkbox, FormGroup
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface StepProps {
  data: any;
  updateData: (newData: any) => void;
  errors: { [key: string]: string };
}

const Step4SituationCondition: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const { t } = useTranslation('common');

  const handleSituationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentSituation = data.situation || [];
    if (checked) {
      updateData({ situation: [...currentSituation, value] });
    } else {
      updateData({ situation: currentSituation.filter((item: string) => item !== value) });
    }
  };

  const handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentCondition = data.condition || [];
    if (checked) {
      updateData({ condition: [...currentCondition, value] });
    } else {
      updateData({ condition: currentCondition.filter((item: string) => item !== value) });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>{t('step4.title')}</Typography>

      {/* --- My Situation --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step4.my_situation')}</FormLabel>
        <FormGroup>
          {['orphan', 'no_father', 'no_mother', 'dissatisfied_with_parents', 'overweight', 'mentally_ill', 'homeless', 'disabled', 'immigrant', 'non_traditional_family', 'childless', 'have_children', 'other'].map((key) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox checked={(data.situation || []).includes(t(`step4.situation_options.${key}`))} onChange={handleSituationChange} value={t(`step4.situation_options.${key}`)} />}
                label={t(`step4.situation_options.${key}`)}
              />
              {key === 'disabled' && (data.situation || []).includes(t('step4.situation_options.disabled')) && (
                <TextField
                  size="small" label={t('step4.situation_details.specify_disability')} value={data.disabilityDetails} onChange={(e) => updateData({ disabilityDetails: e.target.value })}
                  sx={{ ml: 2, flexGrow: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' } }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' } }}
                />
              )}
              {key === 'immigrant' && (data.situation || []).includes(t('step4.situation_options.immigrant')) && (
                <TextField
                  size="small" label={t('step4.situation_details.country_moved_to')} value={data.immigrantCountry} onChange={(e) => updateData({ immigrantCountry: e.target.value })}
                  sx={{ ml: 2, flexGrow: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' } }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' } }}
                />
              )}
              {key === 'other' && (data.situation || []).includes(t('step4.situation_options.other')) && (
                <TextField
                  size="small" label={t('step4.situation_details.specify_other_situation')} value={data.otherSituation} onChange={(e) => updateData({ otherSituation: e.target.value })}
                  sx={{ ml: 2, flexGrow: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' } }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' } }}
                />
              )}
            </Box>
          ))}
          {/* Nested for "Raised in a non-traditional family" */}
          {(data.situation || []).includes(t('step4.situation_options.non_traditional_family')) && (
            <FormGroup sx={{ ml: 4, mt: 1 }}>
              <FormLabel component="legend" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>{t('step4.situation_details.family_type')}</FormLabel>
              {['woman_woman', 'man_man', 'transgender_couple'].map((typeKey) => (
                <FormControlLabel
                  key={typeKey}
                  control={<Checkbox checked={(data.situation || []).includes(t(`step4.situation_details.family_types.${typeKey}`))} onChange={handleSituationChange} value={t(`step4.situation_details.family_types.${typeKey}`)} />}
                  label={t(`step4.situation_details.family_types.${typeKey}`)}
                />
              ))}
            </FormGroup>
          )}
          {/* Nested for "Childless" */}
          {(data.situation || []).includes(t('step4.situation_options.childless')) && (
            <FormGroup sx={{ ml: 4, mt: 1 }}>
              <FormLabel component="legend" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>{t('step4.situation_details.childless_reason')}</FormLabel>
              {['dont_want_children', 'cant_have_children', 'child_passed_away'].map((reasonKey) => (
                <FormControlLabel
                  key={reasonKey}
                  control={<Checkbox checked={(data.situation || []).includes(t(`step4.situation_details.childless_reasons.${reasonKey}`))} onChange={handleSituationChange} value={t(`step4.situation_details.childless_reasons.${reasonKey}`)} />}
                  label={t(`step4.situation_details.childless_reasons.${reasonKey}`)}
                />
              ))}
            </FormGroup>
          )}
          {/* Nested for "I have children" */}
          {(data.situation || []).includes(t('step4.situation_options.have_children')) && (
            <FormControl component="fieldset" sx={{ ml: 4, mt: 1 }}>
              <FormLabel component="legend" sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>{t('step4.situation_details.children_count')}</FormLabel>
              <RadioGroup row value={data.childrenCount} onChange={(e) => updateData({ childrenCount: e.target.value })}>
                {['one', 'two', 'three', 'three_plus'].map((countKey) => (
                  <FormControlLabel key={countKey} value={t(`step4.situation_details.children_count_options.${countKey}`)} control={<Radio size="small" />} label={t(`step4.situation_details.children_count_options.${countKey}`)} />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </FormGroup>
      </FormControl>

      {/* --- Marital Status --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step4.marital_status')}</FormLabel>
        <RadioGroup row value={data.maritalStatus} onChange={(e) => { updateData({ maritalStatus: e.target.value }); if (e.target.value !== t('step4.marital_status_options.married')) updateData({ spouseLanguage: '' }); }}>
          {['married', 'divorced', 'living_separately', 'widow_widower', 'civil_partnership'].map((statusKey) => (
            <FormControlLabel key={statusKey} value={t(`step4.marital_status_options.${statusKey}`)} control={<Radio size="small" />} label={t(`step4.marital_status_options.${statusKey}`)} />
          ))}
        </RadioGroup>
        {data.maritalStatus === t('step4.marital_status_options.married') && (
          <TextField
            margin="normal" fullWidth label={t('step4.spouse_language')} value={data.spouseLanguage} onChange={(e) => updateData({ spouseLanguage: e.target.value })}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' } }, '& .MuiInputLabel-root': { color: '#ff6384' }, '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' } }}
          />
        )}
        <FormControlLabel
          control={<Checkbox checked={(data.situation || []).includes(t('step4.situation_options.from_good_family'))} onChange={handleSituationChange} value={t('step4.situation_options.from_good_family')} />}
          label={t('step4.situation_options.from_good_family')}
        />
      </FormControl>

      {/* --- My Condition --- */}
      <FormControl component="fieldset" margin="normal" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ color: '#d81b60', fontWeight: 'bold' }}>{t('step4.my_condition')}</FormLabel>
        <FormGroup>
          {['feel_nothing', 'depression', 'no_motivation', 'afraid_of_people', 'illegal_substances', 'smoker', 'alcoholic', 'not_interested_in_intimacy', 'narcissist', 'autism', 'loneliness', 'happy', 'wealthy', 'everything_but_not_happy', 'dont_understand_what_i_want', 'eat_healthy', 'eat_poorly', 'overeat', 'elevated_mood', 'life_is_successful', 'no_financial_problems', 'insufficient_income'].map((key) => (
            <FormControlLabel
              key={key}
              control={<Checkbox checked={(data.condition || []).includes(t(`step4.condition_options.${key}`))} onChange={handleConditionChange} value={t(`step4.condition_options.${key}`)} />}
              label={t(`step4.condition_options.${key}`)}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default Step4SituationCondition;