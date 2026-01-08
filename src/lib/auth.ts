import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * Camada de abstração para autenticação.
 * Centraliza a lógica de obtenção de dados do usuário autenticado.
 *
 * Benefícios:
 * - Facilita migração futura para outro provider de autenticação
 * - Código mais limpo e reutilizável nos componentes
 * - Tipagem centralizada
 */

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface AuthUser {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  imageUrl: string | null;
  role: UserRole | null;
}

/**
 * Obtém a role do usuário autenticado a partir dos claims da sessão.
 * Uso em Server Components e API Routes.
 *
 * @example
 * const role = await getRole();
 * if (role === 'admin') { ... }
 */
export async function getRole(): Promise<UserRole | null> {
  const { sessionClaims } = await auth();

  const role =
    (sessionClaims?.metadata as { role?: string })?.role ||
    (sessionClaims?.publicMetadata as { role?: string })?.role;

  return (role as UserRole) || null;
}

/**
 * Obtém os dados completos do usuário autenticado.
 * Uso em Server Components quando precisa de mais informações além da role.
 *
 * @example
 * const user = await getCurrentUser();
 * console.log(user?.fullName, user?.role);
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const user = await currentUser();

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.primaryEmailAddress?.emailAddress || null,
    imageUrl: user.imageUrl,
    role: (user.publicMetadata?.role as UserRole) || null,
  };
}

/**
 * Obtém o ID do usuário autenticado.
 * Útil para queries no banco de dados.
 *
 * @example
 * const userId = await getUserId();
 * const data = await prisma.student.findUnique({ where: { clerkId: userId } });
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Verifica se o usuário está autenticado.
 *
 * @example
 * if (await isAuthenticated()) { ... }
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Verifica se o usuário tem uma das roles permitidas.
 *
 * @example
 * if (await hasRole(['admin', 'teacher'])) { ... }
 */
export async function hasRole(allowedRoles: UserRole[]): Promise<boolean> {
  const role = await getRole();
  return role ? allowedRoles.includes(role) : false;
}

