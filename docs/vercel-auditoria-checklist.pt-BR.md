# Checklist de Publicacao Vercel + Auditoria Externa

## 1) Validacao local antes do push

```bash
npm run upkf:check
npm run build
```

Resultados esperados:
- `upkf:verify` sem falhas.
- `build` do Next.js concluido com sucesso.

Arquivos-chave:
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/public/site.jsonld`
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/public/public.jsonld`
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/public/full.jsonld`
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/public/upkf-source.md`
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/public/.well-known/did.json`
- `/Users/ulissesflores/Documents/Projetos/ulisses-hub/docs/jsonld-audit.generated.md`

## 2) Publicacao na Vercel

```bash
git add .
git commit -m "UPKF: JSON-LD audit, certs Alura, sermoes, blog posts e did:web"
git push
```

Depois do deploy, validar URLs publicas:
- `https://ulissesflores.com/site.jsonld`
- `https://ulissesflores.com/public.jsonld`
- `https://ulissesflores.com/full.jsonld`
- `https://ulissesflores.com/upkf-source.md`
- `https://ulissesflores.com/.well-known/did.json`

## 3) Auditoria externa gratuita (online)

### Schema / JSON-LD
- Schema Markup Validator:
  - [https://validator.schema.org/](https://validator.schema.org/)
- JSON-LD Playground:
  - [https://json-ld.github.io/json-ld.org/playground/](https://json-ld.github.io/json-ld.org/playground/)

### Google
- Rich Results Test (home e paginas de artigo):
  - [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- Search Console (inspecao e solicitacao de indexacao):
  - [https://search.google.com/search-console](https://search.google.com/search-console)

### DID
- Universal Resolver:
  - [https://dev.uniresolver.io/](https://dev.uniresolver.io/)
  - DID de teste: `did:web:ulissesflores.com`

## 4) Criterios de aceite de producao

- `site.jsonld` permanece enxuto (core global).
- `public.jsonld` contem:
  - 32 credenciais Alura com `url` de verificacao.
  - 56 sermoes com URL do YouTube.
  - 19 posts do Mundo Politico.
- `full.jsonld` nao contem campo `text` gigante no dataset raiz.
- `did.json` resolve e retorna `application/did+ld+json`.
- Todos os endpoints acima respondem HTTP 200.
