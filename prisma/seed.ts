import { DayOfWeek, PrismaClient, UserGender } from '@prisma/client';

const prisma = new PrismaClient();

// Helper para criar datas na semana atual
const getDateForDay = (dayOffset: number, hour: number = 8, minute: number = 0) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Quantos dias desde segunda

  // Criar data para a segunda-feira desta semana
  const targetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  targetDate.setDate(targetDate.getDate() - daysFromMonday + dayOffset);
  targetDate.setHours(hour, minute, 0, 0);

  return targetDate;
};

// Helper para criar datas em um período mais amplo (para eventos e announcements)
// weekOffset: -1 = semana passada, 0 = semana atual, 1 = próxima semana, etc.
const getDateForWeek = (
  weekOffset: number,
  dayOffset: number,
  hour: number = 9,
  minute: number = 0
) => {
  const baseDate = getDateForDay(dayOffset, hour, minute);
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  return baseDate;
};

// Mapeia DayOfWeek para offset de dia
const dayToOffset: Record<DayOfWeek, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
};

async function main() {
  // Limpa dados existentes
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.events.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();

  console.log('🗑️  Dados antigos removidos');

  // ADMIN (incluindo usuário padrão para testes)
  await prisma.admin.createMany({
    data: [
      { id: 'user_37wdAmdf9nrOv4OX4ROZ4OGzycr', username: 'admin' }, // Usuário padrão: admin/admin
      { id: 'admin2', username: 'admin2' },
    ],
  });
  console.log('✅ Admins criados');

  // GRADE (Séries: 1º ao 6º ano)
  const grades = [];
  for (let i = 1; i <= 6; i++) {
    const grade = await prisma.grade.create({
      data: { level: i },
    });
    grades.push(grade);
  }
  console.log('✅ Grades criadas');

  // CLASS (Turmas: 2 por série = 12 turmas)
  const classNames = ['A', 'B'];
  const classes = [];
  for (let gradeIndex = 0; gradeIndex < grades.length; gradeIndex++) {
    const grade = grades[gradeIndex];
    for (const suffix of classNames) {
      const classRecord = await prisma.class.create({
        data: {
          name: `${grade.level}º Ano ${suffix}`,
          gradeId: grade.id,
          capacity: Math.floor(Math.random() * 10) + 25, // 25-35 alunos
        },
      });
      classes.push(classRecord);
    }
  }
  console.log('✅ Classes criadas');

  // SUBJECT (Matérias)
  const subjectNames = [
    'Mathematics',
    'Portuguese',
    'Science',
    'History',
    'Geography',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Art',
    'Physical Education',
    'English',
  ];

  const subjects = [];
  for (const name of subjectNames) {
    const subject = await prisma.subject.create({ data: { name } });
    subjects.push(subject);
  }
  console.log('✅ Subjects criados');

  // TEACHER (20 professores, incluindo usuário padrão para testes)
  const teacherNames = [
    { id: 'user_37wlElTyWRpcdlZHCzz1cOx8akS', username: 'teacher', name: 'João', surname: 'Silva' }, // Usuário padrão: teacher/teacher
    { id: 'teacher2', username: 'teacher2', name: 'Maria', surname: 'Santos' },
    { id: 'teacher3', username: 'teacher3', name: 'Pedro', surname: 'Oliveira' },
    { id: 'teacher4', username: 'teacher4', name: 'Ana', surname: 'Costa' },
    { id: 'teacher5', username: 'teacher5', name: 'Carlos', surname: 'Ferreira' },
    { id: 'teacher6', username: 'teacher6', name: 'Lucia', surname: 'Almeida' },
    { id: 'teacher7', username: 'teacher7', name: 'Roberto', surname: 'Lima' },
    { id: 'teacher8', username: 'teacher8', name: 'Fernanda', surname: 'Pereira' },
    { id: 'teacher9', username: 'teacher9', name: 'Ricardo', surname: 'Souza' },
    { id: 'teacher10', username: 'teacher10', name: 'Patricia', surname: 'Rodrigues' },
    { id: 'teacher11', username: 'teacher11', name: 'Marcos', surname: 'Martins' },
    { id: 'teacher12', username: 'teacher12', name: 'Juliana', surname: 'Gomes' },
    { id: 'teacher13', username: 'teacher13', name: 'André', surname: 'Barbosa' },
    { id: 'teacher14', username: 'teacher14', name: 'Camila', surname: 'Ribeiro' },
    { id: 'teacher15', username: 'teacher15', name: 'Felipe', surname: 'Carvalho' },
    { id: 'teacher16', username: 'teacher16', name: 'Beatriz', surname: 'Nascimento' },
    { id: 'teacher17', username: 'teacher17', name: 'Gustavo', surname: 'Araújo' },
    { id: 'teacher18', username: 'teacher18', name: 'Larissa', surname: 'Cardoso' },
    { id: 'teacher19', username: 'teacher19', name: 'Diego', surname: 'Mendes' },
    { id: 'teacher20', username: 'teacher20', name: 'Amanda', surname: 'Cavalcanti' },
  ];

  for (let i = 0; i < teacherNames.length; i++) {
    const teacher = teacherNames[i];
    await prisma.teacher.create({
      data: {
        id: teacher.id,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        email: `${teacher.name.toLowerCase()}.${teacher.surname.toLowerCase()}@school.com`,
        phone: `11-9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        address: `Rua ${teacher.surname}, ${Math.floor(Math.random() * 1000) + 1}`,
        bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
          Math.floor(Math.random() * 8)
        ],
        gender: i % 2 === 0 ? UserGender.MALE : UserGender.FEMALE,
        subjects: { connect: [{ id: subjects[i % subjects.length].id }] },
        classes: { connect: [{ id: classes[i % classes.length].id }] },
        birthday: new Date(
          1975 + Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      },
    });
  }
  console.log('✅ Teachers criados');

  // PARENT (40 pais, incluindo usuário padrão para testes)
  const parentData = [
    { id: 'user_37wlTQJ9ogrJnvAsfeSlYges6qR', username: 'parent', name: 'Carlos' }, // Usuário padrão: parent/parent
    { id: 'parent2', username: 'parent2', name: 'Mariana' },
    { id: 'parent3', username: 'parent3', name: 'Roberto' },
    { id: 'parent4', username: 'parent4', name: 'Fernanda' },
    { id: 'parent5', username: 'parent5', name: 'José' },
    { id: 'parent6', username: 'parent6', name: 'Claudia' },
    { id: 'parent7', username: 'parent7', name: 'Antonio' },
    { id: 'parent8', username: 'parent8', name: 'Sandra' },
    { id: 'parent9', username: 'parent9', name: 'Paulo' },
    { id: 'parent10', username: 'parent10', name: 'Lucia' },
    { id: 'parent11', username: 'parent11', name: 'Marcos' },
    { id: 'parent12', username: 'parent12', name: 'Patricia' },
    { id: 'parent13', username: 'parent13', name: 'Fernando' },
    { id: 'parent14', username: 'parent14', name: 'Adriana' },
    { id: 'parent15', username: 'parent15', name: 'Ricardo' },
    { id: 'parent16', username: 'parent16', name: 'Cristina' },
    { id: 'parent17', username: 'parent17', name: 'Eduardo' },
    { id: 'parent18', username: 'parent18', name: 'Renata' },
    { id: 'parent19', username: 'parent19', name: 'Marcelo' },
    { id: 'parent20', username: 'parent20', name: 'Daniela' },
    { id: 'parent21', username: 'parent21', name: 'Rafael' },
    { id: 'parent22', username: 'parent22', name: 'Vanessa' },
    { id: 'parent23', username: 'parent23', name: 'Rodrigo' },
    { id: 'parent24', username: 'parent24', name: 'Tatiana' },
    { id: 'parent25', username: 'parent25', name: 'Leonardo' },
    { id: 'parent26', username: 'parent26', name: 'Priscila' },
    { id: 'parent27', username: 'parent27', name: 'Alexandre' },
    { id: 'parent28', username: 'parent28', name: 'Fabiana' },
    { id: 'parent29', username: 'parent29', name: 'Bruno' },
    { id: 'parent30', username: 'parent30', name: 'Juliana' },
    { id: 'parent31', username: 'parent31', name: 'Thiago' },
    { id: 'parent32', username: 'parent32', name: 'Leticia' },
    { id: 'parent33', username: 'parent33', name: 'Gustavo' },
    { id: 'parent34', username: 'parent34', name: 'Camila' },
    { id: 'parent35', username: 'parent35', name: 'Leandro' },
    { id: 'parent36', username: 'parent36', name: 'Aline' },
    { id: 'parent37', username: 'parent37', name: 'Diego' },
    { id: 'parent38', username: 'parent38', name: 'Natalia' },
    { id: 'parent39', username: 'parent39', name: 'Vinicius' },
    { id: 'parent40', username: 'parent40', name: 'Isabela' },
  ];

  for (let i = 0; i < parentData.length; i++) {
    const parent = parentData[i];
    await prisma.parent.create({
      data: {
        id: parent.id,
        username: parent.username,
        name: parent.name,
        surname: `Família${i + 1}`,
        email: `${parent.username}@email.com`,
        phone: `11-9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        address: `Av. Principal, ${Math.floor(Math.random() * 2000) + 1}`,
        birthday: new Date(
          1970 + Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      },
    });
  }
  console.log('✅ Parents criados');

  // STUDENT (80 alunos - distribuídos nas 12 turmas, incluindo usuário padrão para testes)
  const studentFirstNames = [
    'Lucas',
    'Gabriel',
    'Sofia',
    'Julia',
    'Miguel',
    'Alice',
    'Arthur',
    'Helena',
    'Bernardo',
    'Laura',
    'Heitor',
    'Valentina',
    'Davi',
    'Sophia',
    'Lorenzo',
    'Isabella',
    'Theo',
    'Manuela',
    'Pedro',
    'Luisa',
    'Noah',
    'Maria',
    'Samuel',
    'Giovanna',
    'Enzo',
    'Beatriz',
    'Henrique',
    'Ana',
    'Benjamin',
    'Clara',
    'Matheus',
    'Cecilia',
  ];

  // Primeiro, criar o student padrão (student/student)
  await prisma.student.create({
    data: {
      id: 'user_37wlOo9ysdEIqqF2XD5ZxOvgBDv', // Usuário padrão: student/student
      username: 'student',
      name: 'Lucas',
      surname: 'Aluno',
      email: 'student@school.com',
      phone: `11-9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      address: 'Rua dos Estudantes, 1',
      bloodType: 'O+',
      gender: UserGender.MALE,
      parentId: parentData[0].id, // Filho do parent padrão
      gradeId: grades[0].id,
      classId: classes[0].id,
      birthday: new Date(2015, 5, 15),
    },
  });

  // Criar os demais students
  for (let i = 2; i <= 80; i++) {
    const classIndex = (i - 1) % classes.length;
    const classRecord = classes[classIndex];
    const gradeRecord = grades[Math.floor(classIndex / 2)];
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: studentFirstNames[(i - 1) % studentFirstNames.length],
        surname: `Aluno${i}`,
        email: `student${i}@school.com`,
        phone: `11-9${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
        address: `Rua dos Estudantes, ${i}`,
        bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][
          Math.floor(Math.random() * 8)
        ],
        gender: i % 2 === 0 ? UserGender.MALE : UserGender.FEMALE,
        parentId: parentData[(i - 1) % parentData.length].id,
        gradeId: gradeRecord.id,
        classId: classRecord.id,
        birthday: new Date(
          2010 + Math.floor(classIndex / 4),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
      },
    });
  }
  console.log('✅ Students criados');

  // LESSON - Cada professor tem no máximo 1 aula por slot de horário
  // Garantimos que o professor padrão (teacher) tenha aulas em todos os dias
  const days = Object.values(DayOfWeek);
  const timeSlots = [
    { start: 8, end: 9 },
    { start: 9, end: 10 },
    { start: 10, end: 11 },
    { start: 11, end: 12 },
    { start: 14, end: 15 },
    { start: 15, end: 16 },
  ];

  const lessons = [];
  let lessonCount = 0;

  // Rastreia quais slots cada professor já tem ocupados
  // Formato: "teacherId-dayIndex-slotIndex"
  const teacherSchedule = new Set<string>();

  // PRIMEIRO: Criar aulas garantidas para o professor padrão (teacher) em todos os dias
  const defaultTeacher = teacherNames[0]; // user_37wlElTyWRpcdlZHCzz1cOx8akS
  const defaultTeacherSlots = [
    { dayIndex: 0, slotIndex: 0 }, // Segunda 8h
    { dayIndex: 0, slotIndex: 2 }, // Segunda 10h
    { dayIndex: 1, slotIndex: 1 }, // Terça 9h
    { dayIndex: 1, slotIndex: 3 }, // Terça 11h
    { dayIndex: 2, slotIndex: 0 }, // Quarta 8h
    { dayIndex: 2, slotIndex: 4 }, // Quarta 14h
    { dayIndex: 3, slotIndex: 1 }, // Quinta 9h
    { dayIndex: 3, slotIndex: 5 }, // Quinta 15h
    { dayIndex: 4, slotIndex: 2 }, // Sexta 10h
    { dayIndex: 4, slotIndex: 4 }, // Sexta 14h
  ];

  for (const { dayIndex, slotIndex } of defaultTeacherSlots) {
    const day = days[dayIndex];
    const slot = timeSlots[slotIndex];
    const scheduleKey = `${defaultTeacher.id}-${dayIndex}-${slotIndex}`;
    teacherSchedule.add(scheduleKey);

    lessonCount++;
    const lesson = await prisma.lesson.create({
      data: {
        name: `Aula ${lessonCount} - ${subjectNames[(lessonCount - 1) % subjectNames.length]} - ${classes[lessonCount % classes.length].name}`,
        day,
        startTime: getDateForDay(dayToOffset[day], slot.start),
        endTime: getDateForDay(dayToOffset[day], slot.end),
        subjectId: subjects[(lessonCount - 1) % subjects.length].id,
        classId: classes[lessonCount % classes.length].id,
        teacherId: defaultTeacher.id,
      },
    });
    lessons.push(lesson);
  }
  console.log(`✅ ${lessonCount} aulas criadas para o professor padrão (teacher)`);

  // SEGUNDO: Criar aulas para as demais turmas e professores
  for (let classIndex = 0; classIndex < classes.length; classIndex++) {
    const classRecord = classes[classIndex];

    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      const day = days[dayIndex];

      // 3-4 aulas por dia por turma
      const slotsForDay = dayIndex % 2 === 0 ? [0, 1, 2, 4] : [1, 2, 3, 5];

      for (const slotIndex of slotsForDay) {
        const slot = timeSlots[slotIndex];

        // Encontrar um professor disponível (começando do índice 1 para variar mais)
        let assignedTeacher = null;
        for (let t = 0; t < teacherNames.length; t++) {
          const teacherIndex = (classIndex + dayIndex + slotIndex + t + 1) % teacherNames.length;
          const teacher = teacherNames[teacherIndex];
          const scheduleKey = `${teacher.id}-${dayIndex}-${slotIndex}`;

          if (!teacherSchedule.has(scheduleKey)) {
            teacherSchedule.add(scheduleKey);
            assignedTeacher = teacher;
            break;
          }
        }

        if (!assignedTeacher) continue;

        lessonCount++;
        const lesson = await prisma.lesson.create({
          data: {
            name: `Aula ${lessonCount} - ${subjectNames[(lessonCount - 1) % subjectNames.length]} - ${classRecord.name}`,
            day,
            startTime: getDateForDay(dayToOffset[day], slot.start),
            endTime: getDateForDay(dayToOffset[day], slot.end),
            subjectId: subjects[(lessonCount - 1) % subjects.length].id,
            classId: classRecord.id,
            teacherId: assignedTeacher.id,
          },
        });
        lessons.push(lesson);
      }
    }
  }
  console.log(`✅ ${lessonCount} Lessons criadas no total (sem conflitos de horário)`);

  // EXAM (20 provas - na semana atual e próxima)
  const exams = [];
  for (let i = 1; i <= 20; i++) {
    const dayOffset = i % 5; // Segunda a Sexta
    const hour = 8 + (i % 4) * 2; // 8h, 10h, 12h, 14h
    const exam = await prisma.exam.create({
      data: {
        title: `Prova de ${subjectNames[(i - 1) % subjectNames.length]}`,
        startTime: getDateForDay(dayOffset, hour),
        endTime: getDateForDay(dayOffset, hour + 2),
        lessonId: lessons[(i - 1) % lessons.length].id,
      },
    });
    exams.push(exam);
  }
  console.log('✅ Exams criados');

  // ASSIGNMENT (30 trabalhos - distribuídos no mês)
  const assignments = [];
  for (let i = 1; i <= 30; i++) {
    const startDay = i % 5;
    const dueDay = startDay + 3 + (i % 4); // 3-6 dias depois
    const assignment = await prisma.assignment.create({
      data: {
        title: `Trabalho ${i} - ${subjectNames[(i - 1) % subjectNames.length]}`,
        startDate: getDateForDay(startDay),
        dueDate: getDateForDay(dueDay > 4 ? 4 : dueDay, 23, 59),
        lessonId: lessons[(i - 1) % lessons.length].id,
      },
    });
    assignments.push(assignment);
  }
  console.log('✅ Assignments criados');

  // RESULT (200 resultados - notas dos alunos)
  const allStudentIdsForResults = [
    'user_37wlOo9ysdEIqqF2XD5ZxOvgBDv', // student padrão
    ...Array.from({ length: 79 }, (_, i) => `student${i + 2}`),
  ];

  for (let i = 1; i <= 200; i++) {
    const isExam = i % 2 === 0;
    await prisma.result.create({
      data: {
        score: Math.floor(Math.random() * 50 + 50) / 10, // Nota entre 5.0 e 10.0
        studentId: allStudentIdsForResults[(i - 1) % allStudentIdsForResults.length],
        ...(isExam
          ? { examId: exams[(i - 1) % exams.length].id }
          : { assignmentId: assignments[(i - 1) % assignments.length].id }),
      },
    });
  }
  console.log('✅ Results criados');

  // ATTENDANCE (400 registros - presença dos alunos na semana)
  // Distribuição variada para melhor visualização no gráfico
  const attendanceRates: Record<number, number> = {
    0: 0.95, // Segunda: 95% presença
    1: 0.88, // Terça: 88% presença
    2: 0.92, // Quarta: 92% presença
    3: 0.85, // Quinta: 85% presença
    4: 0.78, // Sexta: 78% presença (menor presença)
  };

  const allStudentIds = [
    'user_37wlOo9ysdEIqqF2XD5ZxOvgBDv', // student padrão
    ...Array.from({ length: 79 }, (_, i) => `student${i + 2}`),
  ];

  for (const studentId of allStudentIds) {
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const attendanceRate = attendanceRates[dayOffset];
      await prisma.attendance.create({
        data: {
          date: getDateForDay(dayOffset),
          present: Math.random() < attendanceRate,
          studentId,
          lessonId: lessons[allStudentIds.indexOf(studentId) % lessons.length].id,
        },
      });
    }
  }
  console.log('✅ Attendance registrada');

  // EVENTS (30 eventos - distribuídos ao longo de várias semanas)
  const eventTitles = [
    {
      title: 'Reunião de Planejamento',
      desc: 'Reunião trimestral para planejamento do próximo período letivo',
    },
    { title: 'Prova de Matemática', desc: 'Avaliação bimestral de cálculo e álgebra' },
    {
      title: 'Palestra sobre Tecnologia',
      desc: 'Palestra sobre inovações tecnológicas na educação',
    },
    { title: 'Feira de Ciências', desc: 'Apresentação dos projetos científicos dos alunos' },
    { title: 'Campeonato de Futebol', desc: 'Torneio interclasses de futebol' },
    { title: 'Festa Junina', desc: 'Celebração com comidas típicas e danças' },
    { title: 'Excursão ao Museu', desc: 'Visita ao museu de história natural' },
    { title: 'Apresentação de Teatro', desc: 'Peça teatral preparada pelos alunos' },
    { title: 'Semana de Provas', desc: 'Período de avaliações bimestrais' },
    { title: 'Conselho de Classe', desc: 'Reunião pedagógica' },
    { title: 'Aula de Reforço', desc: 'Aulas extras de matemática e português' },
    { title: 'Campeonato de Xadrez', desc: 'Torneio de xadrez escolar' },
    { title: 'Dia da Família', desc: 'Evento de integração com famílias' },
    { title: 'Workshop de Redação', desc: 'Oficina de escrita criativa' },
    { title: 'Gincana Cultural', desc: 'Competição de conhecimentos gerais' },
    { title: 'Plantão de Dúvidas', desc: 'Atendimento individual aos alunos' },
    { title: 'Simulado ENEM', desc: 'Simulado preparatório para o ENEM' },
    { title: 'Aula de Campo', desc: 'Visita técnica ao parque ecológico' },
    { title: 'Festival de Música', desc: 'Apresentações musicais dos alunos' },
    { title: 'Olimpíada de Matemática', desc: 'Competição de matemática' },
    { title: 'Feira do Livro', desc: 'Exposição e venda de livros' },
    { title: 'Dia do Esporte', desc: 'Atividades esportivas variadas' },
    { title: 'Mostra de Arte', desc: 'Exposição de trabalhos artísticos' },
    { title: 'Debate Estudantil', desc: 'Debate sobre temas atuais' },
    { title: 'Oficina de Robótica', desc: 'Introdução à robótica educacional' },
    { title: 'Feriado Escolar', desc: 'Escola fechada - feriado municipal' },
    { title: 'Reunião de Pais', desc: 'Reunião trimestral com os pais dos alunos' },
    { title: 'Formatura', desc: 'Cerimônia de formatura do 6º ano' },
    { title: 'Recesso Escolar', desc: 'Período sem aulas' },
    { title: 'Volta às Aulas', desc: 'Início do novo período letivo' },
  ];

  // Distribuir eventos em 6 semanas: 2 passadas, atual, e 3 futuras
  const weekOffsets = [-2, -1, 0, 0, 1, 1, 2, 2, 3, 3];

  for (let i = 0; i < eventTitles.length; i++) {
    const event = eventTitles[i];
    const weekOffset = weekOffsets[i % weekOffsets.length];
    const dayOffset = i % 5; // Segunda a Sexta
    const hour = 9 + (i % 6); // Horários variados entre 9h e 14h

    await prisma.events.create({
      data: {
        title: event.title,
        description: event.desc,
        startTime: getDateForWeek(weekOffset, dayOffset, hour),
        endTime: getDateForWeek(weekOffset, dayOffset, hour + 2),
        classId: i < 20 ? classes[i % classes.length].id : null, // Últimos 10 são globais
      },
    });
  }
  console.log('✅ Events criados');

  // ANNOUNCEMENT (25 avisos - distribuídos ao longo de várias semanas)
  const announcementTitles = [
    {
      title: 'Período de Matrículas Abertas',
      desc: 'As matrículas para o próximo semestre estão abertas até 31 de janeiro',
    },
    {
      title: 'Novo Horário das Aulas',
      desc: 'Confira o novo horário das aulas no portal do aluno',
    },
    { title: 'Reunião de Professores', desc: 'Reunião pedagógica na sexta-feira às 14h' },
    { title: 'Entrega de Boletins', desc: 'Os boletins serão entregues na próxima semana' },
    { title: 'Uniforme Obrigatório', desc: 'Lembrete: o uso do uniforme é obrigatório' },
    { title: 'Campanha de Vacinação', desc: 'Campanha de vacinação na escola dia 15' },
    { title: 'Novos Livros na Biblioteca', desc: 'Novos livros disponíveis para empréstimo' },
    { title: 'Cardápio da Cantina', desc: 'Novos itens saudáveis no cardápio' },
    { title: 'Transporte Escolar', desc: 'Alteração no horário do transporte a partir de segunda' },
    { title: 'Atividades Extracurriculares', desc: 'Inscrições abertas para atividades extras' },
    { title: 'Provas de Recuperação', desc: 'Datas das provas de recuperação divulgadas' },
    { title: 'Lista de Material', desc: 'Lista de material para o próximo semestre disponível' },
    { title: 'Festa de Encerramento', desc: 'Festa de fim de ano letivo dia 20 de dezembro' },
    { title: 'Simulado Preparatório', desc: 'Simulado preparatório na próxima semana' },
    { title: 'Palestra de Orientação', desc: 'Palestra sobre orientação vocacional' },
    { title: 'Manutenção das Quadras', desc: 'Quadras esportivas em manutenção esta semana' },
    { title: 'Concurso de Redação', desc: 'Inscrições abertas para o concurso' },
    { title: 'Olimpíada de Matemática', desc: 'Preparação para a olimpíada começou' },
    { title: 'Doação de Livros', desc: 'Campanha de doação de livros usados' },
    { title: 'Horário de Atendimento', desc: 'Novo horário de atendimento da secretaria' },
    { title: 'Aulas de Reforço', desc: 'Aulas de reforço disponíveis às terças e quintas' },
    { title: 'Portal do Aluno', desc: 'Novo portal do aluno disponível' },
    { title: 'Calendário Escolar', desc: 'Calendário escolar 2026 disponível' },
    { title: 'Feriado Municipal', desc: 'Não haverá aula no feriado municipal' },
    { title: 'Bem-vindos de Volta', desc: 'Boas-vindas ao novo período letivo!' },
  ];

  // Distribuir announcements em várias semanas
  const announcementWeekOffsets = [-2, -1, -1, 0, 0, 0, 1, 1, 2, 2];

  for (let i = 0; i < announcementTitles.length; i++) {
    const announcement = announcementTitles[i];
    const weekOffset = announcementWeekOffsets[i % announcementWeekOffsets.length];
    const dayOffset = i % 5;

    await prisma.announcement.create({
      data: {
        title: announcement.title,
        description: announcement.desc,
        date: getDateForWeek(weekOffset, dayOffset, 8),
        classId: i < 18 ? classes[i % classes.length].id : null, // Últimos 7 são globais
      },
    });
  }
  console.log('✅ Announcements criados');

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📊 Resumo:');
  console.log('   - 2 Admins');
  console.log('   - 6 Grades (séries)');
  console.log('   - 12 Classes (turmas)');
  console.log('   - 12 Subjects (matérias)');
  console.log('   - 20 Teachers (professores)');
  console.log('   - 40 Parents (pais)');
  console.log('   - 80 Students (alunos)');
  console.log(`   - ${lessons.length} Lessons (aulas - sem conflitos de horário)`);
  console.log('   - 20 Exams (provas)');
  console.log('   - 30 Assignments (trabalhos)');
  console.log('   - 200 Results (notas)');
  console.log(`   - ${allStudentIds.length * 5} Attendance (presenças)`);
  console.log('   - 30 Events (eventos)');
  console.log('   - 25 Announcements (avisos)');
  console.log('');
  console.log('👤 Usuários padrão para teste:');
  console.log('   - admin    / admin    (role: admin)');
  console.log('   - teacher  / teacher  (role: teacher)');
  console.log('   - student  / student  (role: student)');
  console.log('   - parent   / parent   (role: parent)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
