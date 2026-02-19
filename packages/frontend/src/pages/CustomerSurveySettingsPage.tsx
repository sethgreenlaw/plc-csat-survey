import { useState, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';

interface SurveyUrlConfig {
  recordSubmissionConfirmation: string;
  paymentConfirmation: string;
  inspectionCompleted: string;
  documentIssued: string;
}

interface TransactionalEmailField {
  key: keyof SurveyUrlConfig;
  label: string;
  description: string;
  placeholder: string;
}

const transactionalEmails: TransactionalEmailField[] = [
  {
    key: 'recordSubmissionConfirmation',
    label: 'Record Submission Confirmation',
    description: 'Survey URL sent when a record is submitted',
    placeholder: 'https://survey.example.com/record-submission'
  },
  {
    key: 'paymentConfirmation',
    label: 'Payment Confirmation',
    description: 'Survey URL sent when a payment is processed',
    placeholder: 'https://survey.example.com/payment'
  },
  {
    key: 'inspectionCompleted',
    label: 'Inspection Completed',
    description: 'Survey URL sent when an inspection is completed',
    placeholder: 'https://survey.example.com/inspection'
  },
  {
    key: 'documentIssued',
    label: 'Document Issued',
    description: 'Survey URL sent when a document (permit, license, etc.) is issued',
    placeholder: 'https://survey.example.com/document-issued'
  }
];

/**
 * Customer Satisfaction Survey Settings Page
 *
 * Allows administrators to configure unique survey URLs for each
 * transactional email type. Each email type can have one survey URL
 * that will be embedded in the email.
 */
export const CustomerSurveySettingsPage: FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [surveyUrls, setSurveyUrls] = useState<SurveyUrlConfig>({
    recordSubmissionConfirmation: '',
    paymentConfirmation: '',
    inspectionCompleted: '',
    documentIssued: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SurveyUrlConfig, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (field: keyof SurveyUrlConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSurveyUrls((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof SurveyUrlConfig) => () => {
    const value = surveyUrls[field];
    if (value && !validateUrl(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Please enter a valid URL'
      }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate all URLs
    const newErrors: Partial<Record<keyof SurveyUrlConfig, string>> = {};
    let hasErrors = false;

    for (const email of transactionalEmails) {
      const value = surveyUrls[email.key];
      if (value && !validateUrl(value)) {
        newErrors[email.key] = 'Please enter a valid URL';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    setShowSuccess(true);

    // In a real app, this would call the API to save the settings
    console.log('Saving survey URLs:', surveyUrls);
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const pageActions = [
    <Button key="back" variant="outlined" color="inherit" onClick={handleCancel}>
      Back to Settings
    </Button>
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header actions={pageActions}>
          <PageHeaderComposable.Title>Customer Satisfaction Survey</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Configure survey URLs for transactional emails
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Info Alert */}
          <Alert severity="info" sx={{ maxWidth: 800 }}>
            Enter unique survey URLs for each transactional email type. The URL will be
            embedded in the corresponding email, allowing customers to provide feedback
            about their experience.
          </Alert>

          {/* Form */}
          <Paper
            component="form"
            onSubmit={handleSubmit}
            variant="outlined"
            sx={{ p: 3, borderRadius: 2, maxWidth: 800 }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Survey URL Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a survey URL for each email type where you want to collect customer
                  feedback. Leave blank if you don't want a survey for that email type.
                </Typography>
              </Box>

              <Divider />

              {/* Survey URL Fields */}
              <Stack spacing={3}>
                {transactionalEmails.map((email, index) => (
                  <Box key={email.key}>
                    <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {email.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email.description}
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      type="url"
                      value={surveyUrls[email.key]}
                      onChange={handleChange(email.key)}
                      onBlur={handleBlur(email.key)}
                      placeholder={email.placeholder}
                      error={!!errors[email.key]}
                      helperText={errors[email.key]}
                      inputProps={{
                        'aria-label': `Survey URL for ${email.label}`
                      }}
                    />
                    {index < transactionalEmails.length - 1 && (
                      <Divider sx={{ mt: 3 }} />
                    )}
                  </Box>
                ))}
              </Stack>

              <Divider />

              {/* Form Actions */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                role="group"
                aria-label="Form actions"
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Preview Section */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, maxWidth: 800 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configured survey URLs will appear in emails like this:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.grey[100],
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "We'd love to hear about your experience! Please take a moment to{' '}
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'underline'
                  }}
                >
                  complete our brief survey
                </Box>
                ."
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Survey settings saved successfully
        </Alert>
      </Snackbar>
    </>
  );
};
