'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { createExam, updateExam } from '@/lib/actions';
import { examSchema, ExamSchemaFormData } from '@/lib/formValidationSchemas';
import InputField from '../InputField';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchemaFormData>({
    resolver: zodResolver(examSchema) as unknown as Resolver<ExamSchemaFormData>,
  });

  const [state, formAction] = useFormState(type === 'create' ? createExam : updateExam, {
    success: false,
    error: false,
  });

  const onSubmit: SubmitHandler<ExamSchemaFormData> = formData => {
    formAction(formData);
  };

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new Exam' : 'Update Exam'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam Title"
          type="text"
          register={register}
          name="title"
          defaultValue={data?.title}
          error={errors.title}
        />
        <InputField
          label="Start Date"
          type="datetime-local"
          register={register}
          name="startTime"
          defaultValue={data?.startTime?.toISOString().slice(0, 16)}
          error={errors.startTime}
        />
        <InputField
          label="End Date"
          type="datetime-local"
          register={register}
          name="endTime"
          defaultValue={data?.endTime?.toISOString().slice(0, 16)}
          error={errors.endTime}
        />

        {data && (
          <InputField
            label="Id"
            type="text"
            register={register}
            name="id"
            defaultValue={String(data?.id ?? '')}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('lessonId')}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-red-600 text-xs">{errors.lessonId.message.toString()}</p>
          )}
        </div>
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ExamForm;
