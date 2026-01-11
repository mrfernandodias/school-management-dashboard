'use server';

import {
  ClassSchemaFormData,
  ExamSchemaFormData,
  StudentSchemaFormData,
  SubjectSchemaFormData,
  TeacherSchemaFormData,
} from '@/lib/formValidationSchemas';
import prisma from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';
import { currentUser } from '@/lib/utils';

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (currentState: CurrentState, data: SubjectSchemaFormData) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers?.map(teacherId => ({ id: teacherId })) || [],
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (currentState: CurrentState, data: SubjectSchemaFormData) => {
  try {
    if (!data.id) {
      console.error('updateSubject: id is missing');
      return { success: false, error: true };
    }

    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers?.map(teacherId => ({ id: teacherId })) || [],
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await prisma.subject.delete({
      where: { id: parseInt(id) },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createClass = async (currentState: CurrentState, data: ClassSchemaFormData) => {
  try {
    await prisma.class.create({
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState: CurrentState, data: ClassSchemaFormData) => {
  try {
    if (!data.id) {
      console.error('updateClass: id is missing');
      return { success: false, error: true };
    }

    await prisma.class.update({
      where: { id: data.id },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createTeacher = async (currentState: CurrentState, data: TeacherSchemaFormData) => {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        email: data.email || '',
        name: data.name,
        surname: data.surname,
        phone: data.phone || null,
        address: data.address || null,
        bloodType: data.bloodType || '',
        birthday: data.birthday,
        gender: data.gender,
        img: data.img || null,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) })) || [],
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchemaFormData) => {
  try {
    if (!data.id) {
      console.error('updateTeacher: id is missing');
      return { success: false, error: true };
    }

    const { id, subjects, password, ...teacherData } = data;

    // Atualiza o usuário no Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUser(id, {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      // Só atualiza o password se foi informado
      ...(password && password.length > 0 && { password }),
    });

    // Atualiza o professor no banco
    await prisma.teacher.update({
      where: { id },
      data: {
        ...teacherData,
        email: data.email || '',
        phone: data.phone || null,
        address: data.address || null,
        bloodType: data.bloodType || '',
        img: data.img || null,
        subjects: {
          set: subjects?.map((subjectId: string) => ({ id: parseInt(subjectId) })) || [],
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.teacher.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};
export const createStudent = async (currentState: CurrentState, data: StudentSchemaFormData) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (!classItem || classItem._count.students >= classItem.capacity) {
      return { success: false, error: true };
    }

    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        email: data.email || '',
        name: data.name,
        surname: data.surname,
        phone: data.phone || null,
        address: data.address || null,
        bloodType: data.bloodType || '',
        birthday: data.birthday,
        gender: data.gender,
        img: data.img || null,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateStudent = async (currentState: CurrentState, data: StudentSchemaFormData) => {
  try {
    if (!data.id) {
      console.error('updateStudent: id is missing');
      return { success: false, error: true };
    }

    const { id, password, ...studentData } = data;

    // Atualiza o usuário no Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUser(id, {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      // Só atualiza o password se foi informado
      ...(password && password.length > 0 && { password }),
    });

    // Atualiza o professor no banco
    await prisma.student.update({
      where: { id },
      data: {
        ...studentData,
        email: data.email || '',
        phone: data.phone || null,
        address: data.address || null,
        bloodType: data.bloodType || '',
        img: data.img || null,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;
  try {
    const clerk = await clerkClient();
    await clerk.users.deleteUser(id);

    await prisma.student.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const createExam = async (currentState: CurrentState, data: ExamSchemaFormData) => {
  const { role, userId } = await currentUser();

  try {
    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState: CurrentState, data: ExamSchemaFormData) => {
  const { role, userId } = await currentUser();

  try {
    if (!data.id) {
      console.error('updateExam: id is missing');
      return { success: false, error: true };
    }

    if (role === 'teacher') {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = data.get('id') as string;

  const { role, userId } = await currentUser();

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === 'teacher' ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};
