'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import type { Resolver } from 'react-hook-form';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { createClass, updateClass } from '@/lib/actions';
import { classSchema, ClassSchemaFormData } from '@/lib/formValidationSchemas';
import InputField from '../InputField';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: ClassSchemaFormData;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchemaFormData>({
    resolver: zodResolver(classSchema) as unknown as Resolver<ClassSchemaFormData>,
    defaultValues: data,
  });

  const [state, formAction] = useFormState(type === 'create' ? createClass : updateClass, {
    success: false,
    error: false,
  });

  const onSubmit: SubmitHandler<ClassSchemaFormData> = formData => {
    formAction(formData);
  };

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData || { teachers: [], grades: [] };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new Class' : 'Update Class'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors.name}
        />

        <InputField
          label="Capacity"
          type="text"
          register={register}
          name="capacity"
          defaultValue={String(data?.capacity ?? '')}
          error={errors.capacity}
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
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('supervisorId')}
            defaultValue={data?.supervisorId ?? ''}
          >
            <option value={''}>— Select —</option>
            {teachers?.map((teacher: { id: string; name: string; surname: string }) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name + ' ' + teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-red-600 text-xs">{errors.supervisorId.message.toString()}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gradeId')}
            defaultValue={data?.gradeId ? String(data.gradeId) : ''}
          >
            <option value={''}>— Select —</option>
            {grades?.map((grade: { id: number; level: number }) => (
              <option value={String(grade.id)} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-red-600 text-xs">{errors.gradeId.message.toString()}</p>
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

export default ClassForm;
