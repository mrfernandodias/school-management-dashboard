import { auth } from '@clerk/nextjs/server';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

/**
 * Retorna os dados do usuário autenticado.
 * Deve ser chamada em Server Components ou API Routes.
 *
 * @example
 * const { userId, role } = await currentUser();
 */
export const currentUser = async () => {
  const { userId, sessionClaims } = await auth();

  const role =
    (sessionClaims?.metadata as { role?: string })?.role ||
    (sessionClaims?.publicMetadata as { role?: string })?.role;

  return {
    userId,
    role: role as UserRole | undefined,
    sessionClaims,
  };
};

/**
 * Atalho para obter apenas a role do usuário.
 *
 * @example
 * const role = await currentUserRole();
 */
export const currentUserRole = async () => {
  const { role } = await currentUser();
  return role;
};

/**
 * Atalho para obter apenas o userId.
 *
 * @example
 * const userId = await currentUserId();
 */
export const currentUserId = async () => {
  const { userId } = await currentUser();
  return userId;
};
