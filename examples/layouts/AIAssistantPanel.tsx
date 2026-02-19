import { useState, type FC } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  InputAdornment,
  Collapse,
  Avatar,
  Divider,
  SvgIcon,
  useTheme,
  alpha
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  Information,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Star,
  CheckCircle,
  AlertCircle
} from '@opengov/react-capital-assets';

/**
 * Pattern 13: AI Assistant Panel
 *
 * UX Principle: AI at the Core (AI First)
 * "Always present, context-aware, and explainable. We surface role-based
 * insights, predictions, and next steps in a highly visible, and consistent
 * space in the experience."
 *
 * When to use:
 * - Dashboard sidebars with AI recommendations
 * - Workflow pages needing intelligent guidance
 * - Any page where AI can assist with next steps
 * - Context-aware help and suggestions
 *
 * Structure:
 * - Collapsible panel with consistent location (typically right sidebar)
 * - Role-based greeting and context awareness
 * - Suggested next steps based on current workflow
 * - Quick actions and insights
 * - Optional chat interface for questions
 *
 * Key patterns:
 * - Consistent location across the platform (right sidebar or bottom panel)
 * - Role-aware suggestions (adapts to user persona)
 * - Explainable recommendations (shows "why" for each suggestion)
 * - Progressive disclosure (collapsed by default on mobile)
 * - Friendly, helpful tone throughout
 */

interface Suggestion {
  id: string;
  title: string;
  description: string;
  reason: string; // Transparency: explain WHY this is suggested
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
  actionLabel?: string;
}

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  detail?: string;
}

interface AIAssistantPanelProps {
  /** User's display name for personalized greeting */
  userName?: string;
  /** User's role for context-aware suggestions */
  userRole?: string;
  /** Current context (e.g., "reviewing permits", "managing budget") */
  currentContext?: string;
  /** Suggested next steps */
  suggestions?: Suggestion[];
  /** Insights about current data/workflow */
  insights?: Insight[];
  /** Whether to show the chat input */
  showChat?: boolean;
  /** Callback when user sends a message */
  onSendMessage?: (message: string) => void;
  /** Whether panel is expanded */
  defaultExpanded?: boolean;
}

