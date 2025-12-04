# Audio Boost Control Panel - Design Guidelines

## Design Approach

**System Selected**: Material Design Dark Theme with Pro Audio Interface Inspiration

This is a utility-focused application requiring precision controls and clear visual feedback. Drawing from professional audio software (DAWs, mixing boards) and dark-themed control interfaces like Discord, Spotify, and gaming peripheral software.

**Core Principles:**
- Precision over decoration - every element serves a functional purpose
- Clear visual hierarchy for critical controls
- Professional, technical aesthetic
- High contrast for readability in low-light environments

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, and 12 for consistent rhythm
- Component spacing: space-y-6 and space-y-8
- Section padding: p-8 and p-12
- Control gaps: gap-4 and gap-6

**Main Application Structure:**
```
┌─────────────────────────────────────┐
│  Header: App Title + Status         │  (h-16)
├─────────────────────────────────────┤
│                                     │
│  Control Panel (max-w-4xl centered) │  (flex-1)
│  - Device Selectors (grid 2-col)   │
│  - Boost Slider (full width)       │
│  - Audio Meters (full width)       │
│  - Waveform Display (full width)   │
│                                     │
└─────────────────────────────────────┘
```

## Typography

**Font Family**: 
- Primary: 'Inter' from Google Fonts (clean, technical readability)
- Monospace: 'JetBrains Mono' for numeric displays and technical data

**Hierarchy:**
- H1 (App Title): text-2xl font-bold tracking-tight
- H2 (Section Headers): text-lg font-semibold tracking-wide uppercase
- Body/Labels: text-sm font-medium
- Numeric Displays: text-3xl font-mono font-bold
- Helper Text: text-xs

## Component Library

### Header Bar
- Full width, fixed height (h-16)
- Contains app title (left), connection status indicator (right)
- Subtle bottom border for definition

### Device Selector Cards
- 2-column grid on desktop (grid-cols-2 gap-6)
- Single column on mobile
- Each card contains:
  - Label with icon (microphone/speaker icon from Heroicons)
  - Dropdown select with current device name
  - Device status indicator (small dot, active/inactive)
- Rounded corners (rounded-lg)
- Padding: p-6

### Boost Control Section
- Full-width contained card (p-8)
- Large numeric display showing current dB value (text-5xl font-mono)
- Full-width range slider with custom styling
- Min/Max labels (0db - 1000db) flanking slider
- Visual warning indicators at extreme values (>800db)

### Audio Level Meter
- Horizontal bar-style VU meter
- Segmented visualization (not continuous)
- Real-time peak level indicator
- dB scale markings (-60, -40, -20, -10, -6, -3, 0, +3, +6)
- Height: h-24, full width

### Waveform Display
- Large canvas area for live audio visualization (h-48 to h-64)
- Grid background for technical feel
- Centered zero-line
- Responsive width (w-full)

### Control Buttons
- Prominent primary button for "Enable Boost" toggle
- Secondary utility buttons (Settings, Reset)
- Size: px-6 py-3
- Rounded: rounded-md
- Use Heroicons for button icons

## Animations

**Minimal and Purposeful:**
- Smooth slider transitions (transition-all duration-150)
- Audio meter updates: No animation, instant response
- Waveform: Smooth canvas rendering, 60fps
- Device selector dropdown: Standard 200ms fade-in
- Toggle states: 150ms ease transitions

**No Decorative Animations** - This is a precision tool where responsiveness matters more than visual flair

## Layout Specifics

### Desktop (lg:)
- Max container width: max-w-4xl
- Centered: mx-auto
- Vertical padding: py-12
- 2-column device selectors

### Mobile/Tablet
- Full width with horizontal padding: px-4
- Single column stacking
- Reduced vertical spacing: py-6
- Maintain touch-friendly tap targets (min h-12)

## Icons

**Library**: Heroicons (outline style for most, solid for active states)

Required icons:
- Microphone (input device)
- Speaker/Volume (output device)
- Signal/Wave (waveform)
- Cog/Settings
- Refresh/Reset
- Check/X for status indicators

## Special Considerations

**Technical Displays:**
- Use monospace font for all numeric values
- Include units (dB, Hz) consistently
- Show real-time values with minimal latency

**Accessibility:**
- Maintain strong contrast for readability
- All controls keyboard accessible
- Clear focus states on interactive elements
- ARIA labels for screen readers on technical controls

**Visual Feedback:**
- Active/inactive states for device connections
- Real-time audio level indication
- Boost level warning states (visual cues at dangerous levels)

This design creates a professional, focused audio control interface that prioritizes usability and precision over decorative elements, appropriate for a technical utility application.