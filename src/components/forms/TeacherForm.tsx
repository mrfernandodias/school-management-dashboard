'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import InputField from '../InputField';
import Image from 'next/image';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  address: z.string().max(200, 'Address must be at most 200 characters long').optional(),
  bloodType: z.string().max(1, 'Blood type must be at most 1 character long').optional(),

  birthday: z.string().min(1, 'Birthday is required'), // string porque vem do input
  gender: z.enum(['male', 'female', 'other'], { message: 'Gender is required' }),
  img: z.instanceof(File).optional(), // opcional por enquanto
});

type FormData = z.infer<typeof schema>;

const TeacherForm = ({ type, data }: { type: 'create' | 'update'; data?: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data, // ← Preenche os campos quando mode="update"
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">Create a new Teacher</h1>
      <span className="text-xs text-gray-400 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap gap-4">
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
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          type="text"
          register={register}
          name="firstName"
          error={errors.firstName}
        />
        <InputField
          label="Last Name"
          type="text"
          register={register}
          name="lastName"
          error={errors.lastName}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-none focus:ring-lamaSky transition-all"
            {...register('gender')}
            defaultValue={data?.gender || ''}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender?.message && (
            <p className="text-red-600 text-xs">{errors.gender.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="Upload" width={28} height={28} draggable={false} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" className="hidden" {...register('img')} />
          {errors.img?.message && (
            <p className="text-red-600 text-xs">{errors.img.message.toString()}</p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default TeacherForm;
