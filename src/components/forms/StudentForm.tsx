'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { studentSchema, StudentSchemaFormData } from '@/lib/formValidationSchemas';
import { useFormState } from 'react-dom';
import { createStudent, updateStudent } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';

const StudentForm = ({
  type,
  data,
  relatedData,
  setOpen,
}: {
  type: 'create' | 'update';
  data?: any;
  relatedData?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // Transforma os dados para o formato esperado pelo formulário
  const defaultValues = data
    ? {
        ...data,
        birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
      }
    : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchemaFormData>({
    resolver: zodResolver(studentSchema) as unknown as Resolver<StudentSchemaFormData>,
    defaultValues,
  });

  const [img, setImg] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [state, formAction] = useFormState(type === 'create' ? createStudent : updateStudent, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit(
    data => {
      console.log('Form data:', data);
      setLoading(true);
      // Usa a nova imagem se fez upload, senão mantém a existente
      const imgUrl = img?.secure_url || data.img || null;
      formAction({ ...data, img: imgUrl });
    },
    errors => {
      console.log('Validation errors:', errors);
    }
  );

  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      setLoading(false);
    }
  }, [state]);

  const { grades, classes } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Create' : 'Update'} Student</h1>
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap gap-4">
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
        <InputField
          label="Username"
          type="text"
          register={register}
          name="username"
          error={errors.username}
        />
        <InputField
          label="Email"
          type="email"
          register={register}
          name="email"
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          register={register}
          name="password"
          error={errors.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <CldUploadWidget
        uploadPreset="school"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div
              className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
              onClick={() => open()}
            >
              <Image src="/upload.png" alt="Upload" width={28} height={28} draggable={false} />
              <span>Upload a photo</span>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          type="text"
          register={register}
          name="name"
          error={errors.name}
        />
        <InputField
          label="Last Name"
          type="text"
          register={register}
          name="surname"
          error={errors.surname}
        />
        <InputField
          label="Phone"
          type="text"
          register={register}
          name="phone"
          error={errors.phone}
        />
        <InputField
          label="Address"
          type="text"
          register={register}
          name="address"
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          type="text"
          register={register}
          name="bloodType"
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          type="date"
          register={register}
          name="birthday"
          error={errors.birthday}
        />
        <InputField
          label="Parent Id"
          type="text"
          register={register}
          name="parentId"
          error={errors.parentId}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('gender')}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.gender?.message && (
            <p className="text-red-600 text-xs">{errors.gender.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grades</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('gradeId')}
          >
            <option value="" disabled>
              Select grades
            </option>
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-red-600 text-xs">{errors.gradeId.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grades</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('classId')}
          >
            <option value="" disabled>
              Select classes
            </option>
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name} - {classItem._count.students + '/' + classItem.capacity} Capacity
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-red-600 text-xs">{errors.classId.message.toString()}</p>
          )}
        </div>
      </div>
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-400 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default StudentForm;
