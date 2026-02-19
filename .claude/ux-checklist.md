# UX Principles Checklist for AI Code Generation

Use this checklist when generating UI code to ensure alignment with OpenGov UX principles.

## REQUIRED FIRST: Use CDS Frontend Plugin

**Before writing ANY UI code, use these skills:**

```
/component-patterns  - Learn Composable + Configurable API
/mui-theme           - Learn theme colors, spacing, typography
/layout-patterns     - Learn Grid, Stack, Box patterns
/validate-capital    - Validate CDS compliance when done
```

For Figma implementations:
```
/figma-to-code       - Generate components from designs
/component-detector  - Find correct OpenGov packages
```

**Skipping this step leads to non-compliant UI code!**

---

## 1. Purposeful and Human-Centric

### Messaging & Tone
- [ ] **No technical jargon** - Use plain language users understand
- [ ] **Helpful, not blaming** - "Please enter a valid email" not "Invalid input"
- [ ] **Guide to next steps** - Empty states and errors suggest what to do next
- [ ] **Friendly tone** - Expert but helpful; enthusiastic; factual; humble

### Empty States
- [ ] **Encouraging message** - "No items yet" not "No records found"
- [ ] **Clear call-to-action** - Button to create first item
- [ ] **Helpful suggestion** - "Try adjusting your filters" when applicable

### Error Messages
- [ ] **What went wrong** - Brief, clear description
- [ ] **Why it matters** - Context if needed
- [ ] **How to fix it** - Actionable next steps
- [ ] **Recovery option** - Button/link to resolve

### Confirmation Dialogs
- [ ] **Specific title** - "Delete this permit?" not "Delete?"
- [ ] **Named item** - Include the item name being affected
- [ ] **Consequence explained** - "This cannot be undone"
- [ ] **Reassuring alternative** - Mention restore option if available
- [ ] **Clear button labels** - "Keep it" / "Yes, delete" not "No" / "Yes"

---

## 2. One Platform, Unified Experience

### Consistency
- [ ] **CDS components** - Use Capital Design System components
- [ ] **Theme colors** - `theme.palette.*` not hardcoded hex values
- [ ] **Spacing system** - `theme.spacing()` not pixel values
- [ ] **Standard layouts** - Use established layout patterns from examples/

### Accessibility
- [ ] **ARIA labels** - All interactive elements have accessible names
- [ ] **Keyboard navigation** - Tab order is logical
- [ ] **Focus management** - Focus moves appropriately on errors
- [ ] **Screen reader support** - Status changes are announced
- [ ] **Color contrast** - Text meets WCAG 2.1 AA standards
- [ ] **Error indication** - Not conveyed by color alone

### Persona Awareness
- [ ] **Low-tech users** - Simple interfaces, clear hierarchy
- [ ] **Mid-tech users** - Efficient workflows, progressive disclosure
- [ ] **High-tech users** - Keyboard shortcuts available (if applicable)

---

## 3. Transparency by Design

### Data Sources
- [ ] **Show origin** - "Based on county property records"
- [ ] **Show freshness** - "Updated: January 15, 2024"
- [ ] **Show confidence** - For AI predictions: "High confidence"

### Audit & Traceability
- [ ] **Who did what** - Actor name shown
- [ ] **When it happened** - Timestamp visible
- [ ] **Why it happened** - Reason/explanation included

### Automated Actions
- [ ] **Explain automation** - "Auto-assigned because..."
- [ ] **Show criteria** - "Based on your queue and expertise"
- [ ] **Allow override** - User can change automated decisions

### Calculations & Decisions
- [ ] **Show formula** - Break down how values are calculated
- [ ] **Link to source** - "Per 2024 Fee Schedule"
- [ ] **Allow verification** - User can check the logic

---

## 4. AI at the Core (AI First)

### AI Presence
- [ ] **Consistent location** - AI features in predictable place (sidebar/panel)
- [ ] **Clear identification** - AI suggestions labeled as such
- [ ] **Non-intrusive** - Suggestions can be dismissed

### Suggestions
- [ ] **Context-aware** - Relevant to current workflow
- [ ] **Explained** - "Why this suggestion: ..."
- [ ] **Actionable** - Clear button to accept/apply
- [ ] **Dismissible** - User can say "No thanks"

### Predictions
- [ ] **Confidence level** - High/Medium/Low indicator
- [ ] **Data basis** - "Based on 47 similar permits"
- [ ] **Accuracy hedge** - "Estimate" not "Exact"

### Smart Defaults
- [ ] **Explanation** - Why this value is suggested
- [ ] **Accept/Reject** - Clear options to use or dismiss
- [ ] **Manual override** - User can always enter custom value

---

## Quick Reference: Tone Examples

### DO:
- "No permits found yet"
- "Please enter a valid email (e.g., name@agency.gov)"
- "We couldn't save your changes. Please try again."
- "You're about to delete this item. This can't be undone."

### DON'T:
- "No records found"
- "Invalid email format"
- "Error 500: Internal Server Error"
- "Delete? [Yes] [No]"

---

## Layout Pattern Reference

| Pattern | Use Case |
|---------|----------|
| `StandardPageLayout` | Most pages |
| `TwoColumnLayout` | Detail pages (8/4 split) |
| `DataTableLayout` | Lists with CRUD |
| `AIAssistantPanel` | AI features sidebar |
| `ContextualSuggestions` | Inline AI hints |
| `AccessibleFormLayout` | WCAG-compliant forms |
| `TransparencyComponents` | Audit trails, data sources |

### PageHeader Flush Pattern (REQUIRED)

**PageHeader must sit flush with the navbar with no padding.**

The PageHeaderComposable component should be placed outside any padded container so it spans the full width and sits flush with the navigation bar.

```tsx
// CORRECT: PageHeader flush, content area with padding
return (
  <>
    {/* Page Header - sits flush with navbar, no padding */}
    <PageHeaderComposable>
      <PageHeaderComposable.Header>
        <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
      </PageHeaderComposable.Header>
    </PageHeaderComposable>

    {/* Content area with padding */}
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Page content goes here */}
      </Stack>
    </Box>
  </>
);

// WRONG: PageHeader inside padded Stack
return (
  <Stack spacing={3}>  {/* NO! This adds spacing above PageHeader */}
    <PageHeaderComposable>...</PageHeaderComposable>
    {/* Content */}
  </Stack>
);
```

**Key rules:**
- [ ] Use fragment `<>...</>` to wrap PageHeader + content
- [ ] PageHeader is first, outside any padded containers
- [ ] Wrap content in `<Box sx={{ p: 3 }}>` for padding
- [ ] Use `<Stack spacing={3}>` inside the Box for content layout

---

## Files to Reference

- `context/tone-guidelines.md` - Messaging examples
- `context/personas.md` - User personas and tech fluency
- `examples/layouts/` - All layout patterns
- `examples/pages/` - Page templates with state

---

## Before Committing UI Code

1. Read all text aloud - Does it sound helpful and human?
2. Check empty states - Do they guide the user?
3. Review error messages - Do they help fix the problem?
4. Verify dialogs - Are the options clear?
5. Test keyboard navigation - Can you tab through everything?
6. Check AI features - Are they explained and dismissible?
