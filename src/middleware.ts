import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { routeAccessMap } from '@/lib/settings';

/**
 * Cria um array de matchers baseado no mapa de acesso às rotas.
 * Cada matcher contém:
 * - matcher: função que verifica se a URL corresponde ao padrão da rota
 * - allowedRoles: array de roles que têm permissão para acessar essa rota
 */
const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

/**
 * Middleware de autenticação do Clerk.
 * Executado em todas as requisições para verificar permissões de acesso.
 */
export default clerkMiddleware(async (auth, req) => {
  // Obtém os claims da sessão do usuário autenticado
  // auth() retorna uma Promise (versões recentes do Clerk), por isso usamos await
  const { sessionClaims } = await auth();

  // Extrai a role do usuário dos metadados da sessão
  // A role pode estar em 'metadata' ou 'publicMetadata' dependendo da configuração do Clerk
  // - metadata: dados privados definidos via API/Dashboard
  // - publicMetadata: dados públicos acessíveis no cliente
  const role =
    (sessionClaims?.metadata as { role?: string })?.role ||
    (sessionClaims?.publicMetadata as { role?: string })?.role;

  // Se o usuário não tem role definida, permite acesso (ex: página de login)
  // Isso evita redirecionamento para /undefined
  if (!role) {
    return;
  }

  // Verifica cada rota protegida
  for (const { matcher, allowedRoles } of matchers) {
    // Se a URL atual corresponde ao padrão E a role do usuário NÃO está na lista de permitidos
    if (matcher(req) && !allowedRoles.includes(role)) {
      // Redireciona o usuário para sua página inicial baseada na role
      // Ex: teacher tentando acessar /admin será redirecionado para /teacher
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

/**
 * Configuração do middleware - define quais rotas o middleware deve processar.
 * Exclui arquivos estáticos e internos do Next.js para melhor performance.
 */
export const config = {
  matcher: [
    // Ignora internals do Next.js e arquivos estáticos (imagens, css, js, fontes, etc)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Sempre executa para rotas de API
    '/(api|trpc)(.*)',
  ],
};
