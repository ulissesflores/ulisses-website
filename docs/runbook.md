# Runbook

This runbook documents routine operations and incident response for ulissesflores.com.

## Deployment
- Platform: Vercel (Git-integrated)
- Production branch: main

## Domain & DNS
- Primary domain: ulissesflores.com
- Verify:
  - https://ulissesflores.com/robots.txt
  - https://ulissesflores.com/sitemap.xml

## Common Checks
- Build passes locally: `npm run build`
- Lint: `npm run lint`

## Incidents (Initial)
### Search Console reports robots.txt issues
1. Check https://ulissesflores.com/robots.txt returns 200
2. Confirm it contains `Sitemap: https://ulissesflores.com/sitemap.xml`
3. Validate in Google Search Console and request reprocessing