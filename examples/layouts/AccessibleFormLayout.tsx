import { useState, useRef, useEffect, type FC, type FormEvent } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
  AlertTitle,
  SvgIcon,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { CheckCircle } from '@opengov/react-capital-assets';

/**
 * Pattern 15: Accessible Form Layout
 *
 * UX Principle: One Platform, Unified Experience
 * "Accessibility for All: Inclusive design ensures every user, regardless of
 * ability or environment, can participate fully and effectively."
 *
 * When to use:
 * - Any form that needs to be accessible
 * - Government forms (legally required to be accessible)
 * - Forms used by diverse user populations
 *
 * Key accessibility patterns:
 * - Proper ARIA labels and descriptions
 * - Keyboard navigation and focus management
 * - Screen reader announcements for errors
 * - Skip links for long forms
 * - Clear focus indicators
 * - Error messages linked to fields
 * - Required field indicators
 * - Form validation announcements
 *
 * WCAG 2.1 AA compliance considerations:
 * - 1.3.1 Info and Relationships (labels, fieldsets)
 * - 1.3.5 Identify Input Purpose (autocomplete)
 * - 2.1.1 Keyboard (all interactive elements)
 * - 2.4.3 Focus Order (logical tab order)
 * - 2.4.6 Headings and Labels (descriptive)
 * - 3.3.1 Error Identification (clear error messages)
 * - 3.3.2 Labels or Instructions (helpful guidance)
 * - 4.1.2 Name, Role, Value (ARIA)
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactPreference: string;
  agreeToTerms: boolean;
  notificationPreferences: string[];
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contactPreference?: string;
  agreeToTerms?: string;
}

export const AccessibleFormLayout: FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactPreference: '',
    agreeToTerms: false,
    notificationPreferences: []
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState('');

  // Refs for focus management
  const firstErrorRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Announce messages to screen readers
  const announce = (message: string) => {
    setAnnounceMessage(message);
    // Clear after announcement
    setTimeout(() => setAnnounceMessage(''), 1000);
  };

  // Handle form field changes
  const handleChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.checked }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@agency.gov)';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.contactPreference) {
      newErrors.contactPreference = 'Please select a contact preference';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms to continue';
    }

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      // Announce errors to screen readers
      announce(`Form has ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}. Please review and correct.`);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      setSubmitted(true);
      announce('Form submitted successfully!');
    }
  };

  // Focus first error field when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  if (submitted) {
    return (
      <>
        <PageHeaderComposable>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>Accessible Form Layout</PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>

        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Alert
          severity="success"
          icon={<SvgIcon component={CheckCircle} inheritViewBox />}
          role="status"
          aria-live="polite"
        >
          <AlertTitle>Form submitted successfully!</AlertTitle>
          Thank you for your submission. We'll be in touch soon.
        </Alert>

            <Button variant="outlined" onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', contactPreference: '', agreeToTerms: false, notificationPreferences: [] }); }}>
              Submit another response
            </Button>
          </Stack>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Screen reader announcements */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {announceMessage}
      </Box>

      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Accessible Form Layout</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 15: WCAG 2.1 AA compliant form with keyboard navigation and screen reader support
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Skip Link - allows keyboard users to skip to form */}
      <Box
        component="a"
        href="#contact-form"
        sx={{
          position: 'absolute',
          left: -9999,
          '&:focus': {
            position: 'static',
            left: 'auto',
            display: 'block',
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textDecoration: 'none',
            borderRadius: 1
          }
        }}
      >
        Skip to form
      </Box>

      {/* Error Summary (appears at top when there are errors) */}
      {Object.keys(errors).length > 0 && (
        <Alert
          severity="error"
          role="alert"
          aria-labelledby="error-summary-title"
        >
          <AlertTitle id="error-summary-title">
            Please correct the following errors
          </AlertTitle>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <Box
                  component="a"
                  href={`#${field}`}
                  sx={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    '&:hover': { textDecoration: 'none' }
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(field)?.focus();
                  }}
                >
                  {message}
                </Box>
              </li>
            ))}
          </Box>
        </Alert>
      )}

      {/* Main Form */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box
          component="form"
          ref={formRef}
          id="contact-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact information form"
        >
          <Stack spacing={3}>
            {/* Form Introduction */}
            <Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
                Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fields marked with <Box component="span" sx={{ color: 'error.main' }}>*</Box> are required.
              </Typography>
            </Box>

            {/* Name Fields - Grouped in fieldset */}
            <Box
              component="fieldset"
              sx={{ border: 'none', m: 0, p: 0 }}
            >
              <Typography
                component="legend"
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Your Name
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                  fullWidth
                  autoComplete="given-name"
                  {...(errors.firstName ? { inputRef: firstErrorRef } : {})}
                  inputProps={{
                    'aria-required': true,
                    'aria-invalid': !!errors.firstName,
                    'aria-describedby': errors.firstName ? 'firstName-error' : undefined
                  }}
                  FormHelperTextProps={{
                    id: 'firstName-error',
                    role: errors.firstName ? 'alert' : undefined
                  }}
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                  fullWidth
                  autoComplete="family-name"
                  {...(errors.lastName && !errors.firstName ? { inputRef: firstErrorRef } : {})}
                  inputProps={{
                    'aria-required': true,
                    'aria-invalid': !!errors.lastName,
                    'aria-describedby': errors.lastName ? 'lastName-error' : undefined
                  }}
                  FormHelperTextProps={{
                    id: 'lastName-error',
                    role: errors.lastName ? 'alert' : undefined
                  }}
                />
              </Stack>
            </Box>

            {/* Contact Fields - Grouped in fieldset */}
            <Box
              component="fieldset"
              sx={{ border: 'none', m: 0, p: 0 }}
            >
              <Typography
                component="legend"
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Contact Details
              </Typography>
              <Stack spacing={2}>
                <TextField
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email || 'We\'ll use this to send you updates'}
                  required
                  fullWidth
                  autoComplete="email"
                  inputProps={{
                    'aria-required': true,
                    'aria-invalid': !!errors.email,
                    'aria-describedby': 'email-helper'
                  }}
                  FormHelperTextProps={{
                    id: 'email-helper'
                  }}
                />
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone || 'Optional - 10 digits (e.g., 555-123-4567)'}
                  fullWidth
                  autoComplete="tel"
                  inputProps={{
                    'aria-invalid': !!errors.phone,
                    'aria-describedby': 'phone-helper'
                  }}
                  FormHelperTextProps={{
                    id: 'phone-helper'
                  }}
                />
              </Stack>
            </Box>

            {/* Radio Group with proper labeling */}
            <FormControl
              component="fieldset"
              error={!!errors.contactPreference}
              required
            >
              <FormLabel
                component="legend"
                id="contact-preference-label"
                sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
              >
                Preferred Contact Method
              </FormLabel>
              <RadioGroup
                aria-labelledby="contact-preference-label"
                aria-required="true"
                name="contactPreference"
                value={formData.contactPreference}
                onChange={handleChange('contactPreference')}
              >
                <FormControlLabel
                  value="email"
                  control={<Radio />}
                  label="Email"
                />
                <FormControlLabel
                  value="phone"
                  control={<Radio />}
                  label="Phone"
                />
                <FormControlLabel
                  value="mail"
                  control={<Radio />}
                  label="Postal Mail"
                />
              </RadioGroup>
              {errors.contactPreference && (
                <FormHelperText role="alert">
                  {errors.contactPreference}
                </FormHelperText>
              )}
            </FormControl>

            {/* Terms Checkbox */}
            <FormControl error={!!errors.agreeToTerms} required>
              <FormControlLabel
                control={
                  <Checkbox
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange('agreeToTerms')}
                    inputProps={{
                      'aria-required': true,
                      'aria-invalid': !!errors.agreeToTerms,
                      'aria-describedby': errors.agreeToTerms ? 'terms-error' : undefined
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Box
                      component="a"
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main' }}
                    >
                      terms of service
                    </Box>
                    {' '}
                    <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                  </Typography>
                }
              />
              {errors.agreeToTerms && (
                <FormHelperText id="terms-error" role="alert">
                  {errors.agreeToTerms}
                </FormHelperText>
              )}
            </FormControl>

            {/* Submit Button */}
            <Box sx={{ pt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
              >
                Submit Form
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Accessibility Documentation */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Accessibility Features Implemented
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="primary">ARIA Labels & Descriptions</Typography>
            <Typography variant="body2" color="text.secondary">
              All form fields have aria-label, aria-describedby, and aria-invalid attributes
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Keyboard Navigation</Typography>
            <Typography variant="body2" color="text.secondary">
              Logical tab order, skip links, and focus management on error
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Screen Reader Announcements</Typography>
            <Typography variant="body2" color="text.secondary">
              Live regions announce form submission status and error counts
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Error Handling</Typography>
            <Typography variant="body2" color="text.secondary">
              Error summary at top, inline errors linked to fields, focus moves to first error
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Autocomplete</Typography>
            <Typography variant="body2" color="text.secondary">
              Fields use autocomplete attributes (given-name, family-name, email, tel)
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Code Example */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
          Code Pattern - Key Accessibility Attributes
        </Typography>
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: theme.palette.grey[900],
            color: theme.palette.grey[100],
            borderRadius: 1,
            overflow: 'auto',
            fontSize: theme.typography.caption.fontSize,
            fontFamily: 'monospace'
          }}
        >
{`{/* Screen Reader Announcements */}
<Box
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="visually-hidden"
>
  {announceMessage}
</Box>

{/* Error Summary */}
<Alert severity="error" role="alert" aria-labelledby="error-summary">
  <AlertTitle id="error-summary">Please correct errors</AlertTitle>
  {/* Clickable error links */}
</Alert>

{/* Accessible Text Field */}
<TextField
  id="email"
  name="email"
  label="Email Address"
  required
  autoComplete="email"
  inputProps={{
    'aria-required': true,
    'aria-invalid': !!errors.email,
    'aria-describedby': 'email-helper'
  }}
  FormHelperTextProps={{
    id: 'email-helper',
    role: errors.email ? 'alert' : undefined
  }}
/>

{/* Accessible Radio Group */}
<FormControl component="fieldset" required>
  <FormLabel component="legend" id="preference-label">
    Contact Preference
  </FormLabel>
  <RadioGroup
    aria-labelledby="preference-label"
    aria-required="true"
  >
    <FormControlLabel value="email" control={<Radio />} label="Email" />
  </RadioGroup>
</FormControl>`}
        </Box>
          </Paper>
        </Stack>
      </Box>
    </>
  );
};
