import VideoEmbed from '../../components/VideoEmbed.jsx'
import MemberCard from '../../components/MemberCard.jsx'
import info from './info.js'
import styles from './Equipe.module.css'

import FotoInacio from './photos/FotoInacio.jpeg'
import FotoMatheus from './photos/FotoMatheus.jpeg'
import FotoPedro from './photos/FotoPedro.jpeg'
import FotoVitin from './photos/FotoVitin.jpeg'

// =====================================================================
// Equipe 04 — edite SOMENTE os arquivos desta pasta (src/teams/equipe-04).
// Preencha info.js e as constantes abaixo; o layout já está pronto.
// Quer uma 2ª página? Crie outro componente aqui e use <Routes> do
// react-router-dom dentro deste arquivo (a rota /equipe-04/* já é sua).
// =====================================================================

/** 1. Vídeo com referência */
const VIDEO = {
  // Link do YouTube ou Vimeo. Ex.: https://www.youtube.com/watch?v=XXXXXXXXXXX
  url: 'https://www.youtube.com/watch?v=6YOKHDZB-GA',
  // Fonte, inspiração, tema abordado ou prompt/roteiro usado para criar o vídeo
  reference: 'Este projeto tem como propósito desenvolver um sistema para auxiliar na reserva de quadras esportivas da Universidade de Fortaleza (Unifor).',
}

/** 2. Descrição da página e do projeto */
const PROJECT = {
  theme: 'Este projeto tem como propósito desenvolver um sistema para auxiliar na reserva de quadras esportivas da Universidade de Fortaleza (Unifor).',
  purpose: 'O principal objetivo deste trabalho é desenvolver um sistema intuitivo e funcional para o Centro Esportivo da Universidade de Fortaleza (Unifor), utilizando como principais ferramentas as linguagens JavaScript e TypeScript e a IDE Visual Studio Code. O aplicativo contará com uma interface intuitiva e funcionalidades voltadas para facilitar a reserva e a utilização das quadras esportivas da universidade, tornando o acesso a esses recursos mais prático e eficiente. ',
}

/** 3. Apresentação da equipe (o nome da equipe fica em info.js) */
const TEAM = {
  profile: 'Resumo sobre o perfil e a dinâmica da equipe.',
}

/** 4. Ficha técnica — um objeto por integrante */
const MEMBERS = [
  {
    name: 'Inácio Araripe Figueiredo',
    role: 'Back-end, Front-end',
    skills: ['Node.js', 'React'],
    bio: 'Criou os controllers e routes de users e horários, além de ficar responsável pelas telas de login, criar perfil, perfil de usuário e editar perfil.',
    links: [{ label: 'GitHub', url: 'https://github.com/araripe0805' }],
    photo: FotoInacio,
    photoPosition: 'center 16%',
  },
  {
    name: 'Matheus da Silva Oliveira',
    role: 'Front-end',
    skills: ['Figma', 'React'],
    bio: 'Ficou responsável pelas telas principais de usuário e adm, criar quadras, visualizar quadras e editar informações da quadra.',
    links: [{ label: 'GitHub', url: 'https://github.com/MAUHETS' }],
    photo: FotoMatheus,
    photoPosition: 'center 28%',
  },
  {
    name: 'Pedro Alonso Chaves Araripe',
    role: 'Back-end, Banco de dados, Front-end',
    skills: ['MongoDB', 'Node.js', 'Figma', 'React'],
    bio: 'Criou o banco de dados para quadras, usuários, horários e reservas. Criou os controllers e routes de quadras e reservas, e ajudou na idealização do design das páginas no Figma.',
    links: [{ label: 'GitHub', url: 'https://github.com/Alonso-Pedro' }],
    photo: FotoPedro,
    photoPosition: 'center 18%',
  },
  {
    name: 'Victor Gabriel Xavier da Batista',
    role: 'Criação de documentos',
    skills: ['React', 'PDF', 'Requisitos do Sistema'],
    bio: 'Ficou responsável por criar os documentos necessários para o andamento do projeto.',
    links: [{ label: 'GitHub', url: 'https://github.com/victorgxb' }],
    photo: FotoVitin,
    photoPosition: 'center 32%',
  },
]

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function Integrante({ name, role, skills = [], bio, links = [], photo }) {
  return (
    <li className={styles.person}>
      <img className={styles.avatar} src={photo} alt={`Foto de ${name}`} width="72" height="72" loading="lazy" />
      <div className={styles.personBody}>
        <h3 className={styles.personName}>{name}</h3>
        {role && <p className={styles.personRole}>{role}</p>}
        {bio && <p className={styles.personBio}>{bio}</p>}
        {skills.length > 0 && (
          <ul className={styles.skills} aria-label="Habilidades">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        )}
        {links.map((link) => (
          <a key={link.url} className={styles.link} href={link.url} target="_blank" rel="noopener noreferrer">
            <GithubIcon />
            {link.label}
          </a>
        ))}
      </div>
    </li>
  )
}

export default function Equipe04() {
  const title = info.name?.trim() || 'Equipe 04'

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Equipe 04</p>
        <h1 className={styles.title}>{title}</h1>
        {info.theme?.trim() && <p className={styles.theme}>{info.theme}</p>}
      </header>

      <section className={styles.section} aria-labelledby="video">
        <h2 id="video">Vídeo e referência</h2>
        <VideoEmbed url={VIDEO.url} title={`Vídeo — ${title}`} />
        <p className={styles.reference}>
          <strong>Referência:</strong> {VIDEO.reference}
        </p>
      </section>

      <section className={styles.section} aria-labelledby="sobre">
        <h2 id="sobre">Sobre o projeto</h2>
        <dl className={styles.details}>
          <dt>Tema</dt>
          <dd>{PROJECT.theme}</dd>
          <dt>Propósito</dt>
          <dd>{PROJECT.purpose}</dd>
          <dd>{PROJECT.aiUsage}</dd>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="equipe">
  <h2 id="equipe">A equipe</h2>
  <p className={styles.profile}>{TEAM.profile}</p>
  <ul className={styles.roster}>
    {MEMBERS.map((member, i) => (
      <Integrante key={`${member.name}-${i}`} {...member} />
    ))}
  </ul>
</section>
    </article>
  )
}
