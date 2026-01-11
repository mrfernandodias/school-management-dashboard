import { z } from 'zod';

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(1, 'Subject name is required!')
    .max(20, 'Subject name must be at most 20 characters long'),
  teachers: z.array(z.string()).optional(),
});

// Tipo de OUTPUT (após validação/coerção) - usado nas actions
export type SubjectSchemaFormData = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(1, 'Subject name is required!')
    .max(20, 'Subject name must be at most 20 characters long'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  gradeId: z.coerce.number().min(1, 'Grade is required'),
  supervisorId: z.coerce.string().optional(),
});

// Tipo de OUTPUT (após validação/coerção) - usado nas actions
export type ClassSchemaFormData = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .optional()
    .or(z.literal('')),
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200, 'Address must be at most 200 characters long').optional(),
  bloodType: z.string().min(1, 'Blood type must be at most 1 character long').optional(),

  birthday: z.coerce.date({ message: 'Birthday is required' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  img: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherSchemaFormData = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long')
    .optional()
    .or(z.literal('')),
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200, 'Address must be at most 200 characters long').optional(),
  bloodType: z.string().min(1, 'Blood type must be at most 1 character long').optional(),

  birthday: z.coerce.date({ message: 'Birthday is required' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { message: 'Gender is required' }),
  img: z.string().optional().nullable(),
  gradeId: z.coerce.number().min(1, 'Grade is required'),
  classId: z.coerce.number().min(1, 'Class is required'),
  parentId: z.string().min(1, 'Parent Id is required'),
});

export type StudentSchemaFormData = z.infer<typeof studentSchema>;
