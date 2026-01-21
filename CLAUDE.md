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

## Taskfile Integration

When creating a new application in this repository, ALWAYS add corresponding tasks to `Taskfile.yml`:

1. Add a variable for the app directory:
   ```yaml
   vars:
     APP_NAME_DIR: ./app-name
   ```

2. Add a task section with standard commands:
   ```yaml
   # ============================================================
   # App Name (Framework)
   # ============================================================

   app-name:dev:
     desc: Start app-name dev server
     dir: '{{.APP_NAME_DIR}}'
     cmds:
       - npm run dev  # or appropriate command

   app-name:build:
     desc: Build app-name
     dir: '{{.APP_NAME_DIR}}'
     cmds:
       - npm run build

   app-name:install:
     desc: Install app-name dependencies
     dir: '{{.APP_NAME_DIR}}'
     cmds:
       - npm install
   ```

3. Add to aggregated tasks (`install`, `build`, `lint`):
   ```yaml
   install:
     cmds:
       - task: app-name:install
   ```

This allows easy management with:
- `task app-name:dev` - Start dev server
- `task app-name:build` - Build the app
- `task install` - Install all dependencies

## Console Integration

Vibebox has a central console (`./console`) that manages all applications. When creating a new app, integrate it with the console:

### Port Assignments

| App | Port |
|-----|------|
| console | 3000 |
| translator | 3001 |
| timer | 3002 |
| pdf2md-ui | 3003 |
| pdf2md-api | 8000 |

**Always assign a unique port** to new apps and update this table.

### Register in Console

1. Add app config to `console/lib/app-registry.ts`:
   ```typescript
   {
     id: "app-name",
     name: "App Name",
     description: "Description of the app",
     port: 300X,  // Assign next available port
     directory: "../app-name",
     command: "npm",
     args: ["run", "dev", "--", "-p", "300X"],
     icon: "document",  // translate | clock | document | server
     color: "#10b981",  // Unique color for the app
   }
   ```

2. Add navigation link to `console/components/Sidebar.tsx`:
   ```typescript
   { href: "/apps/app-name", label: "App Name", icon: DocumentIcon },
   ```

3. Update Taskfile port in dev task:
   ```yaml
   app-name:dev:
     desc: Start app-name dev server (port 300X)
     cmds:
       - npm run dev -- -p 300X
   ```

### CORS for Backend APIs

If the new app has a backend API, add console's port to CORS origins:
```python
# Python (FastAPI)
allow_origins=[
    "http://localhost:3000",  # console
    "http://localhost:300X",  # your app
]
```

### Starting the Console

```bash
task console:dev    # Development mode
task console:start  # Production mode (after build)
```

Access at http://localhost:3000 to manage all apps.

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
