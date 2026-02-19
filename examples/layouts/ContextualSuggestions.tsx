import { useState, type FC, type ReactNode } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Chip,
  Alert,
  AlertTitle,
  Tooltip,
  Fade,
  SvgIcon,
  useTheme,
  alpha
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  Information,
  Close,
  ChevronRight,
  Star,
  TrendingUp
} from '@opengov/react-capital-assets';

/**
 * Pattern 14: Contextual Suggestions
 *
 * UX Principles: AI at the Core + Transparency by Design
 * "Surface role-based insights, predictions, and next steps"
 * "Design to make information clear, contextual, and trustworthy"
 *
 * When to use:
 * - Inline hints within forms or workflows
 * - Field-level AI suggestions
 * - Predictive assistance based on user behavior
 * - Smart defaults with explanations
 * - Proactive warnings or recommendations
 *
 * Structure:
 * - Inline suggestion cards (dismissible)
 * - Field-level hint tooltips
 * - Prediction banners with confidence levels
 * - Smart default explanations
 *
 * Key patterns:
 * - Context-aware (suggestions change based on current data)
 * - Explainable (always show WHY)
 * - Non-intrusive (can be dismissed)
 * - Role-aware (different suggestions for different personas)
 */

// Types for different suggestion variants
interface Prediction {
  id: string;
  title: string;
  prediction: string;
  confidence: 'high' | 'medium' | 'low';
  basedOn: string; // Transparency: what data this is based on
  action?: () => void;
  actionLabel?: string;
}

interface ProactiveWarning {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  suggestion?: string;
  action?: () => void;
  actionLabel?: string;
}

