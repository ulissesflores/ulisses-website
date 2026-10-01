export const category = {
  notFound: 'Category not found',
  publicationsCount: 'Publications',
  highlight: 'Highlight',
  psiLink: 'Projeto Ψ (PSI): Sovereign Hardware and Zero Trust in Silicon →',
  psiDescription: 'Full whitepaper: SRAM PUF, post-quantum XMSS, aerospace TMR, and Deniable Encryption.',
  authorLabel: 'Canonical Hub',
  authorDescription: 'Collection linked to the master entity for SEO/GEO and authorship validation.',
  stories: {
    research: {
      h1: 'Applied Scientific Research and Complex Systems',
      metaTitle: 'Applied Scientific Research',
      metaDescription: 'Scientific articles by Ulisses Flores with full text, Zenodo DOI, and public code and data.',
      lead: 'This collection gathers the research of Ulisses Flores. First come the papers with the full text on the page itself, published since July 2026 on topics such as fraud detection, language models, and search in clinical-trial registries; each one shows its date, version, the DOI of its Zenodo deposit, and the repository with code and data. Older works follow, without a DOI. No work in this collection has appeared in a journal.',
      authorityTitle: 'Traceability instead of a seal',
      authorityBody: 'The full-text papers are self-published: the text, or the replication package that accompanies it, is deposited on Zenodo, which assigns the DOI. The DOI identifies the deposit and leads to it; it is not a seal of review. None of these papers has gone through journal peer review, and the page of each one says so in its status line. In place of the seal, the method stays open: public code, data, and versions, for anyone who wants to redo the math.',
      chips: [
        "Strategic AI Consultant",
        "Data Scientist",
        "AGTU Master's Student",
        "Publications with DOI",
        "Complex Systems"
      ]
    },
    whitepapers: {
      h1: 'Technical Whitepapers and Zero Trust Architecture',
      metaTitle: 'Technical Whitepapers and Zero Trust',
      metaDescription: 'Technical documentation of hardware architectures, cryptography, and IoT. Including Projeto PSI (sovereign-custody hardware wallet) by Ulisses Flores.',
      lead: 'The transition from theoretical concepts to production engineering demands irrefutable documentation. This section houses technical Whitepapers detailing mission-critical architectures, "Cloudless" systems, and state-of-the-art cryptography. This is where sovereign-class projects — such as the sovereign-custody hardware wallet (Projeto PSI) and Edge Computing solutions (GoldenLeaf) — are exposed at their deepest level of abstraction in silicon and mathematics.',
      authorityTitle: 'Engineering documented with IEEE precision',
      authorityBody: 'Each whitepaper details real architectures grounded in NIST, IEEE standards, and cutting-edge literature in side-channel analysis, post-quantum cryptography, and aerospace materials.',
      chips: [
        "Software Architect",
        "Hardware Developer",
        "AI Consultant",
        "AGTU Master's Student",
        "Zero Trust",
        "Cloudless IoT"
      ]
    },
    essays: {
      h1: 'Essays: Philosophy, Technology, and Human Behavior',
      metaTitle: 'Essays: Philosophy and Technology',
      metaDescription: 'Essays by Ulisses Flores exploring the intersection between technology, historical theology, ethics, and the dynamics of human action.',
      lead: 'Technology, devoid of philosophical and historical grounding, becomes a blind tool. As an interdisciplinary researcher, the analyses gathered here transcend code and mathematics. These essays are profound reflections on the human condition, ethics in the era of hyper-surveillance, and how historical theology and philosophy shape our understanding of power, freedom, and the future of society.',
      authorityTitle: 'Interdisciplinary reflection with academic rigor',
      authorityBody: 'Each essay combines historical-critical analysis, political philosophy, and theological foundations, offering a unique perspective that connects classical humanities to the impact of contemporary technology.',
      chips: [
        "Researcher",
        "Historical Theology",
        "Political Philosophy",
        "AGTU Master's Student",
        "Ethics and Technology"
      ]
    }
  }
} as const;
