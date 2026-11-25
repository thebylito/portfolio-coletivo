import { useEffect, useRef, useState } from 'react'
import styles from './Equipe.module.css'
import arthurPhoto from './photos/arthur.jpeg'
import juliaPhoto from './photos/julia.jpeg'
import lucasPhoto from './photos/lucas.jpeg'
import viniciosPhoto from './photos/vinicios.jpeg'
import welingtonPhoto from './photos/welington.jpeg'

// =====================================================================
// Equipe 03 — HomeWash (edite SOMENTE os arquivos em src/teams/equipe-03)
// =====================================================================

const LINKS = {
  app: 'https://homewash.thebylito.dev',
  pedir: 'https://homewash.thebylito.dev/pedir',
  apiDocs: 'https://api-homewash.thebylito.dev/docs',
  pitch: 'https://homewash.thebylito.dev/pitch',
  galeria: 'https://homewash.thebylito.dev/galeria',
  github: 'https://github.com/thebylito/home-wash',
  trello: 'https://trello.com/b/1EIVvg3y',
}

const VIDEO = {
  previewUrl: 'https://drive.google.com/file/d/14KOQOr9doS1jp6kCZKdfFY0QSVHEpTlJ/preview',
  viewUrl: 'https://drive.google.com/file/d/14KOQOr9doS1jp6kCZKdfFY0QSVHEpTlJ/view?usp=sharing',
  reference:
    'Vídeo da apresentação final gravado pela equipe demonstrando o HomeWash em produção — do pedido em tela única do cliente ao mural regional do lavador, aceite exclusivo atômico, liberação pós-aceite (LGPD) e backoffice administrativo.',
}

const NEIGHBORHOODS = ['Aldeota', 'Meireles', 'Papicu']

const PILLARS = [
  {
    id: 'cliente',
    kicker: 'FRENTE 01 · EXPERIÊNCIA DO CLIENTE',
    title: 'Pedido em Tela Única (/pedir)',
    summary:
      'Catálogo com preço de tabela fechado, duração estimada e preenchimento rápido com veículo e endereço salvos, sem leilão nem espera por orçamento.',
    tags: ['Preço fechado', 'Sem leilão', 'Repetir último pedido', 'Polling ao vivo'],
    defaultNote:
      'Em /pedir, o cliente escolhe o serviço, confirma veículo e endereço em Aldeota, Meireles ou Papicu e acompanha o status em /acompanhar/:id.',
    primaryCta: { label: 'Abrir tela de pedido ↗', href: LINKS.pedir },
    secondaryCta: { label: 'Ver pitch no sistema ↗', href: LINKS.pitch },
  },
  {
    id: 'aceite',
    kicker: 'FRENTE 02 · MOTOR DE CONCORRÊNCIA',
    title: 'Mural & Aceite Exclusivo Atômico',
    summary:
      'Lavadores aprovados visualizam pedidos ABERTA da sua região no mural e disputam com um toque: o primeiro que aceita leva o serviço via findOneAndUpdate atômico.',
    tags: ['findOneAndUpdate', 'HTTP 409 Conflito', '20 → 1 em teste', 'Mural por bairro'],
    defaultNote:
      'Operação condicional única no MongoDB ({ _id, status: "ABERTA", bairro: { $in } }) garante exclusividade sem locks distribuídos.',
    primaryCta: { label: 'Ver contrato na API Scalar ↗', href: LINKS.apiDocs },
    secondaryCta: { label: 'Explorar repositório ↗', href: LINKS.github },
  },
  {
    id: 'lgpd',
    kicker: 'FRENTE 03 · PRIVACIDADE POR DESIGN',
    title: 'Privacidade LGPD por Design',
    summary:
      'Antes do aceite, o mural expõe apenas bairro, referência e dados do serviço/veículo. Endereço completo e WhatsApp das partes só aparecem após status === "ACEITA".',
    tags: ['Mascaramento pré-aceite', 'Cookie httpOnly', 'CORS explícito', 'Snapshot imutável'],
    defaultNote:
      'ItemMuralOutput e SolicitacaoOutput separam dados públicos do mural dos dados de contato revelados apenas após o vínculo confirmado.',
    primaryCta: { label: 'Consultar DTOs na API ↗', href: LINKS.apiDocs },
    secondaryCta: { label: 'Abrir aplicação no ar ↗', href: LINKS.app },
  },
  {
    id: 'backoffice-ia',
    kicker: 'FRENTE 04 · OPERAÇÃO & USO DE IA',
    title: 'Backoffice & Uso de Inteligência Artificial',
    summary:
      'Painel administrativo para homologar lavadores e manter catálogo de preços com snapshots históricos — construído com apoio de Inteligência Artificial e validação automatizada.',
    tags: ['Homologação Admin', 'CRUD Catálogo', 'Prototipação IA', '136 Testes'],
    defaultNote:
      'Uso de IA no projeto: prototipação rápida de 24 pranchetas (Stitch/Figma), geração e revisão assistida de código na API/SPA/OpenAPI, testes automatizados, documentação técnica e esta página no Design System Modernist — tudo revisado e validado pela equipe.',
    primaryCta: { label: 'Ver galeria de concepção ↗', href: LINKS.galeria },
    secondaryCta: { label: 'Abrir HomeWash no ar ↗', href: LINKS.app },
  },
]

