import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Subject badge colors - background
    'bg-blue-100',
    'bg-indigo-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-green-100',
    'bg-amber-100',
    'bg-teal-100',
    'bg-sky-100',
    'bg-orange-100',
    'bg-violet-100',
    'bg-fuchsia-100',
    'bg-rose-100',
    'bg-emerald-100',
    'bg-lime-100',
    'bg-gray-100',
    // Subject badge colors - text
    'text-blue-700',
    'text-indigo-700',
    'text-purple-700',
    'text-pink-700',
    'text-green-700',
    'text-amber-700',
    'text-teal-700',
    'text-sky-700',
    'text-orange-700',
    'text-violet-700',
    'text-fuchsia-700',
    'text-rose-700',
    'text-emerald-700',
    'text-lime-700',
    'text-gray-700',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        lamaSky: '#C3EBFA',
        lamaSkyLight: '#EDF9FD',
        lamaPurple: '#CFCEFF',
        lamaPurpleLight: '#F1F0FF',
        lamaYellow: '#FAE27C',
        lamaYellowLight: '#FEFCE8',
      },
    },
  },
  plugins: [],
};
export default config;
