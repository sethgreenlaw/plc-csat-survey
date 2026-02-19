import { useState, type FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Chip,
  Collapse,
  IconButton,
  Link,
  SvgIcon,
  useTheme,
  alpha
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  ChevronDown,
  ChevronRight,
  Account as AccountIcon,
  Pencil,
  Refresh,
  Information,
  ArrowTopRight
} from '@opengov/react-capital-assets';

/**
 * Pattern 16: Transparency Components
 *
 * UX Principle: Transparency by Design
 * "We design experiences that make information clear, contextual, and trustworthy,
 * so users understand not just what happened, but why."
 *
 * Components:
 * - AuditTrail: Shows activity history with explanations
 * - DataSourceCard: Shows where data comes from
 * - DecisionExplainer: Explains automated decisions
 * - ChangeHistoryItem: Shows what changed and why
 *
 * Key patterns:
 * - Always show WHO did WHAT and WHEN
 * - Explain WHY automated actions occurred
 * - Link to data sources
 * - Make audit trails scannable
 * - Provide detail on demand (progressive disclosure)
 */

// Types for transparency components
interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    type: 'user' | 'system' | 'ai';
    avatar?: string;
  };
  action: string;
  description: string;
  reason?: string; // WHY this happened
  details?: Record<string, string>; // Additional context
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'manual' | 'calculated' | 'ai';
  lastUpdated: string;
  confidence?: 'high' | 'medium' | 'low';
  url?: string;
  description?: string;
}

