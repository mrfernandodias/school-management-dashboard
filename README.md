# School Management Dashboard

A modern, responsive school management system built with Next.js 14, featuring role-based dashboards for administrators, teachers, students, and parents.

## Overview

This application provides a comprehensive school management solution with dedicated interfaces for different user roles. The system includes student/teacher management, class scheduling, attendance tracking, performance analytics, and administrative tools.

## Features

### Role-Based Dashboards

- **Admin Dashboard**: Complete system overview with analytics and management tools
- **Teacher Dashboard**: Class schedules, student lists, and performance tracking
- **Student Dashboard**: Personal schedule, grades, and assignments
- **Parent Dashboard**: Child's academic performance and school communications

### Core Functionality

- **User Management**: CRUD operations for teachers, students, parents, and staff
- **Schedule Management**: Interactive calendar with class scheduling using react-big-calendar
- **Performance Analytics**: Animated charts and visualizations with Recharts
- **Attendance Tracking**: Real-time attendance monitoring and reporting
- **Responsive Tables**: Sortable, searchable tables with pagination
- **Form Validation**: Type-safe forms with react-hook-form and Zod
- **Modal Forms**: Dynamic form modals with lazy loading for optimal performance

### Technical Highlights

- Fully responsive design (mobile-first approach)
- Server and Client Components (Next.js 14 App Router)
- Type-safe with TypeScript
- Optimized with dynamic imports and code splitting
- Custom Tailwind CSS theme
- Reusable component architecture

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Calendars**: react-big-calendar, react-calendar
- **Forms**: react-hook-form with Zod validation
- **Icons**: Lucide React
- **Date Management**: Moment.js

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dashboard_ui
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashboard_ui/
├── public/              # Static assets (images, icons)
├── src/
│   ├── app/            # Next.js 14 App Router pages
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   ├── student/
│   │   │   ├── parent/
│   │   │   └── list/   # CRUD list pages
│   │   └── globals.css
│   ├── components/      # Reusable React components
│   │   ├── forms/      # Form components with validation
│   │   ├── BigCalendar.tsx
│   │   ├── FormModal.tsx
│   │   ├── Table.tsx
│   │   └── ...
│   └── lib/
│       └── data.ts     # Mock data and utilities
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Key Components

### BigCalendar

Interactive weekly/daily schedule view with class sessions, built with react-big-calendar.

### FormModal

Dynamic modal system that lazy-loads form components based on entity type (teacher, student, etc.) with create/update/delete operations.

### Table

Reusable table component with built-in pagination, search, and custom row rendering.

### Charts

- **CountChart**: Radial bar chart for student demographics
- **AttendanceChart**: Bar chart for attendance tracking
- **FinanceChart**: Line chart for financial analytics
- **Performance**: Semi-circular gauge chart

## Form Validation

Forms use a robust validation system:

- **react-hook-form**: Optimized form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration layer
- Type-safe with automatic TypeScript inference

Example:

```typescript
const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  // ...
});

type FormData = z.infer<typeof schema>;
```

## Performance Optimizations

- **Dynamic Imports**: Form components are lazy-loaded to reduce initial bundle size
- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Image Optimization**: Next.js Image component with remote patterns
- **Minimal Re-renders**: Optimized state management with react-hook-form

## Roadmap

### Upcoming Features

- [ ] Backend API integration
- [ ] Authentication system (NextAuth.js)
- [ ] Database integration (Prisma + PostgreSQL)
- [ ] Real-time notifications
- [ ] File upload system
- [ ] Advanced filtering and export options
- [ ] Mobile app version
- [ ] Dark mode support

## Development

### Code Quality

```bash
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```

### Commit Convention

This project follows Conventional Commits:

- `feat:` New features
- `fix:` Bug fixes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `docs:` Documentation updates

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Acknowledgments

Based on the tutorial by Lama Dev - React Next.js School Management Dashboard Tutorial

---

Built with Next.js and Tailwind CSS
