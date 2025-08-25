'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import api from '@/util/api';
import axios from 'axios';

// Import bosqich komponentlari
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2PersonalDetails from './steps/Step2PersonalDetails';
import Step3InterestsLocation from './steps/Step3InterestsLocation';
import Step4SituationCondition from './steps/Step4SituationCondition';
import Step5LookingForNeeds from './steps/Step5LookingForNeeds';
import { useTranslation } from 'react-i18next';


// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: '25px',
  background: 'linear-gradient(145deg, #ffffff, #fef5f8)',
  boxShadow: '0 20px 50px rgba(255, 100, 150, 0.25)',
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    boxShadow: '0 30px 70px rgba(255, 100, 150, 0.4)',
    transform: 'translateY(-5px)',
  },
  maxWidth: '800px',
  width: '100%',
  position: 'relative',
  zIndex: 2,
}));

const RegisterForm = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    // Initial holatlar (bo'sh qolishi mumkin yoki defolt qiymatlar)
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    gender: '', // 'Woman', 'Man', 'Couple', 'Undefined'
    coupleGenderDetails: [], // ['Woman + Woman', 'Man + Woman', 'Man + Man']
    height: '', // Number or ''
    weight: '', // Number or ''
    preferNotToAnswerParams: false, // Boolean
    ageRange: '',
    interests: [], // Array of strings
    otherInterests: '',
    country: '',
    languages: [], // Array of strings
    situation: [], // Array of strings
    otherSituation: '',
    disabilityDetails: '',
    immigrantCountry: '',
    maritalStatus: '',
    spouseLanguage: '',
    childrenCount: '', // String, will be converted to number or null
    condition: [], // Array of strings
    lookingForGender: '', // 'Man', 'Woman', 'Couple', 'Undecided'
    lookingForCoupleDetails: [], // ['Woman + Woman', 'Man + Woman', 'Man + Man']
    lookingForHeight: '', // Number or ''
    lookingForWeight: '', // Number or ''
    intimacyPreference: '', // 'BDSM', 'Classic', 'Swinger', 'Other'
    otherIntimacy: '',
    psychologicalNeeds: [], // Array of strings
    psychologicalNeedsDetails: {}, // Object for nested details
    whatToFulfill: [], // Array of strings
    skillsTrainingType: '',
    agreedToTerms: false, // YANGILANISH: Shartlarga rozilik holati
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const updateFormData = (newData: any) => {
    setFormData((prev: any) => ({ ...prev, ...newData }));
  };

  const handleNext = async () => {
    const currentStepErrors: { [key: string]: string } = {};
    let hasError = false;

    if (currentStep === 0) {
      if (!formData.name) { currentStepErrors.name = t('registerForm.fullNameRequired'); hasError = true; }
      if (!formData.email) { currentStepErrors.email = t('registerForm.emailRequired'); hasError = true; }
      if (!formData.password) { currentStepErrors.password = t('registerForm.passwordRequired'); hasError = true; }
      if (!formData.passwordConfirmation) { currentStepErrors.passwordConfirmation = t('registerForm.passwordConfirmationRequired'); hasError = true; }

      if (formData.password !== formData.passwordConfirmation) {
        currentStepErrors.passwordConfirmation = t('registerForm.passwordsDoNotMatch');
        hasError = true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
          currentStepErrors.email = t('registerForm.validEmail');
          hasError = true;
      }
      if (formData.password && formData.password.length < 8) {
          currentStepErrors.password = t('registerForm.passwordLength');
          hasError = true;
      }
    }
    if (currentStep === 1) {
        if (!formData.gender) { currentStepErrors.gender = t('registerForm.genderRequired'); hasError = true; }
        if (formData.gender === 'Couple' && (!formData.coupleGenderDetails || formData.coupleGenderDetails.length === 0)) {
            currentStepErrors.coupleGenderDetails = t('registerForm.coupleTypeRequired'); hasError = true;
        }
        if (!formData.preferNotToAnswerParams) {
            if (!formData.height) { currentStepErrors.height = t('registerForm.heightRequired'); hasError = true; }
            if (!formData.weight) { currentStepErrors.weight = t('registerForm.weightRequired'); hasError = true; }

            if (formData.height !== '' && isNaN(Number(formData.height))) {
                currentStepErrors.height = t('registerForm.heightNumber'); hasError = true;
            } else if (formData.height !== '' && (Number(formData.height) < 100 || Number(formData.height) > 250)) {
                currentStepErrors.height = t('registerForm.heightRange'); hasError = true;
            }

            if (formData.weight !== '' && isNaN(Number(formData.weight))) {
                currentStepErrors.weight = t('registerForm.weightNumber'); hasError = true;
            } else if (formData.weight !== '' && (Number(formData.weight) < 20 || Number(formData.weight) > 300)) {
                currentStepErrors.weight = t('registerForm.weightRange'); hasError = true;
            }
        }
        if (!formData.ageRange) { currentStepErrors.ageRange = t('registerForm.ageRangeRequired'); hasError = true; }
    }

    setErrors(currentStepErrors);

    if (hasError) {
      setSnackbarMessage(t('registerForm.completeRequiredFields'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSnackbarOpen(false);
    setErrors({});

    const finalErrors: { [key: string]: string } = {};
    let hasFinalError = false;

    if (!formData.lookingForGender) { finalErrors.lookingForGender = t('registerForm.lookingForGenderRequired'); hasFinalError = true; }
    if (!formData.agreedToTerms) { finalErrors.agreedToTerms = t('registerForm.termsRequired'); hasFinalError = true; }


    setErrors(finalErrors);
    if (hasFinalError) {
        setSnackbarMessage(t('registerForm.completeRequiredFields'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
    }

    try {
      const csrfAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8000",
        withCredentials: true,
      });
      await csrfAxios.get('/sanctum/csrf-cookie');

      let coupleTypeToSend = null;
      if (formData.gender === 'Couple' && formData.coupleGenderDetails && formData.coupleGenderDetails.length > 0) {
        if (formData.coupleGenderDetails.includes('Woman + Woman')) {
          coupleTypeToSend = 'ff';
        } else if (formData.coupleGenderDetails.includes('Man + Woman')) {
          coupleTypeToSend = 'mf';
        } else if (formData.coupleGenderDetails.includes('Man + Man')) {
          coupleTypeToSend = 'mm';
        }
      }

      let lookingForCoupleTypeToSend = null;
      if (formData.lookingForGender === 'Couple' && formData.lookingForCoupleDetails && formData.lookingForCoupleDetails.length > 0) {
        if (formData.lookingForCoupleDetails.includes('Woman + Woman')) {
          lookingForCoupleTypeToSend = 'ff';
        } else if (formData.lookingForCoupleDetails.includes('Man + Woman')) {
          lookingForCoupleTypeToSend = 'mf';
        } else if (formData.lookingForCoupleDetails.includes('Man + Man')) {
          lookingForCoupleTypeToSend = 'mm';
        }
      }

      const transformedInterests = formData.interests.map((interestName: string) => {
        if (interestName === 'Other' && formData.otherInterests) {
          return { name: 'Other', other_text: formData.otherInterests };
        }
        return { name: interestName };
      });

      const transformedSituationDetails = formData.situation.map((item: string) => {
        if (item === 'Other' && formData.otherSituation) {
          return { type: item, details: formData.otherSituation };
        } else if (item === 'Disabled' && formData.disabilityDetails) {
          return { type: item, details: formData.disabilityDetails };
        } else if (item === 'Immigrant' && formData.immigrantCountry) {
          return { type: item, details: formData.immigrantCountry };
        }
        return { type: item };
      });

      const transformedPsychologicalNeeds = formData.psychologicalNeeds.map((need: string) => ({
        type: need,
        details: formData.psychologicalNeedsDetails[need] || null
      }));

      const transformedWhatToFulfill = formData.whatToFulfill.map((item: string) => {
        if (item === 'Free skills training' && formData.skillsTrainingType) {
          return { type: item, skills_training_type: formData.skillsTrainingType };
        }
        return { type: item };
      });

      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
        gender: formData.gender.toLowerCase(),
        couple_type: coupleTypeToSend,
        height: formData.preferNotToAnswerParams ? null : (formData.height === '' ? null : Number(formData.height)),
        weight: formData.preferNotToAnswerParams ? null : (formData.weight === '' ? null : Number(formData.weight)),
        hide_parameters: formData.preferNotToAnswerParams,
        age_range: formData.ageRange,
        interests: transformedInterests,
        country: formData.country,
        language: formData.languages.join(','),
        marital_status: formData.maritalStatus,
        spouse_language: formData.maritalStatus === 'Married' && formData.spouseLanguage ? formData.spouseLanguage : null,
        children_count: formData.childrenCount === '' ? null : Number(formData.childrenCount),
        condition: formData.condition,
        situation_details: transformedSituationDetails,
        disability_type: formData.situation.includes('Disabled') ? formData.disabilityDetails : null,
        immigrant_country: formData.situation.includes('Immigrant') ? formData.immigrantCountry : null,
        looking_for_gender: formData.lookingForGender.toLowerCase(),
        looking_for_couple_details: lookingForCoupleTypeToSend,
        looking_for_height: formData.lookingForHeight === '' ? null : Number(formData.lookingForHeight),
        looking_for_weight: formData.lookingForWeight === '' ? null : Number(formData.lookingForWeight),
        intimacy_preference: formData.intimacyPreference === 'Other' ? formData.otherIntimacy : formData.intimacyPreference,
        other_intimacy: formData.intimacyPreference === 'Other' ? formData.otherIntimacy : null,
        psychological_needs: transformedPsychologicalNeeds,
        psychological_needs_details: formData.psychologicalNeedsDetails,
        what_to_fulfill: transformedWhatToFulfill,
        skills_training_type: formData.whatToFulfill.includes('Free skills training') ? formData.skillsTrainingType : null,
      };


      const response = await api.post('/register', dataToSend);

      setSnackbarMessage(t('registerForm.registrationSuccessMessage'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      router.push('/verify-email');

    } catch (error: any) {
      let errorMessage = t('registerForm.registrationFailureMessage');
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        const firstErrorKey = Object.keys(error.response.data.errors)[0];
        errorMessage = error.response.data.errors[firstErrorKey][0];
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = t('registerForm.networkErrorMessage');
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1BasicInfo data={formData} updateData={updateFormData} errors={errors} />;
      case 1:
        return <Step2PersonalDetails data={formData} updateData={updateFormData} errors={errors} />;
      case 2:
        return <Step3InterestsLocation data={formData} updateData={updateFormData} errors={errors} />;
      case 3:
        return <Step4SituationCondition data={formData} updateData={updateFormData} errors={errors} />;
      case 4:
        return <Step5LookingForNeeds data={formData} updateData={updateFormData} errors={errors} />;
      default:
        return null;
    }
  };

  const stepsLabels = [
    'Basic Info',
    'Personal Details',
    'Interests & Location',
    'Situation & Condition',
    'Looking For & Needs'
  ];

  const isLastStep = currentStep === stepsLabels.length - 1;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #ffe0f0 0%, #d8eaff 100%)',
        backgroundSize: '200% 200%',
        animation: `${slideBg} 20s ease infinite`,
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        px: 2,
      }}
    >
      <StyledPaper>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, color: '#d81b60', textAlign: 'center' }}>
          {t('registerForm.title')} - {t('registerForm.title_sh')} {currentStep + 1} {t('registerForm.title_i')} {stepsLabels.length}
        </Typography>

        {renderStep()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {currentStep > 0 && (
            <Button
              variant="outlined"
              onClick={handlePrev}
              sx={{
                py: 1.5, borderRadius: '10px', borderColor: '#d81b60', color: '#d81b60',
                '&:hover': { borderColor: '#ff4d6d', color: '#ff4d6d', bgcolor: 'rgba(255, 99, 132, 0.05)', },
              }}
            >
              {t('registerForm.previousButton')}
            </Button>
          )}

          {!isLastStep && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                ml: 'auto', py: 1.5, borderRadius: '10px',
                background: 'linear-gradient(45deg, #ff6384 30%, #ff9a8d 90%)', boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': { background: 'linear-gradient(45deg, #ff4d6d 30%, #ff8fa3 90%)', boxShadow: '0 3px 8px 3px rgba(255, 105, 135, .5)', },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('registerForm.nextButton')}
            </Button>
          )}

          {isLastStep && (
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              // MUHIM TUZATISH: Ro'yxatdan o'tish tugmasi endi shartnomaga rozi bo'lish holatiga bog'langan
              disabled={loading || !formData.agreedToTerms}
              sx={{
                ml: 'auto', py: 1.5, borderRadius: '10px',
                background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)', boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                '&:hover': { background: 'linear-gradient(45deg, #45a049 30%, #7CB342 90%)', boxShadow: '0 3px 8px 3px rgba(76, 175, 80, .5)', },
                '&.Mui-disabled': {
                    background: '#e0e0e0', // O'chirilgan holat uchun fon rangi
                    color: '#a0a0a0', // O'chirilgan holat uchun matn rangi
                    boxShadow: 'none'
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('registerForm.registerButton')}
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          {t('registerForm.alreadyHaveAccount')} {' '}
          <Link href="/login" variant="body2" sx={{ color: '#d81b60', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
            {t('registerForm.logIn')}
          </Link>
        </Typography>
      </StyledPaper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterForm;
