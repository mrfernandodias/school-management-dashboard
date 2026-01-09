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

/**
 * Calcula o início (segunda) e fim (sexta) da semana de trabalho atual.
 * Útil para filtrar dados do calendário e queries.
 *
 * @example
 * const { startOfWeek, endOfWeek } = currentWorkWeek();
 * // startOfWeek = Segunda-feira 00:00:00
 * // endOfWeek = Sexta-feira 23:59:59
 */
const currentWorkWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb

  const startOfWeek = new Date(today);

  if (dayOfWeek === 0) {
    // Domingo: próxima segunda é amanhã
    startOfWeek.setDate(today.getDate() + 1);
  } else if (dayOfWeek === 6) {
    // Sábado: próxima segunda é daqui 2 dias
    startOfWeek.setDate(today.getDate() + 2);
  } else {
    // Dia útil: volta para segunda desta semana
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
  }

  // Zerar horário do início da semana
  startOfWeek.setHours(0, 0, 0, 0);

  // Fim da semana = sexta-feira (4 dias após segunda)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

/**
 * Ajusta aulas de qualquer data para a semana de trabalho atual.
 * Mantém o dia da semana e horário originais, apenas muda a data.
 *
 * Útil para o BigCalendar em modo "Work Week" que só mostra a semana atual.
 *
 * @example
 * // Aula de 06/01/2025 (segunda 8h) -> 05/01/2026 (segunda atual 8h)
 * const adjusted = adjustScheduleToCurrentWeek(lessons);
 */
export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const { startOfWeek } = currentWorkWeek();

  return lessons.map(lesson => {
    // Descobre qual dia da semana era a aula original (0=Dom, 1=Seg, ..., 6=Sab)
    const lessonDayOfWeek = lesson.start.getDay();

    // Converte para "dias desde segunda" (Seg=0, Ter=1, Qua=2, Qui=3, Sex=4, Sab=5, Dom=6)
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    // Cria nova data na semana atual, no mesmo dia da semana
    const adjustedStartDate = new Date(startOfWeek);
    adjustedStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
    // Aplica o horário original de início
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
      lesson.start.getMilliseconds()
    );

    // Cria data de fim com o horário original de término
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
      lesson.end.getMilliseconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