export const TransparencyComponents: FC = () => {
  const theme = useTheme();

  // Demo audit events
  const demoAuditEvents: AuditEvent[] = [
    {
      id: '1',
      timestamp: '2024-01-15T14:30:00Z',
      actor: { name: 'Sarah Chen', type: 'user' },
      action: 'Approved',
      description: 'Permit application approved',
      reason: 'All requirements met and documentation verified',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:15:00Z',
      actor: { name: 'AI Assistant', type: 'ai' },
      action: 'Auto-assigned',
      description: 'Assigned to Sarah Chen for review',
      reason: 'Sarah has the shortest queue and expertise in residential permits',
      status: 'info'
    },
    {
      id: '3',
      timestamp: '2024-01-14T16:45:00Z',
      actor: { name: 'System', type: 'system' },
      action: 'Status changed',
      description: 'Moved to "Ready for Review"',
      reason: 'All required documents uploaded and fees paid',
      details: {
        'Previous Status': 'Pending Documents',
        'Documents Uploaded': '3 of 3',
        'Fees Paid': '$250.00'
      },
      status: 'info'
    },
    {
      id: '4',
      timestamp: '2024-01-14T09:20:00Z',
      actor: { name: 'John Smith', type: 'user' },
      action: 'Submitted',
      description: 'New permit application submitted',
      status: 'info'
    }
  ];

  // Demo data sources
  const demoDataSources: DataSource[] = [
    {
      id: '1',
      name: 'Property Database',
      type: 'database',
      lastUpdated: '2024-01-15T08:00:00Z',
      description: 'County assessor property records',
      url: '/data-sources/property-db'
    },
    {
      id: '2',
      name: 'Fee Schedule API',
      type: 'api',
      lastUpdated: '2024-01-01T00:00:00Z',
      description: '2024 permit fee schedule from Finance department',
      confidence: 'high'
    },
    {
      id: '3',
      name: 'Processing Time Estimate',
      type: 'ai',
      lastUpdated: '2024-01-15T14:30:00Z',
      description: 'Based on 47 similar permits processed this quarter',
      confidence: 'high'
    }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Transparency Components</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 16: Audit trails, data sources, and decision explanations
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Example: Audit Trail */}
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Audit Trail (Activity History)
        </Typography>

        <Box sx={{ maxWidth: 600 }}>
          <AuditTrail events={demoAuditEvents} />
        </Box>
      </Paper>

      {/* Example: Data Source Cards */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Data Source Cards
        </Typography>

        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          {demoDataSources.map(source => (
            <DataSourceCard key={source.id} source={source} />
          ))}
        </Stack>
      </Paper>

      {/* Example: Decision Explainer */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Decision Explainer
        </Typography>

        <Box sx={{ maxWidth: 500 }}>
          <DecisionExplainer
            decision="Permit fee calculated as $250.00"
            factors={[
              { label: 'Base fee for residential permits', value: '$150.00' },
              { label: 'Square footage surcharge (500 sq ft)', value: '$50.00' },
              { label: 'Plan review fee', value: '$50.00' }
            ]}
            source="2024 Fee Schedule, Resolution 2023-45"
            sourceUrl="/documents/fee-schedule-2024.pdf"
          />
        </Box>
      </Paper>

      {/* Example: Change History Item */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Change History Item
        </Typography>

        <Box sx={{ maxWidth: 500 }}>
          <ChangeHistoryItem
            field="Status"
            oldValue="Pending Review"
            newValue="Approved"
            changedBy="Sarah Chen"
            changedAt="2024-01-15T14:30:00Z"
            reason="All requirements satisfied. Site plan verified against zoning requirements."
          />
        </Box>
      </Paper>

      {/* UX Principles */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          UX Principles Applied
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="primary">Empower Users</Typography>
            <Typography variant="body2" color="text.secondary">
              Users can see exactly what happened, when, and by whom - reducing support dependency
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Strengthen Trust</Typography>
            <Typography variant="body2" color="text.secondary">
              Every workflow is traceable and explainable, reinforcing accountability
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Reduce Friction</Typography>
            <Typography variant="body2" color="text.secondary">
              Clear context and explanations help users understand without asking for help
            </Typography>
          </Box>
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
{`{/* Audit Trail */}
<AuditTrail
  events={[
    {
      timestamp: '2024-01-15T14:30:00Z',
      actor: { name: 'Sarah Chen', type: 'user' },
      action: 'Approved',
      description: 'Permit application approved',
      reason: 'All requirements met', // Transparency!
      status: 'success'
    }
  ]}
/>

{/* Data Source Card */}
<DataSourceCard
  source={{
    name: 'Property Database',
    type: 'database',
    lastUpdated: '2024-01-15T08:00:00Z',
    description: 'County assessor records' // Where data comes from
  }}
/>

{/* Decision Explainer */}
<DecisionExplainer
  decision="Fee: $250.00"
  factors={[
    { label: 'Base fee', value: '$150.00' },
    { label: 'Surcharge', value: '$100.00' }
  ]}
  source="2024 Fee Schedule" // Links to official source
/>`}
        </Box>
      </Paper>
        </Stack>
      </Box>
    </>
  );
};

/**
 * Audit Trail Component
 * Shows activity history with explanations
 */
interface AuditTrailProps {
  events: AuditEvent[];
  showAllDefault?: boolean;
}

export const AuditTrail: FC<AuditTrailProps> = ({ events, showAllDefault = false }) => {
  const theme = useTheme();
  const [showAll, setShowAll] = useState(showAllDefault);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  const displayedEvents = showAll ? events : events.slice(0, 3);

  const toggleExpanded = (id: string) => {
    setExpandedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const getActorIcon = (type: AuditEvent['actor']['type']) => {
    switch (type) {
      case 'ai': return Refresh;
      case 'system': return Refresh;
      default: return AccountIcon;
    }
  };

  const getStatusColor = (status?: AuditEvent['status']) => {
    switch (status) {
      case 'success': return theme.palette.success.main;
      case 'warning': return theme.palette.warning.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.info.main;
    }
  };

  return (
    <Box>
      <Timeline
        sx={{
          p: 0,
          m: 0,
          '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 }
        }}
      >
        {displayedEvents.map((event, index) => (
          <TimelineItem key={event.id}>
            <TimelineOppositeContent
              sx={{
                flex: 0.3,
                py: 1.5,
                px: 2
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {new Date(event.timestamp).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: getStatusColor(event.status),
                  boxShadow: 'none'
                }}
              >
                <SvgIcon
                  component={getActorIcon(event.actor.type)}
                  inheritViewBox
                  sx={{ fontSize: 16 }}
                />
              </TimelineDot>
              {index < displayedEvents.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent sx={{ py: 1.5, px: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1,
                  cursor: event.reason || event.details ? 'pointer' : 'default'
                }}
                onClick={() => (event.reason || event.details) && toggleExpanded(event.id)}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {event.action}
                      </Typography>
                      <Chip
                        label={event.actor.name}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {event.description}
                    </Typography>
                  </Box>
                  {(event.reason || event.details) && (
                    <IconButton
                      size="small"
                      aria-label={expandedEvents.includes(event.id) ? 'Collapse details' : 'Show details'}
                      aria-expanded={expandedEvents.includes(event.id)}
                    >
                      <SvgIcon
                        component={expandedEvents.includes(event.id) ? ChevronDown : ChevronRight}
                        inheritViewBox
                        sx={{ fontSize: 16 }}
                      />
                    </IconButton>
                  )}
                </Stack>

                {/* Expanded: Show WHY (Transparency) */}
                <Collapse in={expandedEvents.includes(event.id)}>
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: 1,
                      borderColor: 'divider'
                    }}
                  >
                    {event.reason && (
                      <Box sx={{ mb: event.details ? 2 : 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Why this happened:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {event.reason}
                        </Typography>
                      </Box>
                    )}
                    {event.details && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Details:
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                          {Object.entries(event.details).map(([key, value]) => (
                            <Stack
                              key={key}
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="caption" color="text.secondary">
                                {key}:
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                {value}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {events.length > 3 && (
        <Button
          size="small"
          onClick={() => setShowAll(!showAll)}
          sx={{ ml: 2 }}
        >
          {showAll ? 'Show less' : `Show ${events.length - 3} more events`}
        </Button>
      )}
    </Box>
  );
};

/**
 * Data Source Card
 * Shows where data comes from
 */
interface DataSourceCardProps {
  source: DataSource;
}

export const DataSourceCard: FC<DataSourceCardProps> = ({ source }) => {
  const theme = useTheme();

  const typeIcons = {
    database: Refresh,
    api: ArrowTopRight,
    manual: Pencil,
    calculated: Refresh,
    ai: Refresh
  };

  const typeLabels = {
    database: 'Database',
    api: 'External API',
    manual: 'Manual Entry',
    calculated: 'Calculated',
    ai: 'AI Generated'
  };

  const confidenceColors = {
    high: theme.palette.success.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 1
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: theme.palette.action.hover
          }}
        >
          <SvgIcon
            component={typeIcons[source.type]}
            inheritViewBox
            sx={{ fontSize: 18, color: theme.palette.text.secondary }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {source.name}
            </Typography>
            <Chip
              label={typeLabels[source.type]}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem' }}
            />
          </Stack>
          {source.description && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {source.description}
            </Typography>
          )}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Updated: {new Date(source.lastUpdated).toLocaleDateString()}
            </Typography>
            {source.confidence && (
              <Chip
                label={`${source.confidence} confidence`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: alpha(confidenceColors[source.confidence], 0.15),
                  color: confidenceColors[source.confidence]
                }}
              />
            )}
          </Stack>
          {source.url && (
            <Link
              href={source.url}
              variant="caption"
              sx={{ mt: 0.5, display: 'inline-block' }}
            >
              View source
            </Link>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

/**
 * Decision Explainer
 * Shows how a decision/calculation was made
 */
interface DecisionExplainerProps {
  decision: string;
  factors: { label: string; value: string }[];
  source?: string;
  sourceUrl?: string;
}

export const DecisionExplainer: FC<DecisionExplainerProps> = ({
  decision,
  factors,
  source,
  sourceUrl
}) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.info.main, 0.04)
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <SvgIcon
          component={Information}
          inheritViewBox
          sx={{ fontSize: 18, color: theme.palette.info.main }}
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          How was this calculated?
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
        {decision}
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {factors.map((factor, index) => (
          <Stack
            key={index}
            direction="row"
            justifyContent="space-between"
            sx={{
              py: 0.5,
              borderBottom: index < factors.length - 1 ? 1 : 0,
              borderColor: 'divider'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {factor.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {factor.value}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {source && (
        <Typography variant="caption" color="text.secondary">
          Source: {sourceUrl ? (
            <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {source}
            </Link>
          ) : source}
        </Typography>
      )}
    </Paper>
  );
};

/**
 * Change History Item
 * Shows what changed, when, and why
 */
interface ChangeHistoryItemProps {
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export const ChangeHistoryItem: FC<ChangeHistoryItemProps> = ({
  field,
  oldValue,
  newValue,
  changedBy,
  changedAt,
  reason
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {field} changed
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary'
              }}
            >
              {oldValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">→</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
              {newValue}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            {changedBy}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {new Date(changedAt).toLocaleString()}
          </Typography>
        </Box>
      </Stack>

      {reason && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Reason:
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {reason}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