const SEGMENTS = [
  {
    id: 'seg-cliente',
    label: 'Cliente (Aldeota / Meireles / Papicu)',
    pillarId: 'cliente',
    note: 'Segmento Cliente: pede em menos de 60 segundos com preço de tabela fechado, cancela sem custo antes do aceite e acompanha quem vai chegar na portaria.',
    cta: { label: 'Testar fluxo do cliente ↗', href: LINKS.app },
  },
  {
    id: 'seg-lavador',
    label: 'Lavador Autônomo',
    pillarId: 'aceite',
    note: 'Segmento Lavador: recebe oportunidades reais dos bairros que atende no mural regional, aceita com um toque e evita disputa de preço em grupos.',
    cta: { label: 'Ver mural e API de aceite ↗', href: LINKS.apiDocs },
  },
  {
    id: 'seg-lgpd',
    label: 'Privacidade & LGPD',
    pillarId: 'lgpd',
    note: 'Segurança e LGPD: dados sensíveis ficam ocultos enquanto a solicitação está ABERTA e trafegam com JWT assinado em cookie httpOnly (SameSite=Lax).',
    cta: { label: 'Inspecionar endpoints LGPD ↗', href: LINKS.apiDocs },
  },
  {
    id: 'seg-admin',
    label: 'Admin / Backoffice',
    pillarId: 'backoffice-ia',
    note: 'Operação Backoffice: fila de aprovação/recusa de prestadores com justificativa e CRUD de serviços preservando snapshots nos pedidos já criados.',
    cta: { label: 'Ver aplicação no ar ↗', href: LINKS.app },
  },
  {
    id: 'seg-ia',
    label: 'Uso de IA no Projeto',
    pillarId: 'backoffice-ia',
    note: 'Como a IA foi usada: apoio na prototipação das 24 pranchetas no Stitch/Figma, geração e revisão assistida de código (API, SPA, OpenAPI e testes) e construção desta página Modernist sob revisão da equipe.',
    cta: { label: 'Ver 24 pranchetas em /galeria ↗', href: LINKS.galeria },
  },
]

const ARCHITECTURE_TABS = [
  {
    id: 'frontend',
    label: 'Front-end SPA',
    badge: 'React 19 + OpenAPI',
    title: 'Interface Modernist e Contrato Tipado',
    description:
      'Aplicação SPA mobile-first em React 19.2.8, TypeScript 5.9 e Tailwind CSS 4.3, com tipografia Archivo, cantos retos (0px) e cliente HTTP gerado automaticamente a partir do openapi.json da API.',
    specs: [
      { label: 'Rotas públicas', value: '/, /entrar, /cadastro/cliente, /cadastro/prestador, /pitch, /galeria' },
      { label: 'Fluxos autenticados', value: '/pedir, /acompanhar/:id, /prestador/mural e /backoffice/*' },
      { label: 'Sincronização', value: '@hey-api/openapi-ts (npm run api:tipos) validado na CI' },
    ],
    chips: ['React 19.2', 'TypeScript 5.9', 'Vite 8.2', 'Tailwind CSS 4', 'OpenAPI-TS'],
    cta: { label: 'Abrir aplicação SPA ↗', href: LINKS.app },
    meters: [
      { label: 'Testes no Front-end Web', valueText: '72 suítes/casos', ratio: 0.9 },
      { label: 'Pranchetas prototipadas (T1–T3)', valueText: '24 telas', ratio: 0.86 },
      { label: 'Telas MVP entregues', valueText: '12+ rotas', ratio: 0.92 },
      { label: 'Sincronia OpenAPI → TS', valueText: '100% gerada', ratio: 1 },
    ],
  },
  {
    id: 'backend',
    label: 'Back-end & MongoDB',
    badge: 'Node 22 + Atomicidade',
    title: 'API Modular com Exclusividade Atômica',
    description:
      'API RESTful em Node.js >=22 (ESM) e Express 5 organizada em 7 módulos de domínio, com validação Zod em DTOs, senhas em bcryptjs, sessão JWT em cookie httpOnly e 6 coleções no MongoDB.',
    specs: [
      { label: 'Módulos de domínio', value: 'identidade, catalogo, prestadores, solicitacoes, mural, notificacoes, saude' },
      { label: 'Coleções Mongoose', value: 'Usuario, Cliente, Prestador, Servico, Solicitacao (snapshots) e Notificacao' },
      { label: 'Regra crítica', value: 'findOneAndUpdate atômico retornando HTTP 409 em aceites concorrentes' },
    ],
    chips: ['Node.js 22 ESM', 'Express 5.2', 'MongoDB / Mongoose 9', 'Zod 4', 'JWT httpOnly'],
    cta: { label: 'Abrir Scalar API Docs ↗', href: LINKS.apiDocs },
    meters: [
      { label: 'Requisitos Funcionais entregues', valueText: '14 OK + 2 parciais (16)', ratio: 0.94 },
      { label: 'Requisitos Não Funcionais', valueText: '8 / 8 atendidos', ratio: 1 },
      { label: 'Exclusividade em disputa (20 → 1)', valueText: '1 aceite · 19 HTTP 409', ratio: 1 },
      { label: 'Coleções com índices compostos', valueText: '6 coleções', ratio: 0.85 },
    ],
  },
  {
    id: 'qualidade',
    label: 'Qualidade & Testes',
    badge: '136 Testes Vitest',
    title: 'Concorrência, Privacidade e Cobertura Real',
    description:
      'Suítes automatizadas em Vitest + Supertest + mongodb-memory-server validando desde o mascaramento LGPD no mural até 20 requisições simultâneas de aceite sobre o mesmo pedido.',
    specs: [
      { label: 'Back-end (apps/api/test)', value: '64 testes (aceite-concorrente, mural, pos-aceite, auth, notificações)' },
      { label: 'Front-end (apps/web/src)', value: '72 testes (unitários, fluxos e smoke test rotas.smoke.test.tsx)' },
      { label: 'Pipeline de CI', value: 'Typecheck, ESLint, Prettier, diff OpenAPI e smoke:build em container' },
    ],
    chips: ['Vitest 3.2', 'Supertest 7.2', 'mongodb-memory-server', 'ESLint 9', 'Prettier'],
    cta: { label: 'Ver código dos testes ↗', href: LINKS.github },
    meters: [
      { label: 'Total de testes automatizados', valueText: '136 testes', ratio: 0.96 },
      { label: 'Cobertura de API (Vitest + memory)', valueText: '64 testes', ratio: 0.82 },
      { label: 'Cobertura de Front-end Web', valueText: '72 testes', ratio: 0.88 },
      { label: 'Bloqueio automático OpenAPI na CI', valueText: '100% ativo', ratio: 1 },
    ],
  },
  {
    id: 'infra',
    label: 'Infra & CI/CD',
    badge: 'Docker + Dokploy',
    title: 'Containers Independentes e Deploy Contínuo',
    description:
      'Topologia separada em produção com imagens multi-stage otimizadas (node:22-alpine e nginx:alpine), publicação no GHCR, orquestração no Dokploy + Traefik e HTTPS/TLS terminado no Cloudflare.',
    specs: [
      { label: 'Build & Registry', value: 'GitHub Actions (ci.yml + deploy.yml) publicando no GHCR (ghcr.io)' },
      { label: 'Runtime em produção', value: 'homewash-web (Nginx + SPA) + homewash-api (Node 22) + MongoDB' },
      { label: 'Verificação pós-deploy', value: 'Healthcheck em /api/health validado automaticamente por smoke test' },
    ],
    chips: ['Docker Multi-stage', 'Nginx Alpine', 'GitHub Actions', 'Dokploy + Traefik', 'Cloudflare TLS'],
    cta: { label: 'Acessar ambiente no ar ↗', href: LINKS.app },
    meters: [
      { label: 'Healthcheck automático pós-deploy', valueText: '/api/health OK', ratio: 1 },
      { label: 'Sprints executadas com CI/CD', valueText: '4 ciclos completos', ratio: 0.92 },
      { label: 'Backlog gerenciado (DEEP/MoSCoW)', valueText: '6 épicos · 21 US', ratio: 0.9 },
      { label: 'Práticas de segurança HTTPS/CORS', valueText: 'TLS + SameSite=Lax', ratio: 0.98 },
    ],
  },
]

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Escolha no catálogo',
    text: 'O cliente seleciona a lavagem em tabela de preço e duração fixos definidos pelo backoffice.',
    chips: ['GET /api/catalogo/servicos', 'Sem leilão'],
  },
  {
    step: '02',
    title: 'Pedido em tela única',
    text: 'Informa veículo, endereço nos bairros-piloto e horário opcional em /pedir com pré-preenchimento.',
    chips: ['/pedir', '< 60 segundos'],
  },
  {
    step: '03',
    title: 'Aceite exclusivo atômico',
    text: 'Lavadores aprovados veem o pedido no mural; o primeiro aceite altera o status de forma atômica.',
    chips: ['findOneAndUpdate', 'HTTP 409 Conflito'],
  },
  {
    step: '04',
    title: 'Revelação pós-aceite',
    text: 'Somente após status === "ACEITA" o lavador recebe endereço completo e o cliente vê quem vai chegar.',
    chips: ['LGPD por design', '/acompanhar/:id'],
  },
]

