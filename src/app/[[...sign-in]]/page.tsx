'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata?.role as string | undefined;

    if (isLoaded && isSignedIn && role) {
      router.push(`/${role}`);
    }
  }, [user, router, isLoaded, isSignedIn]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        <SignIn.Step name="start" className="bg-white p-12 rounded-md flex flex-col gap-2">
          <h1 className="text-xl font-bold flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="Lama Dev Logo" width={24} height={24} />
            FDS School
          </h1>
          <h2 className="text-gray-400 text-center">Sign in to your account</h2>

          <Clerk.GlobalError className="text-red-400 text-sm" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">Username</Clerk.Label>
            <Clerk.Input type="text" required className="p-2 rounded-md ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
            <Clerk.Input type="password" required className="p-2 rounded-md ring-1 ring-gray-300" />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>
          <Clerk.Loading>
            {isLoading => (
              <SignIn.Action
                submit
                disabled={isLoading || isSignedIn}
                className={`bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] flex items-center justify-center gap-2 transition-all
                  ${isLoading || isSignedIn ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'}`}
              >
                {isLoading || isSignedIn ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {isSignedIn ? 'Redirecting...' : 'Signing in...'}
                  </>
                ) : (
                  'Sign In'
                )}
              </SignIn.Action>
            )}
          </Clerk.Loading>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
