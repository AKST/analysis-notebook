# Responsive Layout (Skeleton)

## Layout Coordination
`installResponsiveSkeleton()` manages 3 breakpoints:
- **Wide** (>900px): `"300px 1fr 300px"` - nav | app | config
- **Medium** (600-900px): `"300px 1fr"` - nav | app
- **Narrow** (<600px): `"1fr"` - app only (overlay menus)

## Menu State Rules
- Narrow/medium: exclusive menu visibility
- Layout changes trigger automatic menu resets
- Menu toggles recalculate grid and trigger `application.onResize()`

## Event Integration
- Navigation `loadApp` → config reset → app loading
- Config `configChange` → engine updates
- Window resize → layout recalculation


