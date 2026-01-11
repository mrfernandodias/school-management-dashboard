# School Management Dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/dashboard_ui)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://school-management-dashboard-theta.vercel.app)

🔗 **Live Demo
**: [https://school-management-dashboard-theta.vercel.app](https://school-management-dashboard-theta.vercel.app)

A full-stack school management system built with Next.js 14, Prisma, PostgreSQL, and Clerk authentication. Features
role-based dashboards for administrators, teachers, students, and parents.
role-based dashboards for administrators, teachers, students, and parents.

## Overview

This application provides a comprehensive school management solution with dedicated interfaces for different user roles.
The system includes student/teacher management, class scheduling, attendance tracking, performance analytics, and full
CRUD operations with Server Actions.

## Features

### Role-Based Dashboards

- **Admin Dashboard**: Complete system overview with analytics, charts, and management tools
- **Teacher Dashboard**: Class schedules, student lists, and exam management
- **Student Dashboard**: Personal schedule, grades, assignments, and announcements
- **Parent Dashboard**: Child's academic schedule and school communications

### Core Functionality

- **User Management**: Full CRUD operations for teachers, students, parents, and classes
- **Schedule Management**: Interactive calendar with class scheduling using react-big-calendar
- **Performance Analytics**: Animated charts and visualizations with Recharts
- **Attendance Tracking**: Real-time attendance monitoring with weekly charts
- **Exam & Assignment Management**: Create, update, and delete exams and assignments
- **Event Calendar**: Interactive calendar with events filtered by user role
- **Announcements**: Role-based announcements system
- **Image Upload**: Cloudinary integration for profile photos
- **Form Validation**: Type-safe forms with react-hook-form and Zod
- **Authentication**: Clerk authentication with role-based access control
- **Route Protection**: Middleware-based route protection by user role

### Technical Highlights

- Fully responsive design (mobile-first approach)
- Server and Client Components (Next.js 14 App Router)
- Server Actions for data mutations
- Type-safe with TypeScript
- Prisma ORM with PostgreSQL
- Role-based data fetching and mutations
- Dynamic imports and code splitting
- Custom Tailwind CSS theme
- Reusable component architecture

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Calendars**: react-big-calendar, react-calendar
- **Forms**: react-hook-form with Zod validation
- **Notifications**: react-toastify
- **Image Upload**: Cloudinary (next-cloudinary)
- **Date Management**: Moment.js

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Docker (for PostgreSQL)
- Clerk account (for authentication)
- Cloudinary account (for image uploads)

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

3. Set up environment variables:

```bash
cp .env.example .env
```

Configure the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/school_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
```

4. Start PostgreSQL with Docker:

```bash
docker run --name school-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=school_db -p 5432:5432 -d postgres
```

5. Run Prisma migrations:

```bash
npx prisma migrate dev
```

6. Seed the database:

```bash
npx prisma db seed
```

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Users (Seeded)

| Role    | Username | Password |
|---------|----------|----------|
| Admin   | admin    | admin    |
| Teacher | teacher  | teacher  |
| Student | student  | student  |
| Parent  | parent   | parent   |

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashboard_ui/
├── public/                 # Static assets (images, icons)
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seeder
│   └── migrations/        # Prisma migrations
├── src/
│   ├── app/               # Next.js 14 App Router pages
│   │   ├── (dashboard)/
│   │   │   ├── admin/     # Admin dashboard
│   │   │   ├── teacher/   # Teacher dashboard
│   │   │   ├── student/   # Student dashboard
│   │   │   ├── parent/    # Parent dashboard
│   │   │   └── list/      # CRUD list pages
│   │   │       ├── teachers/
│   │   │       ├── students/
│   │   │       ├── classes/
│   │   │       ├── subjects/
│   │   │       ├── exams/
│   │   │       ├── assignments/
│   │   │       ├── results/
│   │   │       ├── events/
│   │   │       └── announcements/
│   │   ├── [[...sign-in]]/ # Clerk sign-in page
│   │   └── globals.css
│   ├── components/         # Reusable React components
│   │   ├── forms/         # Form components with validation
│   │   │   ├── TeacherForm.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   ├── SubjectForm.tsx
│   │   │   ├── ClassForm.tsx
│   │   │   └── ExamForm.tsx
│   │   ├── BigCalendar.tsx
│   │   ├── BigCalendarContainer.tsx
│   │   ├── FormModal.tsx
│   │   ├── FormContainer.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── actions.ts     # Server Actions (CRUD operations)
│   │   ├── prisma.ts      # Prisma client
│   │   ├── utils.ts       # Utility functions
│   │   ├── formValidationSchemas.ts # Zod schemas
│   │   └── settings.ts    # App settings
│   └── middleware.ts      # Route protection middleware
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Database Schema

The application uses the following main entities:

- **Admin**: System administrators
- **Teacher**: Teachers with subjects and lessons
- **Student**: Students enrolled in classes
- **Parent**: Parents linked to students
- **Grade**: Grade levels (1-6)
- **Class**: Classes with capacity and supervisor
- **Subject**: Academic subjects
- **Lesson**: Scheduled lessons
- **Exam**: Exams linked to lessons
- **Assignment**: Assignments linked to lessons
- **Result**: Student results for exams/assignments
- **Attendance**: Daily attendance records
- **Event**: School events
- **Announcement**: Announcements for classes

## Key Components

### BigCalendarContainer

Server component that fetches lesson data based on user role and renders the interactive calendar.

### FormContainer

Server component that fetches related data for forms (teachers, subjects, grades, etc.) based on entity type.

### FormModal

Client component with dynamic form loading using `next/dynamic` for optimal performance.

### Table

Reusable table component with built-in pagination, search, and custom row rendering.

### Charts

- **CountChart**: Radial bar chart for student demographics (male/female)
- **AttendanceChart**: Bar chart for weekly attendance tracking
- **FinanceChart**: Line chart for financial analytics
- **Performance**: Semi-circular gauge chart

## Server Actions

All data mutations are handled through Server Actions in `src/lib/actions.ts`:

- `createTeacher`, `updateTeacher`, `deleteTeacher`
- `createStudent`, `updateStudent`, `deleteStudent`
- `createSubject`, `updateSubject`, `deleteSubject`
- `createClass`, `updateClass`, `deleteClass`
- `createExam`, `updateExam`, `deleteExam`

## Form Validation

Forms use Zod schemas for type-safe validation:

```typescript
export const teacherSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(1),
  surname: z.string().min(1),
  // ...
});

export type TeacherSchemaFormData = z.infer<typeof teacherSchema>;
```

## Role-Based Access Control

Routes and data are protected based on user roles defined in Clerk:

```typescript
// middleware.ts - Route protection
const roleRoutes: Record<string, string[]> = {
  admin: ['/admin', '/list/teachers', '/list/students', ...],
  teacher: ['/teacher', '/list/exams', ...],
  student: ['/student', ...],
  parent: ['/parent', ...],
};
```

## Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
npm run restart       # Kill port 3000 and restart dev server
```

## Commit Convention

This project follows Conventional Commits:

- `feat:` New features
- `fix:` Bug fixes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `docs:` Documentation updates

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Acknowledgments

Based on the tutorial by [Lama Dev](https://www.youtube.com/@LamaDev) - Full-Stack School Management Dashboard with
Next.js, Prisma, PostgreSQL & Clerk.

---

Built with ❤️ using Next.js, Prisma, and Tailwind CSS

