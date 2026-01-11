'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FormContainerProps } from '@/components/FormContainer';

type DeleteAction = (
  currentState: { success: boolean; error: boolean },
  data: FormData
) => Promise<{ success: boolean; error: boolean }>;

const deleteActionMap: { [key: string]: DeleteAction } = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  // Adicionar outras actions conforme implementar:
  // teacher: deleteTeacher,
  // student: deleteStudent,
  // etc.
};

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
  loading: () => <p>Loading...</p>,
});
const StudentForm = dynamic(() => import('./forms/StudentForm'), {
  loading: () => <p>Loading...</p>,
});
const SubjectForm = dynamic(() => import('./forms/SubjectForm'), {
  loading: () => <p>Loading...</p>,
});
const ClassForm = dynamic(() => import('./forms/ClassForm'), {
  loading: () => <p>Loading...</p>,
});

const ExamForm = dynamic(() => import('./forms/ExamForm'), {
  loading: () => <p>Loading...</p>,
});

const forms: {
  [key: string]: (
    type: 'create' | 'update',
    setOpen: Dispatch<SetStateAction<boolean>>,
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  teacher: (type, setOpen, data, relatedData) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  student: (type, setOpen, data, relatedData) => (
    <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  subject: (type, setOpen, data, relatedData) => (
    <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  class: (type, setOpen, data, relatedData) => (
    <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  exam: (type, setOpen, data, relatedData) => (
    <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
  const bgColor =
    type === 'create' ? 'bg-lamaYellow' : type === 'update' ? 'bg-lamaSky' : 'bg-lamaPurple';

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();
    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted`);
        setOpen(false);
        router.refresh();
      }
    }, [state]);

    return type === 'delete' && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input name="id" value={id} type="text | number" hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 cursor-pointer border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === 'create' || type === 'update' ? (
      forms[table] ? (
        forms[table](type, setOpen, data, relatedData)
      ) : (
        <div className="p-4 text-center text-gray-500">{table} form coming soon...</div>
      )
    ) : (
      'Form not found'
    );
  };

  return (
    <>
      <button
        className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={`/${type}.png`}
          alt={type}
          width={16}
          height={16}
          draggable={false}
          className="select-none"
        />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div
            className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"
            onClick={e => e.stopPropagation()}
          >
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/close.png" alt="close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
