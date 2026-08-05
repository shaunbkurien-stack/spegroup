SPE GROUP WEBSITE - RELEASE V14 MASTER
Updated 5 August 2026

WHAT V14 IS
V14 merges the redesigned V13 experience (ChatGPT build) with the substance and deployment fixes from
the live V12. The V13 design was adopted; its regressions were corrected.

ADOPTED FROM V13
1. Engineering Basis Control hero: control rows for scope boundary, source evidence, assumptions,
   constructability and cost basis, with maturity states, decision readiness, stage gates and a
   non-software disclaimer. Replaces the generic workflow graph.
2. Founder credentials block: mechanical engineer, MSc, Executive MBA, presented in a restrained
   technical-and-business background panel with base, coverage, delivery and engagement facts.
3. Shorter mobile composition, refined section structure, keyboard-accessible stage tabs, meaningful
   animation with reduced-motion support.

CORRECTED IN V14
1. Degree name corrected everywhere to the formal title: MSc in Petroleum Refinery Systems
   Engineering (prose, credentials chip, JSON-LD description and hasCredential).
2. Named project background restored and set open by default. V13 had anonymised all clients and
   assets, which said less than the public LinkedIn profile. Restored: nine platforms for Chevron
   Australia, Campbell platforms for Santos, Harriet Alpha pre works, Statfjord A Equinor tender
   method statement, Chevron USA West Coast studies, with the qualifier that these were delivered in
   senior project engineering roles prior to SPE Group. If the Statfjord A row is considered
   commercially sensitive, delete that single div before deployment.
3. Details toggle label logic aligned with the open-by-default state.
4. Favicon reference fixed: V13 pointed at assets/img/favicon.svg which does not exist in the
   package. Now uses icon-192.png.
5. Full deployment package restored: CNAME, robots.txt, sitemap.xml (lastmod 2026-08-05),
   site.webmanifest, icons, og-cover.png, _headers.

VERIFIED IN THIS BUILD (static analysis)
- 0 HTML parse errors (html5lib)
- 0 duplicate element IDs, 0 broken in-page anchors
- Both JavaScript blocks pass node --check
- 650/650 CSS braces balanced, 10 media queries, reduced-motion styles present
- JSON-LD parses; ProfessionalService with founder credentials and LinkedIn sameAs
- All local asset references exist in the package
- Formspree endpoint mjgnzjwn (single occurrence)
- Success panel, send-another control, privacy dialog, theme toggle and mobile menu wiring all
  resolve to existing elements
- Canonical, og:url, og:image 1200x630, twitter card tags present

NOT TESTABLE IN THIS ENVIRONMENT (do these live, ~5 minutes)
1. Submit one real enquiry on the live site; confirm delivery to shaun@spegroup.com.au (check Junk).
2. Open the live site on iPhone Safari and Android Chrome: hero control readable, tabs switch,
   menu opens, form submits.
3. Toggle dark mode on a phone.
4. Paste the URL into WhatsApp and confirm the og-cover preview renders.

DEPLOYMENT
Replace the repository contents with the ten files in this folder (or just replace index.html and
sitemap.xml if the other eight are already in the repo unchanged). GitHub Pages redeploys in about a
minute. DNS, HTTPS and email records are already correct and unaffected.
