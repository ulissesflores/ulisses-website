export const category = {
  notFound: 'Categoría no encontrada',
  publicationsCount: 'Publicaciones',
  highlight: 'Destacado',
  psiLink: 'Proyecto Ψ (PSI): Hardware Soberano y Zero Trust en Silicio →',
  psiDescription: 'Whitepaper completo: SRAM PUF, XMSS postcuántico, TMR aeroespacial y Deniable Encryption.',
  authorLabel: 'Hub canónico',
  authorDescription: 'Colección vinculada a la entidad maestra para SEO/GEO y validación de autoría.',
  stories: {
    research: {
      h1: 'Investigación Científica Aplicada y Sistemas Complejos',
      metaTitle: 'Investigación Científica Aplicada',
      metaDescription: 'Artículos científicos de Ulisses Flores con texto completo, DOI en Zenodo y código y datos públicos.',
      lead: 'Esta colección reúne la investigación de Ulisses Flores. Primero aparecen los artículos con texto completo en la propia página, publicados desde julio de 2026 sobre temas como detección de fraude, modelos de lenguaje y búsqueda en registros de ensayos clínicos; cada uno muestra fecha, versión, el DOI del depósito en Zenodo y el repositorio con código y datos. Después vienen obras anteriores, sin DOI. Ninguna obra de esta colección se publicó en una revista.',
      authorityTitle: 'Trazabilidad en lugar de sello',
      authorityBody: 'Los artículos con texto completo son autopublicados: el texto, o el paquete de replicación que lo acompaña, se deposita en Zenodo, que asigna el DOI. El DOI identifica el depósito y lleva a él; no es un sello de revisión. Ninguno de estos artículos pasó por revisión por pares de revista, y la página de cada uno lo dice en la línea de estado. En lugar del sello queda el método abierto: código, datos y versión públicos, para quien quiera rehacer la cuenta.',
      chips: [
        "Consultor Estratégico de IA",
        "Científico de Datos",
        "Estudiante de Maestría AGTU",
        "Publicaciones con DOI",
        "Sistemas Complejos"
      ]
    },
    whitepapers: {
      h1: 'Whitepapers Técnicos y Arquitectura Zero Trust',
      metaTitle: 'Whitepapers Técnicos y Zero Trust',
      metaDescription: 'Documentación técnica de arquitecturas de hardware, criptografía e IoT. Incluyendo el Proyecto PSI, hardware wallet de custodia soberana.',
      lead: 'La transición de conceptos teóricos a la ingeniería de producción exige documentación irrefutable. Esta sección alberga Whitepapers técnicos que detallan arquitecturas de misión crítica, sistemas "Cloudless" y criptografía de vanguardia. Es aquí donde proyectos de clase soberana — como la hardware wallet de custodia soberana (Projeto PSI) y soluciones de Edge Computing (GoldenLeaf) — son expuestos en su nivel más profundo de abstracción en silicio y matemática.',
      authorityTitle: 'Ingeniería documentada con precisión IEEE',
      authorityBody: 'Cada whitepaper detalla arquitecturas reales con fundamentación en estándares NIST, IEEE y literatura de vanguardia en side-channel analysis, criptografía postcuántica y materiales aeroespaciales.',
      chips: [
        "Arquitecto de Software",
        "Desarrollador de Hardware",
        "Consultor de IA",
        "Estudiante de Maestría AGTU",
        "Zero Trust",
        "IoT Cloudless"
      ]
    },
    essays: {
      h1: 'Ensayos: Filosofía, Tecnología y el Comportamiento Humano',
      metaTitle: 'Ensayos: Filosofía y Tecnología',
      metaDescription: 'Ensayos de Ulisses Flores explorando la intersección entre tecnología, teología histórica, ética y las dinámicas de la acción humana.',
      lead: 'La tecnología, desprovista de lastre filosófico e histórico, se convierte en una herramienta ciega. Como investigador de actuación interdisciplinar, los análisis aquí reunidos trascienden el código y las matemáticas. Estos ensayos son reflexiones profundas sobre la condición humana, la ética en la era de la hipervigilancia, y cómo la teología histórica y la filosofía moldean nuestra comprensión del poder, la libertad y el futuro de la sociedad.',
      authorityTitle: 'Reflexión interdisciplinar con rigor académico',
      authorityBody: 'Cada ensayo combina análisis histórico-crítico, filosofía política y fundamentos teológicos, ofreciendo una perspectiva única que conecta humanidades clásicas al impacto de la tecnología contemporánea.',
      chips: [
        "Investigador",
        "Teología Histórica",
        "Filosofía Política",
        "Estudiante de Maestría AGTU",
        "Ética y Tecnología"
      ]
    }
  }
} as const;
