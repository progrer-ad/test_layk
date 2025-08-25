// app/terms/page.tsx
'use client';

import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  GavelOutlined as GavelIcon,
  EmojiEventsOutlined as LicenseIcon,
  AccountCircleOutlined as AccountIcon,
  MonetizationOnOutlined as MoneyIcon,
  ReportOutlined as ReportIcon,
  PeopleOutlineOutlined as PeopleIcon,
  LockOutlined as LockIcon,
  PublicOutlined as PublicIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6),
  },
  borderRadius: '20px',
  background: 'linear-gradient(145deg, #ffffff, #fef5f8)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  maxWidth: '900px',
  width: '100%',
  margin: 'auto',
  boxSizing: 'border-box',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingLeft: 0,
  paddingRight: 0,
}));

// Icons for each section
const sectionIcons = {
  eligibility: <LicenseIcon color="primary" />,
  account: <AccountIcon color="primary" />,
  paid_features: <MoneyIcon color="primary" />,
  content_behavior: <ReportIcon color="primary" />,
  no_verification: <PeopleIcon color="primary" />,
  termination: <GavelIcon color="primary" />,
  limitation: <InfoIcon color="primary" />,
  privacy: <LockIcon color="primary" />,
  jurisdiction: <PublicIcon color="primary" />,
};

const TermsPage = () => {
  const { t } = useTranslation('common'); // 'common' namespace is correct based on your JSON file

  // Use the structure directly from the JSON.
  const sections = t('terms.sections', { returnObjects: true });

  if (!Array.isArray(sections)) {
    // This is a safety check in case the translation key doesn't return an array.
    console.error("Translation for 'terms.sections' is not an array.");
    return null; // Or render a loading/error state
  }

  return (
    <Box sx={{
      background: 'linear-gradient(45deg, #ffe0f0 0%, #d8eaff 100%)',
      minHeight: '100vh',
      py: 6,
      px: { xs: 2, sm: 4, md: 6 },
    }}>
      <StyledPaper>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#d81b60' }}>
            {t('terms.title')}
          </Typography>
          <Typography variant="h5" component="h2" sx={{ color: '#d81b60', mb: 2 }}>
            {t('terms.for_alike')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('terms.effective_date')}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 4, mb: 3, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: t('terms.intro_paragraph_1', {
          interpolation: { escapeValue: false }
        })}} />

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
          {t('terms.intro_paragraph_2')}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <List>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {/* You'll need to map the title to an icon key */}
                  {index === 0 && sectionIcons.eligibility}
                  {index === 1 && sectionIcons.account}
                  {index === 2 && sectionIcons.paid_features}
                  {index === 3 && sectionIcons.content_behavior}
                  {index === 4 && sectionIcons.no_verification}
                  {index === 5 && sectionIcons.termination}
                  {index === 6 && sectionIcons.limitation}
                  {index === 7 && sectionIcons.privacy}
                  {index === 8 && sectionIcons.jurisdiction}
                </ListItemIcon>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {section.title}
                </Typography>
              </Box>
              <List disablePadding sx={{ pl: 5 }}>
                {Array.isArray(section.points) && section.points.map((point, pointIndex) => (
                  <StyledListItem key={pointIndex}>
                    <ListItemText primary={point} sx={{ m: 0 }} />
                  </StyledListItem>
                ))}
              </List>
            </Box>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('terms.contact_us')} {' '}
            <Link href="mailto:support@alike.app" sx={{ color: '#d81b60', fontWeight: 'bold' }}>
              support@alike.app
            </Link>
          </Typography>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default TermsPage;