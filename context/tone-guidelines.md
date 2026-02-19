# System Tone Guidelines

## UX Principle: Purposeful and Human-Centric

> "Our design language feels like a partner, not a system, guiding with clarity and respect."

**Tone of voice:** Expert, but friendly and helpful; enthusiastic; factual; humble; visionary; underpromise and overdeliver.

---

## Before/After Examples

### Empty States

**Before (System-like):**
```
No records found.
```

**After (Human-centric):**
```
No permits found yet
Start by creating your first permit application, or adjust your search filters.
```

---

**Before:**
```
0 results
```

**After:**
```
We couldn't find any matches
Try broadening your search or check for typos. You can also browse all items.
```

---

### Loading States

**Before:**
```
Loading...
```

**After:**
```
Getting your data ready...
```

---

**Before:**
```
Processing request
```

**After:**
```
Saving your changes...
This usually takes just a moment.
```

---

### Error Messages

**Before (Technical):**
```
Error 500: Internal Server Error
```

**After (Helpful):**
```
Something went wrong on our end
We're looking into it. Please try again in a few moments, or contact support if this continues.
```

---

**Before:**
```
Invalid input
```

**After:**
```
Please check your entry
The parcel number should be 10 digits (e.g., 123-456-7890).
```

---

**Before:**
```
Authentication failed
```

**After:**
```
We couldn't sign you in
Please check your email and password and try again. Need help? Reset your password.
```

---

### Confirmation Dialogs

**Before (Abrupt):**
```
Title: Delete?
Message: This cannot be undone.
Buttons: [Cancel] [Delete]
```

**After (Reassuring):**
```
Title: Delete this permit application?
Message: You're about to delete "123 Main St - Building Permit". This action cannot be undone, but you can always create a new application if needed.
Buttons: [Keep it] [Yes, delete]
```

---

**Before:**
```
Title: Archive item?
Message: Item will be archived.
Buttons: [No] [Yes]
```

**After:**
```
Title: Archive this work order?
Message: "WO-2024-0892" will be moved to your archive. You can restore it anytime from the Archive section.
Buttons: [Cancel] [Archive]
```

---

### Success Messages

**Before:**
```
Saved successfully
```

**After:**
```
Changes saved
Your permit application has been updated.
```

---

**Before:**
```
Operation completed
```

**After:**
```
All done!
The work order has been assigned to John Smith. They'll receive a notification shortly.
```

---

### Form Validation

**Before:**
```
Required field
```

**After:**
```
This field is required
```

---

**Before:**
```
Invalid email format
```

**After:**
```
Please enter a valid email address
Example: name@agency.gov
```

---

**Before:**
```
Date must be in the future
```

**After:**
```
Please select a future date
Inspections need to be scheduled at least 24 hours in advance.
```

---

### Help & Guidance

**Before:**
```
See documentation
```

**After:**
```
Need help?
Check our guide on permit applications, or contact your administrator.
```

---

**Before:**
```
Tooltip: Enter value
```

**After:**
```
Tooltip: Enter the 10-digit parcel number from your property tax statement
Example: 123-456-7890
```

---

### Warnings

**Before:**
```
Warning: Unsaved changes
```

**After:**
```
You have unsaved changes
Would you like to save your work before leaving? Any unsaved changes will be lost.
```

---

**Before:**
```
Session expiring
```

**After:**
```
Your session will expire soon
For your security, you'll be signed out in 5 minutes. Save your work or click "Stay signed in" to continue.
```

---

## Tone Principles

### 1. Be Specific, Not Vague

| Don't | Do |
|-------|-----|
| "Error occurred" | "We couldn't save your changes. Please try again." |
| "Invalid data" | "The phone number should be 10 digits" |
| "Action failed" | "We couldn't submit the permit. Check required fields." |

### 2. Guide, Don't Blame

| Don't | Do |
|-------|-----|
| "You entered an invalid date" | "Please select a valid date" |
| "Wrong password" | "That password doesn't match our records" |
| "You forgot to fill required fields" | "Please complete the highlighted fields" |

### 3. Offer Next Steps

| Don't | Do |
|-------|-----|
| "No results found" | "No results found. Try different search terms or browse all items." |
| "Access denied" | "You don't have permission to view this. Contact your administrator for access." |
| "File too large" | "This file exceeds 10MB. Try compressing it or uploading a smaller version." |

### 4. Use Plain Language

| Don't | Do |
|-------|-----|
| "Session terminated due to inactivity" | "You were signed out after being away" |
| "Insufficient permissions" | "You need additional access for this action" |
| "Record persisted to database" | "Your changes have been saved" |

### 5. Be Encouraging

| Don't | Do |
|-------|-----|
| "3 errors found" | "Almost there! Just 3 items need attention" |
| "Incomplete submission" | "You're making progress! Complete these fields to submit" |
| "Failed validation" | "Let's fix a few things before continuing" |

---

## Context-Specific Guidelines

### For Low-Tech Users (Maintenance Workers)
- Use simple, everyday language
- Avoid technical jargon
- Provide clear, single-action buttons
- Include visual cues (icons) alongside text

### For Mid-Tech Users (Budget Directors, Permit Reviewers)
- Be efficient and professional
- Provide context but don't over-explain
- Offer quick actions for common tasks
- Use progressive disclosure for advanced options

### For High-Tech Users (IT Directors)
- Be precise and factual
- Include technical details when relevant
- Provide keyboard shortcuts
- Offer advanced configuration options

---

## AI-Generated Content Guidelines

When generating UI text with AI:

1. **Always explain "why"** - Include reasons for suggestions and recommendations
2. **Show data sources** - "Based on similar permits in your jurisdiction"
3. **Express confidence** - "We're fairly confident" vs "This is our best estimate"
4. **Provide alternatives** - "Not quite right? You can adjust this manually"
5. **Be humble** - "We think..." not "The correct answer is..."

### AI Message Examples

**Suggestion:**
```
We noticed you're working on a building permit.
Based on similar applications, you might also need an electrical permit.
Would you like to add one?
[Add electrical permit] [No thanks]
```

**Prediction:**
```
Estimated processing time: 3-5 business days
Based on 47 similar permits processed in your jurisdiction this quarter.
```

**Smart Default:**
```
Suggested fee: $250.00
This is the standard fee for residential building permits under 500 sq ft.
[Use this value] [Enter different amount]
```

---

## Implementation Checklist

When writing UI text, verify:

- [ ] Is the message helpful, not just informative?
- [ ] Does it guide the user to a next step?
- [ ] Is the tone friendly and professional?
- [ ] Does it avoid blame or technical jargon?
- [ ] Would a non-technical user understand it?
- [ ] Does it respect the user's time (concise)?
- [ ] Does it build trust (honest, accurate)?
