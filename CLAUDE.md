# Vibebox - Vibe Coding Sandbox

This is a sandbox repository for vibe coding experiments with Claude Code.

## Purpose

- Experiment with new ideas freely
- Prototype features quickly
- Test Claude Code capabilities
- Learn and explore technologies

## Environment

- **Runtime Manager**: mise
- **Python**: 3.13.1 (use `uv` for package management)
- **Node.js**: 22.12.0 (use `npm` or `yarn`)
- **Go**: 1.24.4
- **Rust**: 1.92.0

## Guidelines

- This is a sandbox - feel free to experiment
- No strict coding standards required
- Focus on rapid iteration and learning
- Clean up when experiments are complete

## Design System

When building frontend applications, follow this aesthetic:

### Philosophy
- **Japanese-inspired minimalism**: Clean, restrained, intentional
- **Editorial quality**: Like a premium tool, not a typical web app
- **Warmth over coldness**: Avoid sterile tech aesthetics

### Typography
- Display font: Serif (Cormorant Garamond, Playfair Display, etc.)
- Body font: Modern sans-serif (Outfit, Satoshi, etc.)
- **AVOID**: Inter, Roboto, Arial, system fonts

### Color Palette
- Warm stone/cream backgrounds (not pure white)
- Amber/gold accents (not blue/purple gradients)
- Subtle borders with transparency
- CSS variables for theming

### Components
- Rounded corners (2xl for cards, lg for buttons)
- Layered shadows for depth
- Inline SVG icons (not external images)
- Noise texture overlay for tactile feel

### Interactions
- Subtle fade-in animations on load
- Hover scale/rotate effects
- Keyboard shortcuts with visual hints
- Loading states with personality

### Code Patterns
```tsx
// CSS Variables in globals.css
:root {
  --background: #fafaf9;
  --surface: #ffffff;
  --accent: #b45309;
  --text-muted: #78716c;
}

// Inline SVG over external images
const Icon = () => <svg>...</svg>;

// Semantic class names with CSS vars
className="bg-[var(--surface)] text-[var(--foreground)]"
```

### Dark Mode
- Always support `prefers-color-scheme: dark`
- Invert appropriately (dark backgrounds, light text)
- Maintain warmth in dark mode

## Auto Debug Loop

After making code changes, ALWAYS verify by running the appropriate check command and fix any errors automatically:

1. **Check for errors** using one of:
   - `npm run build` (Next.js/Node.js)
   - `go build ./...` (Go)
   - `cargo build` (Rust)
   - `uv run python -m py_compile <file>` (Python)
   - IDE diagnostics via `mcp__ide__getDiagnostics`

2. **If errors exist**: Fix them immediately without asking
3. **Repeat** until build/check passes
4. **Max iterations**: 5 (ask user if still failing)

This applies to:
- New file creation
- Code modifications
- Refactoring
- Design changes (frontend)

## Common Tasks

### Python (uv)
```bash
uv init                    # Initialize project
uv add <package>           # Add dependency
uv run python script.py    # Run script
uv sync                    # Sync dependencies
```

### Node.js
```bash
npm init -y                # Initialize project
npm install <package>      # Add dependency
```

### Go
```bash
go mod init <module>       # Initialize module
go mod tidy                # Tidy dependencies
go run .                   # Run
```

### Rust
```bash
cargo init                 # Initialize project
cargo add <crate>          # Add dependency
cargo run                  # Run
```