const MEMBERS = [
  {
    name: 'Welington da Silva Martins',
    role: 'Gerente do Projeto',
    photo: welingtonPhoto,
    photoPosition: '50% 20%',
    photoOrigin: '50% 20%',
    photoScale: 1,
    skills: ['Gestão Ágil', 'Kanban / Trello', 'DEEP & MoSCoW', 'Documentação'],
    bio: 'Coordenou as sprints, conduziu o quadro Kanban no Trello, consolidou a documentação do planejamento final e organizou as entregas acadêmicas.',
    links: [
      { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/thebylito/' },
      { kind: 'github', label: 'GitHub', url: 'https://github.com/thebylito' },
    ],
  },
  {
    name: 'Lucas Gomes Costa',
    role: 'Designer UX/UI',
    photo: lucasPhoto,
    photoPosition: '50% 45%',
    photoOrigin: '50% 44%',
    photoScale: 1.32,
    skills: ['Design System Modernist', 'Figma / Stitch', 'Prototipação', 'Usabilidade'],
    bio: 'Criou o Design System Modernist, prototipou 24 pranchetas navegáveis (Turns T1–T3) e desenvolveu as 5 telas do MVP para desktop e mobile.',
    links: [
      { kind: 'github', label: 'GitHub', url: 'https://github.com/luckhaosbb' },
      { kind: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/lucas-gomes-ab49582bb/' },
    ],
  },
  {
    name: 'Arthur Braz Masrua',
    role: 'Desenvolvedor Back-end',
    photo: arthurPhoto,
    photoPosition: '50% 22%',
    photoOrigin: '50% 24%',
    photoScale: 1.06,
    skills: ['Node.js / Express', 'MongoDB / Mongoose', 'Atomicidade (HTTP 409)', 'Vitest / Supertest'],
    bio: 'Estruturou a API REST em Node.js/Express, modelou coleções, snapshots e índices no MongoDB e implementou o aceite exclusivo atômico com testes de concorrência.',
    links: [],
  },
  {
    name: 'Julia Alvino de Mesquita Bernardo',
    role: 'Desenvolvedora Front-end',
    photo: juliaPhoto,
    photoPosition: '50% 22%',
    photoOrigin: '50% 22%',
    photoScale: 1,
    skills: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Responsividade'],
    bio: 'Desenvolveu a aplicação SPA em React 19 e Tailwind CSS v4, entregando o pedido em tela única (/pedir), acompanhamento, mural do prestador e backoffice.',
    links: [{ kind: 'github', label: 'GitHub', url: 'https://github.com/juulialvino' }],
  },
  {
    name: 'Vinicios Gabriel de Castro Barbosa',
    role: 'Desenvolvedor Fullstack',
    photo: viniciosPhoto,
    photoPosition: '51% 42%',
    photoOrigin: '51% 41%',
    photoScale: 1.95,
    skills: ['JWT httpOnly', 'OpenAPI', 'GitHub Actions', 'Docker / Nginx'],
    bio: 'Implementou autenticação JWT via cookie httpOnly, contrato automático OpenAPI (@hey-api/openapi-ts), pipelines CI/CD no GitHub Actions, Docker/Nginx e deploy em produção.',
    links: [{ kind: 'github', label: 'GitHub', url: 'https://github.com/Vinicios-Gabriel27' }],
  },
]

function useArchivoFont() {
  useEffect(() => {
    const preconnects = [
      { href: 'https://fonts.googleapis.com' },
      { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ]
    for (const { href, crossOrigin } of preconnects) {
      if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) continue
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      if (crossOrigin) link.crossOrigin = crossOrigin
      document.head.appendChild(link)
    }

    const id = 'equipe-03-archivo'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap'
      document.head.appendChild(link)
    }
  }, [])
}

function GithubIcon() {
  return (
    <svg className={styles.socialIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8a8.01 8.01 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg className={styles.socialIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.15C0 .51.53 0 1.18 0h13.64C15.47 0 16 .51 16 1.15v13.7c0 .64-.53 1.15-1.18 1.15H1.18A1.17 1.17 0 0 1 0 14.85V1.15Zm4.94 12.24V6.17H2.54v7.22h2.4ZM3.74 5.18c.84 0 1.36-.56 1.36-1.25-.01-.71-.52-1.25-1.34-1.25-.82 0-1.36.54-1.36 1.25 0 .69.52 1.25 1.32 1.25h.02Zm4.91 8.21V9.36c0-.22.02-.43.08-.59.17-.43.56-.88 1.22-.88.86 0 1.21.66 1.21 1.63v3.87h2.4V9.24c0-2.22-1.18-3.25-2.76-3.25-1.29 0-1.86.72-2.18 1.21h.02V6.17H6.27c.03.67 0 7.22 0 7.22h2.38Z" />
    </svg>
  )
}

function FrontDiagram({ id }) {
  if (id === 'cliente') {
    return (
      <svg className={styles.stageSvg} viewBox="0 0 420 132" aria-hidden="true">
        <rect x="8" y="18" width="112" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
        <text x="20" y="44" fill="#ec3013" fontSize="11" fontWeight="800">01 CATÁLOGO</text>
        <text x="20" y="68" fill="#201e1d" fontSize="13" fontWeight="800">R$ 60 · 45 min</text>
        <text x="20" y="90" fill="#5a5653" fontSize="10">Preço de tabela</text>
        <path d="M126 66h24" stroke="#ec3013" strokeWidth="2.5" />
        <rect x="154" y="18" width="112" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
        <text x="166" y="44" fill="#ec3013" fontSize="11" fontWeight="800">02 /PEDIR</text>
        <text x="166" y="68" fill="#201e1d" fontSize="13" fontWeight="800">Tela única</text>
        <text x="166" y="90" fill="#5a5653" fontSize="10">Veículo + Bairro</text>
        <path d="M272 66h24" stroke="#ec3013" strokeWidth="2.5" />
        <rect x="300" y="18" width="112" height="96" fill="#201e1d" stroke="#201e1d" strokeWidth="2" />
        <text x="312" y="44" fill="#ec3013" fontSize="11" fontWeight="800">03 STATUS</text>
        <text x="312" y="68" fill="#ffffff" fontSize="13" fontWeight="800">Lavador aceitou</text>
        <text x="312" y="90" fill="#c8c3bf" fontSize="10">Portaria liberada</text>
      </svg>
    )
  }

  if (id === 'aceite') {
    return (
      <svg className={styles.stageSvg} viewBox="0 0 420 132" aria-hidden="true">
        <rect x="8" y="18" width="128" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
        <text x="20" y="46" fill="#ec3013" fontSize="11" fontWeight="800">CONCORRÊNCIA</text>
        <text x="20" y="72" fill="#201e1d" fontSize="16" fontWeight="900">20 aceites</text>
        <text x="20" y="94" fill="#5a5653" fontSize="10">Disputa simultânea</text>
        <path d="M142 50h36M142 66h36M142 82h36" stroke="#201e1d" strokeWidth="2" />
        <rect x="184" y="14" width="228" height="46" fill="#ec3013" />
        <text x="198" y="34" fill="#ffffff" fontSize="10" fontWeight="800">ATOMIC UPDATE · HTTP 200</text>
        <text x="198" y="50" fill="#ffffff" fontSize="13" fontWeight="800">1 vencedor → status: ACEITA</text>
        <rect x="184" y="72" width="228" height="46" fill="#201e1d" />
        <text x="198" y="92" fill="#c8c3bf" fontSize="10" fontWeight="800">CONFLITO · HTTP 409</text>
        <text x="198" y="108" fill="#ffffff" fontSize="12" fontWeight="700">19 bloqueados sem lock distribuído</text>
      </svg>
    )
  }

  if (id === 'lgpd') {
    return (
      <svg className={styles.stageSvg} viewBox="0 0 420 132" aria-hidden="true">
        <rect x="8" y="18" width="182" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
        <text x="22" y="44" fill="#5a5653" fontSize="10" fontWeight="800">ANTES DO ACEITE (ABERTA)</text>
        <text x="22" y="68" fill="#201e1d" fontSize="13" fontWeight="800">Bairro: Aldeota</text>
        <rect x="22" y="80" width="124" height="16" fill="#d5d2cf" />
        <text x="26" y="92" fill="#5a5653" fontSize="9" fontWeight="700">Rua / WhatsApp ocultos</text>
        <path d="M196 66h28" stroke="#ec3013" strokeWidth="2.5" />
        <rect x="230" y="18" width="182" height="96" fill="#201e1d" stroke="#201e1d" strokeWidth="2" />
        <text x="244" y="44" fill="#ec3013" fontSize="10" fontWeight="800">PÓS-ACEITE (ACEITA)</text>
        <text x="244" y="68" fill="#ffffff" fontSize="13" fontWeight="800">Vínculo confirmado</text>
        <text x="244" y="90" fill="#c8c3bf" fontSize="10">Endereço + contato liberados</text>
      </svg>
    )
  }

  return (
    <svg className={styles.stageSvg} viewBox="0 0 420 132" aria-hidden="true">
      <rect x="8" y="18" width="126" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
      <text x="20" y="44" fill="#ec3013" fontSize="10" fontWeight="800">BACKOFFICE</text>
      <text x="20" y="68" fill="#201e1d" fontSize="13" fontWeight="800">Aprovação</text>
      <text x="20" y="90" fill="#5a5653" fontSize="10">Catálogo + Snapshots</text>
      <rect x="148" y="18" width="126" height="96" fill="#ffffff" stroke="#201e1d" strokeWidth="2" />
      <text x="160" y="44" fill="#ec3013" fontSize="10" fontWeight="800">IA ASSISTIDA</text>
      <text x="160" y="68" fill="#201e1d" fontSize="13" fontWeight="800">24 telas + API</text>
      <text x="160" y="90" fill="#5a5653" fontSize="10">Stitch / OpenAPI</text>
      <rect x="288" y="18" width="124" height="96" fill="#201e1d" />
      <text x="300" y="44" fill="#ec3013" fontSize="10" fontWeight="800">VALIDAÇÃO</text>
      <text x="300" y="68" fill="#ffffff" fontSize="13" fontWeight="800">136 testes</text>
      <text x="300" y="90" fill="#c8c3bf" fontSize="10">Revisão humana + CI</text>
    </svg>
  )
}

export default function Equipe03() {
  useArchivoFont()

  const [activePillarId, setActivePillarId] = useState(PILLARS[0].id)
  const [activeSegmentId, setActiveSegmentId] = useState(null)
  const [activeTabId, setActiveTabId] = useState(ARCHITECTURE_TABS[0].id)
  const [processProgress, setProcessProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const progressBarRef = useRef(null)
  const tabListRef = useRef(null)
  const tabRefs = useRef({})
  const [tabIndicator, setTabIndicator] = useState({ x: 0, y: 0, width: 0, height: 0, ready: false })
  const processSectionRef = useRef(null)
  const ctaBannerRef = useRef(null)

  const activePillar = PILLARS.find((item) => item.id === activePillarId) || PILLARS[0]
  const activeSegment = SEGMENTS.find((seg) => seg.id === activeSegmentId && seg.pillarId === activePillar.id) || null
  const activeTab = ARCHITECTURE_TABS.find((tab) => tab.id === activeTabId) || ARCHITECTURE_TABS[0]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setPrefersReducedMotion(mq.matches)
    syncPreference()
    mq.addEventListener('change', syncPreference)
    return () => mq.removeEventListener('change', syncPreference)
  }, [])

  // Fallback JS para barra de leitura quando scroll-driven animations nao tem suporte
  useEffect(() => {
    const bar = progressBarRef.current
    if (!bar) return
    if (prefersReducedMotion || CSS.supports('animation-timeline', 'scroll()')) {
      bar.style.transform = ''
      return
    }

    let rafId = 0
    const updateProgress = () => {
      rafId = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1
      bar.style.transform = `scaleX(${ratio})`
    }

    const scheduleUpdate = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateProgress)
    }

    const handlePageHide = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    updateProgress()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.addEventListener('pageshow', scheduleUpdate)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      handlePageHide()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('pageshow', scheduleUpdate)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [prefersReducedMotion])

  // Indicador deslizante das abas calculando X, Y, largura e altura via ResizeObserver
  useEffect(() => {
    const listEl = tabListRef.current
    if (!listEl) return

    const measureIndicator = () => {
      const btn = tabRefs.current[activeTabId]
      if (!btn) return
      setTabIndicator({
        x: btn.offsetLeft,
        y: btn.offsetTop,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        ready: true,
      })
    }

    measureIndicator()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measureIndicator, { passive: true })
      return () => window.removeEventListener('resize', measureIndicator)
    }

    const observer = new ResizeObserver(measureIndicator)
    observer.observe(listEl)
    for (const tab of ARCHITECTURE_TABS) {
      const el = tabRefs.current[tab.id]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [activeTabId])

  // Progresso da trilha continua guiado pelo scroll
  useEffect(() => {
    if (prefersReducedMotion) return

    const section = processSectionRef.current
    if (!section) return

    let rafId = 0
    const updateTrail = () => {
      rafId = 0
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight || 1
      const startY = viewportH * 0.78
      const endY = viewportH * 0.25
      const span = Math.max(1, rect.height * 0.65 + (startY - endY))
      const raw = (startY - rect.top) / span
      const clamped = Math.min(1, Math.max(0, raw))
      setProcessProgress((prev) => (Math.abs(prev - clamped) < 0.005 ? prev : clamped))
    }

    const scheduleTrail = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateTrail)
    }

    const handlePageHide = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    updateTrail()
    window.addEventListener('scroll', scheduleTrail, { passive: true })
    window.addEventListener('resize', scheduleTrail, { passive: true })
    window.addEventListener('pageshow', scheduleTrail)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      handlePageHide()
      window.removeEventListener('scroll', scheduleTrail)
      window.removeEventListener('resize', scheduleTrail)
      window.removeEventListener('pageshow', scheduleTrail)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [prefersReducedMotion])

  // Spotlight sutil no banner CTA final
  useEffect(() => {
    const banner = ctaBannerRef.current
    if (!banner || prefersReducedMotion) return

    let rafId = 0
    let targetX = '50%'
    let targetY = '50%'

    const commitCoords = () => {
      rafId = 0
      banner.style.setProperty('--sx', targetX)
      banner.style.setProperty('--sy', targetY)
    }

    const handlePointerMove = (event) => {
      const rect = banner.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = Math.round(((event.clientX - rect.left) / rect.width) * 100)
      const y = Math.round(((event.clientY - rect.top) / rect.height) * 100)
      targetX = `${Math.min(100, Math.max(0, x))}%`
      targetY = `${Math.min(100, Math.max(0, y))}%`
      if (!rafId) rafId = window.requestAnimationFrame(commitCoords)
    }

    const handlePointerLeave = () => {
      targetX = '50%'
      targetY = '50%'
      if (!rafId) rafId = window.requestAnimationFrame(commitCoords)
    }

    const handlePageHide = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    banner.addEventListener('pointermove', handlePointerMove, { passive: true })
    banner.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      handlePageHide()
      banner.removeEventListener('pointermove', handlePointerMove)
      banner.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [prefersReducedMotion])

  const handlePillarSelect = (pillarId) => {
    setActivePillarId(pillarId)
    if (activeSegment && activeSegment.pillarId !== pillarId) {
      setActiveSegmentId(null)
    }
  }

  const handleSegmentSelect = (segment) => {
    setActivePillarId(segment.pillarId)
    setActiveSegmentId(segment.id)
  }

  const handleTabKeyDown = (event, currentIndex) => {
    const count = ARCHITECTURE_TABS.length
    let nextIndex = null

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % count
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + count) % count
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = count - 1

    if (nextIndex === null) return
    event.preventDefault()
    const nextTab = ARCHITECTURE_TABS[nextIndex]
    setActiveTabId(nextTab.id)
    tabRefs.current[nextTab.id]?.focus()
  }

  const stageNote = activeSegment ? activeSegment.note : activePillar.defaultNote
  const stagePrimaryCta = activeSegment ? activeSegment.cta : activePillar.primaryCta
  const stageKey = `${activePillar.id}-${activeSegment?.id || 'default'}`
  const effectiveProcessProgress = prefersReducedMotion ? 1 : processProgress

  return (
    <article className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.wrap}>
          <div className={styles.topBarInner}>
            <span className={styles.brand}>
              HomeWash<span className={styles.brandDot}>.</span>
            </span>
            <p className={styles.topMeta}>Equipe 03 · Desenvolvimento Web · UNIFOR</p>
          </div>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <div ref={progressBarRef} className={styles.progressBar} />
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.wrap}>
          <p className={styles.kicker}>Lavagem automotiva a domicílio · Fortaleza</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Seu carro limpo.
            <span className={styles.heroAccent}>Seu sábado de volta.</span>
          </h1>
          <p className={styles.heroLead}>
            Marketplace bilateral para intermediação de lavagem automotiva a domicílio com preço fechado e aceite
            exclusivo atômico, em operação piloto em Fortaleza.
          </p>

          <div className={styles.actions}>
            <a className={styles.btnPrimary} href={LINKS.app} target="_blank" rel="noopener noreferrer">
              Abrir aplicação no ar <span aria-hidden="true">↗</span>
            </a>
            <a className={styles.btnSecondary} href={LINKS.apiDocs} target="_blank" rel="noopener noreferrer">
              Documentação da API (Scalar) <span aria-hidden="true">↗</span>
            </a>
            <a className={styles.btnSecondary} href={LINKS.pitch} target="_blank" rel="noopener noreferrer">
              Pitch no sistema <span aria-hidden="true">↗</span>
            </a>
            <a className={styles.btnSecondary} href={LINKS.github} target="_blank" rel="noopener noreferrer">
              Repositório GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.pilotBar}>
            <span className={styles.pilotLabel}>Bairros no piloto:</span>
            <ul className={styles.pilotList}>
              {NEIGHBORHOODS.map((bairro) => (
                <li key={bairro} className={styles.pilotTag}>
                  {bairro}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.videoSection} aria-labelledby="video-title">
        <div className={styles.wrap}>
          <p className={styles.kickerDark}>01 / Vídeo com referência</p>
          <h2 id="video-title" className={styles.sectionTitleDark}>
            O HomeWash funcionando.
          </h2>

          <figure className={styles.videoFigure}>
            <div className={styles.videoFrame}>
              <iframe
                src={VIDEO.previewUrl}
                title="Apresentação final do HomeWash"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
            <figcaption className={styles.videoRef}>
              <p>
                <strong>Referência:</strong> {VIDEO.reference}
              </p>
              <a className={styles.videoLink} href={VIDEO.viewUrl} target="_blank" rel="noopener noreferrer">
                Abrir vídeo no Google Drive <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="solucoes-title">
        <div className={styles.wrap}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>02 / Soluções & Pilares do Projeto</p>
              <h2 id="solucoes-title" className={styles.sectionTitle}>
                O carro fica. A lavagem vai até ele.
              </h2>
            </div>
            <div className={styles.sectionIntroPair}>
              <p>
                <strong>Tema da página:</strong> vitrine técnica do HomeWash no Portfólio Coletivo da Turma.
              </p>
              <p>
                <strong>Propósito:</strong> conectar quem precisa lavar o carro sem perder o sábado a lavadores
                autônomos com agenda previsível e preço claro.
              </p>
            </div>
          </div>

          <div className={styles.showcaseGrid}>
            <div className={styles.accordionColumn}>
              {PILLARS.map((pillar) => {
                const isOpen = pillar.id === activePillar.id
                const panelId = `pillar-panel-${pillar.id}`
                const btnId = `pillar-btn-${pillar.id}`
                return (
                  <div
                    key={pillar.id}
                    className={isOpen ? `${styles.accordionItem} ${styles.accordionItemActive}` : styles.accordionItem}
                  >
                    <h3 className={styles.accordionHeading}>
                      <button
                        type="button"
                        id={btnId}
                        className={styles.accordionTrigger}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => handlePillarSelect(pillar.id)}
                      >
                        <span className={styles.accordionTitleText}>{pillar.title}</span>
                        <span className={styles.accordionChevron} aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className={isOpen ? `${styles.accordionCollapse} ${styles.accordionCollapseOpen}` : styles.accordionCollapse}
                    >
                      <div className={styles.accordionCollapseInner}>
                        <p className={styles.accordionSummary}>{pillar.summary}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.stageColumn}>
              <div className={styles.stagePanel}>
                <div key={stageKey} className={styles.stageInner}>
                  <p className={styles.stageKicker}>{activePillar.kicker}</p>
                  <h3 className={styles.stageTitle}>{activePillar.title}</h3>
                  <div className={styles.stageDiagramBox}>
                    <FrontDiagram id={activePillar.id} />
                  </div>
                  <ul className={styles.stageTags} aria-label="Destaques desta frente">
                    {activePillar.tags.map((tag) => (
                      <li key={tag} className={styles.stageTag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.stageNote}>{stageNote}</p>
                  <div className={styles.stageActions}>
                    <a
                      className={styles.btnPrimary}
                      href={stagePrimaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {stagePrimaryCta.label}
                    </a>
                    <a
                      className={styles.btnSecondary}
                      href={activePillar.secondaryCta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {activePillar.secondaryCta.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.segmentsBar}>
            <span className={styles.segmentsLabel}>Explorar por perfil ou tema:</span>
            <div className={styles.segmentsList}>
              {SEGMENTS.map((segment) => {
                const pressed = activeSegment?.id === segment.id
                return (
                  <button
                    key={segment.id}
                    type="button"
                    aria-pressed={pressed}
                    className={pressed ? `${styles.segmentPill} ${styles.segmentPillActive}` : styles.segmentPill}
                    onClick={() => handleSegmentSelect(segment)}
                  >
                    {segment.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="arquitetura-title">
        <div className={styles.wrap}>
          <p className={styles.kicker}>03 / Arquitetura & Entregas</p>
          <h2 id="arquitetura-title" className={styles.sectionTitle}>
            Stack, requisitos e métricas comprovadas.
          </h2>

          <div className={styles.comparator}>
            <div
              ref={tabListRef}
              className={styles.tabList}
              role="tablist"
              aria-label="Camadas da arquitetura HomeWash"
            >
              <span
                aria-hidden="true"
                className={tabIndicator.ready ? `${styles.tabIndicator} ${styles.tabIndicatorReady}` : styles.tabIndicator}
                style={{
                  width: `${tabIndicator.width}px`,
                  height: `${tabIndicator.height}px`,
                  transform: `translate3d(${tabIndicator.x}px, ${tabIndicator.y}px, 0)`,
                }}
              />
              {ARCHITECTURE_TABS.map((tab, index) => {
                const isSelected = tab.id === activeTab.id
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[tab.id] = el
                    }}
                    type="button"
                    role="tab"
                    id={`arch-tab-${tab.id}`}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    className={isSelected ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
                    onClick={() => setActiveTabId(tab.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, index)}
                  >
                    <span className={styles.tabTitle}>{tab.label}</span>
                    <span className={styles.tabSub}>{tab.badge}</span>
                  </button>
                )
              })}
            </div>

            <div
              key={activeTab.id}
              role="tabpanel"
              aria-labelledby={`arch-tab-${activeTab.id}`}
              tabIndex={0}
              className={styles.tabPanel}
            >
              <div className={styles.tabPanelLeft}>
                <span className={styles.panelBadge}>{activeTab.badge}</span>
                <h3 className={styles.panelTitle}>{activeTab.title}</h3>
                <p className={styles.panelDesc}>{activeTab.description}</p>

                <dl className={styles.specBox}>
                  {activeTab.specs.map((spec) => (
                    <div key={spec.label} className={styles.specRow}>
                      <dt className={styles.specTerm}>{spec.label}</dt>
                      <dd className={styles.specValue}>{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className={styles.chipRow}>
                  {activeTab.chips.map((chip) => (
                    <li key={chip} className={styles.chipItem}>
                      {chip}
                    </li>
                  ))}
                </ul>

                <div className={styles.panelAction}>
                  <a className={styles.btnPrimary} href={activeTab.cta.href} target="_blank" rel="noopener noreferrer">
                    {activeTab.cta.label}
                  </a>
                </div>
              </div>

              <div className={styles.tabPanelRight}>
                <p className={styles.metersHeading}>Indicadores técnicos verificados</p>
                <ul className={styles.metersList}>
                  {activeTab.meters.map((meter, idx) => (
                    <li key={meter.label} className={styles.meterItem}>
                      <div className={styles.meterMeta}>
                        <span className={styles.meterLabel}>{meter.label}</span>
                        <strong className={styles.meterValue}>{meter.valueText}</strong>
                      </div>
                      <div className={styles.meterTrack} aria-hidden="true">
                        <div
                          className={styles.meterFill}
                          style={{
                            '--meter': meter.ratio,
                            animationDelay: `${idx * 45}ms`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={processSectionRef} className={styles.processSection} aria-labelledby="processo-title">
        <div className={styles.wrap}>
          <p className={styles.kicker}>04 / Como Funciona</p>
          <h2 id="processo-title" className={styles.sectionTitle}>
            Do pedido ao aceite exclusivo em quatro marcos.
          </h2>

          <div className={styles.processTrackWrap} style={{ '--p': effectiveProcessProgress }}>
            <div className={styles.processRailDesktop} aria-hidden="true">
              <div className={styles.processRailFill} />
              <span className={styles.processRailGlow} />
            </div>
            <div className={styles.processRailMobile} aria-hidden="true">
              <div className={styles.processRailMobileFill} />
            </div>

            <ol className={styles.processGrid}>
              {PROCESS_STEPS.map((item, idx) => {
                const threshold = idx === 0 ? 0.04 : idx / 3 - 0.04
                const isReached = prefersReducedMotion || effectiveProcessProgress >= threshold
                return (
                  <li
                    key={item.step}
                    className={isReached ? `${styles.processStep} ${styles.processStepReached}` : styles.processStep}
                  >
                    <span className={styles.processWatermark} aria-hidden="true">
                      {item.step}
                    </span>
                    <div className={styles.processNodeWrap}>
                      <span className={styles.processNode}>{item.step}</span>
                    </div>
                    <div className={styles.processBody}>
                      <h3 className={styles.processTitle}>{item.title}</h3>
                      <p className={styles.processText}>{item.text}</p>
                      <ul className={styles.processChips}>
                        {item.chips.map((chip) => (
                          <li key={chip} className={styles.processChip}>
                            {chip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="equipe-title">
        <div className={styles.wrap}>
          <p className={styles.kicker}>05 / A Equipe & Ficha Técnica</p>
          <div className={styles.teamIntro}>
            <div>
              <h2 id="equipe-title" className={styles.sectionTitle}>
                Equipe 03 — HomeWash
              </h2>
              <p className={styles.teamSummary}>
                Cinco estudantes de Desenvolvimento Web da UNIFOR organizados com divisão clara de papéis (gestão,
                UX/UI, back-end, front-end e fullstack/DevOps), gerenciamento ágil no Trello com método DEEP e
                priorização MoSCoW em 6 épicos e 21 histórias de usuário, além de entrega contínua validada
                automaticamente por CI/CD.
              </p>
            </div>
            <a className={styles.btnSecondary} href={LINKS.trello} target="_blank" rel="noopener noreferrer">
              Ver quadro Kanban no Trello <span aria-hidden="true">↗</span>
            </a>
          </div>

          <ul className={styles.membersList}>
            {MEMBERS.map((member) => (
              <li key={member.name} className={styles.memberCard}>
                <div className={styles.photoBox}>
                  <img
                    className={styles.memberPhoto}
                    src={member.photo}
                    alt={`Foto de ${member.name}`}
                    width="160"
                    height="160"
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition: member.photoPosition,
                      transformOrigin: member.photoOrigin,
                      transform: `scale(${member.photoScale})`,
                    }}
                  />
                </div>
                <div className={styles.memberBody}>
                  <div className={styles.memberHead}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                  <p className={styles.memberBio}>{member.bio}</p>
                  <div className={styles.memberFooter}>
                    <ul className={styles.skillList} aria-label={`Habilidades de ${member.name}`}>
                      {member.skills.map((skill) => (
                        <li key={skill} className={styles.skillTag}>
                          {skill}
                        </li>
                      ))}
                    </ul>
                    {member.links.length > 0 && (
                      <ul className={styles.socialList} aria-label={`Links profissionais de ${member.name}`}>
                        {member.links.map((item) => (
                          <li key={item.url}>
                            <a
                              className={styles.socialLink}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${item.label} de ${member.name}`}
                            >
                              {item.kind === 'github' ? <GithubIcon /> : <LinkedinIcon />}
                              <span>{item.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={ctaBannerRef} className={styles.ctaBanner} aria-labelledby="cta-final-title">
        <div className={styles.ctaSpotlight} aria-hidden="true" />
        <div className={styles.wrap}>
          <div className={styles.ctaContent}>
            <div>
              <p className={styles.kickerDark}>No ar · Ambiente de Produção</p>
              <h2 id="cta-final-title" className={styles.ctaTitle}>
                Seu carro limpo. Seu tempo de volta.
              </h2>
              <p className={styles.ctaSubtitle}>
                Valide o MVP publicado em Fortaleza, explore os endpoints documentados em Scalar ou acompanhe o código
                no GitHub.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a className={styles.btnPrimary} href={LINKS.app} target="_blank" rel="noopener noreferrer">
                Abrir HomeWash no ar <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.btnGhostDark} href={LINKS.apiDocs} target="_blank" rel="noopener noreferrer">
                Documentação da API <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.btnGhostDark} href={LINKS.github} target="_blank" rel="noopener noreferrer">
                Código no GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.credits}>
        <div className={styles.wrap}>
          <div className={styles.creditsInner}>
            <strong>HomeWash — Lavagem Automotiva a Domicílio · Equipe 03</strong>
            <p>Universidade de Fortaleza (UNIFOR) · Desenvolvimento Web · 2026</p>
          </div>
        </div>
      </footer>
    </article>
  )
}
