export const common = {
  nav: {
    categories: [
      {
        label: 'About',
        items: [
          {
            label: 'Bio',
            href: '/#about',
            description: 'Who I am and my career path'
          },
          {
            label: 'Expertise',
            href: '/#pillars',
            description: 'Core areas of expertise'
          },
          {
            label: 'Career',
            href: '/#trajectory',
            description: 'Professional timeline'
          }
        ]
      },
      {
        label: 'Publications',
        items: [
          {
            label: 'Research',
            href: '/research',
            description: 'AI, Economics, and Complex Systems'
          },
          {
            label: 'Whitepapers',
            href: '/whitepapers',
            description: 'Engineering, IoT, and Security'
          },
          {
            label: 'Projeto Ψ (PSI)',
            href: '/whitepapers/projeto-psi',
            description: 'Technical Whitepaper: Sovereign Hardware'
          },
          {
            label: 'PSI — Demo',
            href: '/projeto-psi',
            description: 'Commercial landing: investment and licensing'
          },
          {
            label: 'Essays',
            href: '/essays',
            description: 'Theology, Humanities, and History'
          }
        ]
      },
      {
        label: 'Collection',
        items: [
          {
            label: 'Theological Archive',
            href: '/acervo-teologico',
            description: 'Sermons by thematic cluster'
          },
          {
            label: 'Clube Santo',
            href: '/clube-santo',
            description: 'Revival for the digital age'
          },
          {
            label: 'Political World',
            href: '/mundo-politico',
            description: 'Political articles and analyses'
          }
        ]
      },
      {
        label: 'Tools',
        items: [
          {
            label: 'Simulations',
            href: '/simulacoes',
            description: 'Prospective scenario laboratory'
          },
          {
            label: 'Identity',
            href: '/identidade',
            description: 'Canonical sovereign identity hub'
          },
          {
            label: 'Certifications',
            href: '/certifications',
            description: 'Credentials and verifications'
          }
        ]
      }
    ]
  },
  cta: 'CONTACT ME',
  mobileMenu: {
    open: 'Open menu',
    close: 'Close menu'
  },
  footer: {
    tagline: 'Ulisses Flores · Ground Truth Knowledge Hub',
    identityLink: 'Sovereign Identity Graph'
  },
  faqSection: {
    defaultTitle: 'Frequently Asked Questions'
  },
  authorHubCard: {
    defaultLabel: 'Author',
    defaultDescription: 'Canonical source of authorship and semantic identity for this content.',
  },
  breadcrumb: {
    home: 'Home'
  },
  actions: {
    verify: 'Verify',
    open: 'Open',
    explore: 'Explore',
    contact: 'Talk to Ulisses Flores →'
  },
  notFound: {
    title: 'Page not found',
    description: 'The page you are looking for may have been moved, renamed, or no longer exists. Explore the main sections below.',
    searchHint: 'Or use the navigation at the top to find what you are looking for.',
    links: {
      home: { label: 'Home', description: 'Main page' },
      publications: { label: 'Publications', description: 'Research, Whitepapers and Essays' },
      identity: { label: 'Identity', description: 'Canonical identity hub' },
      simulations: { label: 'Simulations', description: 'Scenario laboratory' },
    },
  },
  languageSwitcher: {
    label: 'Language',
  },
  articleDetail: {
    notFound: 'Article not found',
    backTo: 'Back to',
    goHome: 'Go to Home',
    downloadPdf: 'Download Final PDF',
    legacyPdf: 'Legacy PDF',
    scientificContext: 'Scientific Landing Context',
    abstractPtBr: 'Abstract — Portuguese',
    abstractEn: 'Abstract — English',
    introduction: 'Introduction',
    methodology: 'Methodology',
    developmentResults: 'Development and Results',
    discussion: 'Discussion',
    recommendations: 'Recommendations',
    conclusion: 'Conclusion',
    referencesHarvard: 'References (Harvard)',
    source: 'Source',
    howToCite: 'How to cite:',
    availableAt: 'Available at:',
    publishedOn: 'Published on',
  },
  mundoPoliticoDetail: {
    backTo: 'Back to Political World',
    sectionLabel: 'Political World',
    publishedOn: 'Published on',
    canonicalContext: 'Canonical Page Context',
    canonicalDescription: 'This page exists to consolidate metadata, authorship link and semantic index. The complete editorial content remains in the original publication.',
    originalSource: 'Original Source',
    authorPage: 'Author Page',
  },
  error: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while rendering this page.',
    retry: 'Try again',
    home: 'Home',
    criticalTitle: 'Critical Error',
    criticalDescription: 'The main layout failed. This should not happen.',
    reload: 'Reload',
  },
} as const;