export const ContextualSuggestions: FC = () => {
  const theme = useTheme();

  // Demo data
  const demoPrediction: Prediction = {
    id: '1',
    title: 'Estimated Approval Time',
    prediction: '3-5 business days',
    confidence: 'high',
    basedOn: 'Similar permit applications in your jurisdiction over the past 6 months',
    actionLabel: 'View similar permits'
  };

  const demoWarning: ProactiveWarning = {
    id: '1',
    type: 'warning',
    title: 'Missing documentation detected',
    message: 'This permit type typically requires a site plan. We noticed one hasn\'t been uploaded yet.',
    suggestion: 'Upload a site plan to avoid processing delays',
    actionLabel: 'Upload now'
  };

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Contextual Suggestions</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 14: Inline AI hints, predictions, and proactive assistance
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Example: Inline Suggestion Card */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Inline Suggestion Card
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 500 }}>
          <InlineSuggestionCard
            icon={<SvgIcon component={Information} inheritViewBox />}
            title="Pro tip"
            message="Applications submitted before 2pm are typically processed same-day."
            reason="Based on your department's processing patterns"
            onDismiss={() => {}}
          />

          <InlineSuggestionCard
            icon={<SvgIcon component={Star} inheritViewBox />}
            title="AI Suggestion"
            message="Consider bundling this permit with the electrical permit for faster processing."
            reason="70% of similar projects include both permits"
            actionLabel="Add electrical permit"
            onAction={() => {}}
            onDismiss={() => {}}
            variant="primary"
          />
        </Stack>
      </Paper>

      {/* Example: Prediction Banner */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Prediction Banner
        </Typography>

        <Box sx={{ maxWidth: 500 }}>
          <PredictionBanner prediction={demoPrediction} />
        </Box>
      </Paper>

      {/* Example: Smart Default Suggestion */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Smart Default Suggestion
        </Typography>

        <Box sx={{ maxWidth: 500 }}>
          <SmartDefaultSuggestion
            field="Permit Fee"
            suggestedValue="$250.00"
            reason="Standard fee for residential building permits under 500 sq ft in your jurisdiction"
            onAccept={() => {}}
            onDismiss={() => {}}
          />
        </Box>
      </Paper>

      {/* Example: Proactive Warning */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Proactive Warning
        </Typography>

        <Box sx={{ maxWidth: 500 }}>
          <ProactiveWarningCard warning={demoWarning} onDismiss={() => {}} />
        </Box>
      </Paper>

      {/* Example: Field-Level Hint */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Field-Level Hint Tooltip
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Parcel Number</Typography>
          <FieldHintTooltip
            hint="Enter the 10-digit parcel number from the property tax statement"
            example="Example: 123-456-7890"
          />
        </Stack>
      </Paper>

      {/* Code Example */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
          Code Pattern
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
{`{/* Inline AI Suggestion */}
<InlineSuggestionCard
  icon={<SvgIcon component={Sparkle} />}
  title="AI Suggestion"
  message="Consider bundling this permit with the electrical permit"
  reason="70% of similar projects include both" // Transparency!
  actionLabel="Add permit"
  onAction={() => handleAddPermit()}
  onDismiss={() => setDismissed(true)}
  variant="primary"
/>

{/* Prediction with Confidence */}
<PredictionBanner
  prediction={{
    title: 'Estimated Approval Time',
    prediction: '3-5 business days',
    confidence: 'high',
    basedOn: 'Similar permits in your jurisdiction' // Transparency!
  }}
/>

{/* Smart Default */}
<SmartDefaultSuggestion
  field="Permit Fee"
  suggestedValue="$250.00"
  reason="Standard fee for this permit type" // Transparency!
  onAccept={() => setFee('$250.00')}
  onDismiss={() => {}}
/>`}
        </Box>
      </Paper>

      {/* UX Principles */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          UX Principles Applied
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="primary">AI at the Core</Typography>
            <Typography variant="body2" color="text.secondary">
              Context-aware suggestions that adapt to user's current workflow and data
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Transparency by Design</Typography>
            <Typography variant="body2" color="text.secondary">
              Every suggestion shows "basedOn" or "reason" explaining the recommendation
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Purposeful and Human-Centric</Typography>
            <Typography variant="body2" color="text.secondary">
              Non-intrusive, dismissible suggestions that help without blocking workflow
            </Typography>
          </Box>
        </Stack>
      </Paper>
        </Stack>
      </Box>
    </>
  );
};

/**
 * Inline Suggestion Card
 * Dismissible card with AI suggestion and optional action
 */
interface InlineSuggestionCardProps {
  icon: ReactNode;
  title: string;
  message: string;
  reason?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  variant?: 'default' | 'primary';
}

export const InlineSuggestionCard: FC<InlineSuggestionCardProps> = ({
  icon,
  title,
  message,
  reason,
  actionLabel,
  onAction,
  onDismiss,
  variant = 'default'
}) => {
  const theme = useTheme();
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  if (dismissed) return null;

  const bgColor = variant === 'primary'
    ? alpha(theme.palette.primary.main, 0.08)
    : theme.palette.action.hover;

  const borderColor = variant === 'primary'
    ? alpha(theme.palette.primary.main, 0.3)
    : 'transparent';

  const iconColor = variant === 'primary'
    ? theme.palette.primary.main
    : theme.palette.text.secondary;

  return (
    <Fade in={!dismissed}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          bgcolor: bgColor,
          borderColor: borderColor,
          borderRadius: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box sx={{ color: iconColor, mt: 0.25 }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{ mt: -0.5, mr: -0.5 }}
                aria-label="Dismiss suggestion"
              >
                <SvgIcon component={Close} inheritViewBox sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {message}
            </Typography>
            {reason && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                <SvgIcon
                  component={Information}
                  inheritViewBox
                  sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }}
                />
                {reason}
              </Typography>
            )}
            {actionLabel && onAction && (
              <Button
                size="small"
                variant={variant === 'primary' ? 'contained' : 'outlined'}
                onClick={onAction}
                sx={{ mt: 1.5 }}
              >
                {actionLabel}
              </Button>
            )}
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
};

/**
 * Prediction Banner
 * Shows AI predictions with confidence level and data source
 */
interface PredictionBannerProps {
  prediction: Prediction;
  onAction?: () => void;
}

export const PredictionBanner: FC<PredictionBannerProps> = ({ prediction, onAction }) => {
  const theme = useTheme();

  const confidenceColors = {
    high: theme.palette.success.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main
  };

  const confidenceLabels = {
    high: 'High confidence',
    medium: 'Medium confidence',
    low: 'Low confidence'
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.04),
        borderColor: alpha(theme.palette.primary.main, 0.2)
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }}
        >
          <SvgIcon
            component={TrendingUp}
            inheritViewBox
            sx={{ fontSize: 20, color: theme.palette.primary.main }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2">{prediction.title}</Typography>
            <Chip
              label={confidenceLabels[prediction.confidence]}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: alpha(confidenceColors[prediction.confidence], 0.15),
                color: confidenceColors[prediction.confidence],
                fontWeight: 500
              }}
            />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {prediction.prediction}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            <strong>Based on:</strong> {prediction.basedOn}
          </Typography>
          {prediction.actionLabel && (
            <Button
              size="small"
              variant="text"
              endIcon={<SvgIcon component={ChevronRight} inheritViewBox sx={{ fontSize: 16 }} />}
              onClick={onAction || prediction.action}
              sx={{ mt: 1, ml: -1 }}
            >
              {prediction.actionLabel}
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

/**
 * Smart Default Suggestion
 * Suggests auto-filled values with explanation
 */
interface SmartDefaultSuggestionProps {
  field: string;
  suggestedValue: string;
  reason: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export const SmartDefaultSuggestion: FC<SmartDefaultSuggestionProps> = ({
  field,
  suggestedValue,
  reason,
  onAccept,
  onDismiss
}) => {
  const theme = useTheme();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.success.main, 0.04),
        borderColor: alpha(theme.palette.success.main, 0.3)
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <SvgIcon
          component={Star}
          inheritViewBox
          sx={{ fontSize: 20, color: theme.palette.success.main, mt: 0.25 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Suggested value for {field}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: theme.palette.success.main,
              mt: 0.5
            }}
          >
            {suggestedValue}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            <SvgIcon
              component={Information}
              inheritViewBox
              sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }}
            />
            {reason}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button size="small" variant="contained" color="success" onClick={onAccept}>
              Use this value
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={() => {
                setDismissed(true);
                onDismiss();
              }}
            >
              No thanks
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

/**
 * Proactive Warning Card
 * Shows warnings with suggestions for resolution
 */
interface ProactiveWarningCardProps {
  warning: ProactiveWarning;
  onDismiss: () => void;
}

export const ProactiveWarningCard: FC<ProactiveWarningCardProps> = ({ warning, onDismiss }) => {
  const severityMap = {
    warning: 'warning' as const,
    info: 'info' as const,
    success: 'success' as const
  };

  return (
    <Alert
      severity={severityMap[warning.type]}
      onClose={onDismiss}
      sx={{ borderRadius: 2 }}
    >
      <AlertTitle>{warning.title}</AlertTitle>
      <Typography variant="body2" sx={{ mb: warning.suggestion ? 1 : 0 }}>
        {warning.message}
      </Typography>
      {warning.suggestion && (
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5 }}>
          <SvgIcon
            component={Information}
            inheritViewBox
            sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }}
          />
          Suggestion: {warning.suggestion}
        </Typography>
      )}
      {warning.actionLabel && warning.action && (
        <Button
          size="small"
          variant="outlined"
          color={severityMap[warning.type]}
          onClick={warning.action}
        >
          {warning.actionLabel}
        </Button>
      )}
    </Alert>
  );
};

/**
 * Field Hint Tooltip
 * Small help icon with contextual tooltip
 */
interface FieldHintTooltipProps {
  hint: string;
  example?: string;
}

export const FieldHintTooltip: FC<FieldHintTooltipProps> = ({ hint, example }) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2">{hint}</Typography>
          {example && (
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.8 }}>
              {example}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <IconButton size="small" sx={{ p: 0.25 }}>
        <SvgIcon
          component={Information}
          inheritViewBox
          sx={{ fontSize: 16, color: theme.palette.text.secondary }}
        />
      </IconButton>
    </Tooltip>
  );
};
