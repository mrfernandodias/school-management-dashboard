'use client';
import { useState } from 'react';

type AnnouncementType = 'urgent' | 'important' | 'info' | 'event';

type Announcement = {
  id: number;
  title: string;
  date: string;
  description: string;
  type: AnnouncementType;
  link?: string;
};

const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Período de Matrículas Abertas',
    date: '2025-01-15',
    description:
      'As matrículas para o próximo semestre estão abertas até 31 de janeiro. Não perca o prazo! Acesse o portal do aluno para realizar sua matrícula e garantir sua vaga nas disciplinas desejadas.',
    type: 'urgent',
    link: '#',
  },
  {
    id: 2,
    title: 'Atualização no Sistema de Notas',
    date: '2025-01-10',
    description:
      'O sistema de notas passará por manutenção no dia 20/01 das 8h às 12h. Durante este período, o acesso ao sistema estará temporariamente indisponível.',
    type: 'important',
    link: '#',
  },
  {
    id: 3,
    title: 'Evento de Integração',
    date: '2025-01-05',
    description:
      'Participe do evento de integração entre alunos e professores no dia 25/01. Será uma ótima oportunidade para networking e conhecer melhor a comunidade acadêmica.',
    type: 'event',
  },
];

const Announcements = () => {
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>([]);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState<number[]>([]);

  const toggleRead = (id: number) => {
    setReadAnnouncements(prev =>
      prev.includes(id) ? prev.filter(announcementId => announcementId !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: number) => {
    setExpandedAnnouncements(prev =>
      prev.includes(id) ? prev.filter(announcementId => announcementId !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type: AnnouncementType) => {
    const colors = {
      urgent: 'bg-red-100 border-l-red-500',
      important: 'bg-orange-100 border-l-orange-500',
      info: 'bg-blue-100 border-l-blue-500',
      event: 'bg-purple-100 border-l-purple-500',
    };
    return colors[type];
  };

  const getTypeBadge = (type: AnnouncementType) => {
    const badges = {
      urgent: { color: 'bg-red-500', text: 'Urgente' },
      important: { color: 'bg-orange-500', text: 'Importante' },
      info: { color: 'bg-blue-500', text: 'Info' },
      event: { color: 'bg-purple-500', text: 'Evento' },
    };
    return badges[type];
  };

  const getTypeIcon = (type: AnnouncementType) => {
    const icons = {
      urgent: '⚠️',
      important: '📢',
      info: 'ℹ️',
      event: '🎉',
    };
    return icons[type];
  };

  const unreadCount = announcements.length - readAnnouncements.length;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Announcements</h1>
          {unreadCount > 0 && (
            <span className="bg-lamaSky text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View All</span>
      </div>

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <span className="text-4xl mb-2">📭</span>
          <p className="text-sm">Nenhum anúncio no momento</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((announcement, index) => {
            const isRead = readAnnouncements.includes(announcement.id);
            const isExpanded = expandedAnnouncements.includes(announcement.id);
            const badge = getTypeBadge(announcement.type);

            return (
              <div
                key={announcement.id}
                className={`rounded-md p-4 border-l-4 transition-all duration-300 ${getTypeColor(announcement.type)} ${
                  isRead ? 'opacity-60' : 'opacity-100'
                } hover:shadow-md animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-xl">{getTypeIcon(announcement.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className={`font-medium ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {announcement.title}
                        </h2>
                        <span
                          className={`text-xs text-white px-2 py-0.5 rounded-full ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md whitespace-nowrap">
                      {new Date(announcement.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    <button
                      onClick={() => toggleRead(announcement.id)}
                      className={`text-xs px-2 py-1 rounded-md transition-colors ${
                        isRead
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isRead ? '✓ Lido' : 'Marcar lido'}
                    </button>
                  </div>
                </div>

                <p className={`text-sm ${isRead ? 'text-gray-400' : 'text-gray-500'} mb-2 ml-8`}>
                  {isExpanded
                    ? announcement.description
                    : truncateText(announcement.description, 80)}
                </p>

                <div className="flex items-center gap-3 ml-8">
                  {announcement.description.length > 80 && (
                    <button
                      onClick={() => toggleExpand(announcement.id)}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                    >
                      {isExpanded ? '▲ Ver menos' : '▼ Ver mais'}
                    </button>
                  )}
                  {announcement.link && (
                    <a
                      href={announcement.link}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Saiba mais →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Announcements;