// Demo component for the pattern showcase
export const AIAssistantPanel: FC = () => {
  const theme = useTheme();

  // Demo data
  const demoSuggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Review 3 pending permits',
      description: 'These permits have been waiting over 48 hours',
      reason: 'Based on your queue and SLA requirements',
      priority: 'high',
      actionLabel: 'Review now'
    },
    {
      id: '2',
      title: 'Complete monthly budget reconciliation',
      description: 'Due in 2 days',
      reason: "It's the 28th and your department typically completes this by month-end",
      priority: 'medium',
      actionLabel: 'Start reconciliation'
    },
    {
      id: '3',
      title: 'Update asset maintenance schedule',
      description: '12 assets are due for inspection next week',
      reason: 'Preventive maintenance helps avoid costly repairs',
      priority: 'low',
      actionLabel: 'View schedule'
    }
  ];

  const demoInsights: Insight[] = [
    {
      id: '1',
      type: 'success',
      message: 'Permit processing time improved 15% this month',
      detail: 'Your team is averaging 2.3 days vs 2.7 days last month'
    },
    {
      id: '2',
      type: 'warning',
      message: '2 work orders approaching SLA deadline',
      detail: 'Consider prioritizing WO-2024-0892 and WO-2024-0895'
    }
  ];

  return (
    <>
      {/* Page Header - sits flush with navbar, no padding */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>AI Assistant Panel</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Pattern 13: Context-aware AI assistance with role-based insights and next steps
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content area with padding */}
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Example: Full AI Panel */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: AI Assistant Sidebar
        </Typography>

        <Box sx={{ maxWidth: 360 }}>
          <AIAssistantPanelContent
            userName="Sarah"
            userRole="Permit Reviewer"
            currentContext="permit review queue"
            suggestions={demoSuggestions}
            insights={demoInsights}
            showChat={true}
          />
        </Box>
      </Paper>

      {/* Example: Compact AI Panel */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Example: Compact AI Panel (Collapsed)
        </Typography>

        <Box sx={{ maxWidth: 360 }}>
          <AIAssistantPanelContent
            userName="Sarah"
            userRole="Permit Reviewer"
            suggestions={demoSuggestions.slice(0, 2)}
            defaultExpanded={false}
          />
        </Box>
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
{`{/* AI Assistant Panel - Place in right sidebar */}
<AIAssistantPanelContent
  userName="Sarah"
  userRole="Permit Reviewer"
  currentContext="permit review queue"
  suggestions={[
    {
      id: '1',
      title: 'Review 3 pending permits',
      description: 'These permits have been waiting over 48 hours',
      reason: 'Based on your queue and SLA requirements', // Transparency!
      priority: 'high',
      actionLabel: 'Review now'
    }
  ]}
  insights={[
    {
      type: 'success',
      message: 'Processing time improved 15%',
      detail: 'Averaging 2.3 days vs 2.7 days last month'
    }
  ]}
  showChat={true}
  onSendMessage={(msg) => handleAIChat(msg)}
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
              Always present in a consistent location, providing context-aware suggestions
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Transparency by Design</Typography>
            <Typography variant="body2" color="text.secondary">
              Every suggestion includes a "reason" explaining WHY it's recommended
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">Purposeful and Human-Centric</Typography>
            <Typography variant="body2" color="text.secondary">
              Friendly, personalized greeting and helpful tone throughout
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="primary">One Platform, Unified Experience</Typography>
            <Typography variant="body2" color="text.secondary">
              Consistent component that can be used across all OpenGov products
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
 * Reusable AI Assistant Panel Content
 * Use this component in your actual pages
 */
export const AIAssistantPanelContent: FC<AIAssistantPanelProps> = ({
  userName = 'there',
  currentContext,
  suggestions = [],
  insights = [],
  showChat = false,
  onSendMessage,
  defaultExpanded = true
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [chatMessage, setChatMessage] = useState('');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  const handleSend = () => {
    if (chatMessage.trim() && onSendMessage) {
      onSendMessage(chatMessage);
      setChatMessage('');
    }
  };

  const priorityColors = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.info.main
  };

  const insightIcons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Information
  };

  const insightColors = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main
  };

  // Get time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.primary.main, 0.02)
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: theme.palette.primary.main
          }}
        >
          <SvgIcon component={Star} inheritViewBox sx={{ fontSize: 20 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            AI Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {suggestions.length} suggestions for you
          </Typography>
        </Box>
        <IconButton size="small" aria-label={expanded ? 'Collapse AI Assistant panel' : 'Expand AI Assistant panel'}>
          <SvgIcon
            component={expanded ? ChevronDown : ChevronRight}
            inheritViewBox
            sx={{ fontSize: 20 }}
          />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Personalized Greeting */}
          <Typography variant="body2" sx={{ mb: 2 }}>
            {getGreeting()}, <strong>{userName}</strong>!
            {currentContext && (
              <Typography component="span" color="text.secondary">
                {' '}Here's what I noticed while you're {currentContext}:
              </Typography>
            )}
          </Typography>

          {/* Insights */}
          {insights.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack spacing={1}>
                {insights.map((insight) => (
                  <Box
                    key={insight.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: alpha(insightColors[insight.type], 0.1),
                      border: 1,
                      borderColor: alpha(insightColors[insight.type], 0.3)
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <SvgIcon
                        component={insightIcons[insight.type]}
                        inheritViewBox
                        sx={{
                          fontSize: 18,
                          color: insightColors[insight.type],
                          mt: 0.25
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {insight.message}
                        </Typography>
                        {insight.detail && (
                          <Typography variant="caption" color="text.secondary">
                            {insight.detail}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Suggested Next Steps */}
          {suggestions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Suggested next steps
              </Typography>
              <List dense disablePadding>
                {suggestions.map((suggestion, index) => (
                  <Box key={suggestion.id}>
                    {index > 0 && <Divider />}
                    <ListItemButton
                      onClick={() =>
                        setExpandedSuggestion(
                          expandedSuggestion === suggestion.id ? null : suggestion.id
                        )
                      }
                      sx={{ px: 0, py: 1 }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: priorityColors[suggestion.priority]
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.title}
                        secondary={suggestion.description}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <SvgIcon
                        component={
                          expandedSuggestion === suggestion.id ? ChevronDown : ChevronRight
                        }
                        inheritViewBox
                        sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                      />
                    </ListItemButton>

                    {/* Expanded: Show WHY (Transparency) */}
                    <Collapse in={expandedSuggestion === suggestion.id}>
                      <Box
                        sx={{
                          ml: 4,
                          mb: 1,
                          p: 1.5,
                          bgcolor: theme.palette.action.hover,
                          borderRadius: 1
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                          <SvgIcon
                            component={Information}
                            inheritViewBox
                            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            <strong>Why this suggestion:</strong> {suggestion.reason}
                          </Typography>
                        </Stack>
                        {suggestion.actionLabel && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={suggestion.action}
                          >
                            {suggestion.actionLabel}
                          </Button>
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Box>
          )}

          {/* Chat Input */}
          {showChat && (
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Have a question? Ask me anything.
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Type your question..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleSend}
                          disabled={!chatMessage.trim()}
                          aria-label="Send message"
                        >
                          <SvgIcon component={ArrowRight} inheritViewBox sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};
