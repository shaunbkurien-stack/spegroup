SPE GROUP WEBSITE - RELEASE V15 FINAL
Updated 6 August 2026

This is the freeze release. V15 applies the accepted items from the external review onto the live V14
single-file base, with the named project background retained by owner decision. After this release the
site moves to quarterly maintenance unless a live issue or client feedback requires a change.

CHANGES FROM V14 (live)
1. Pause and Play control added to the Engineering Basis Control. Visible button in the panel header
   with aria-pressed and dynamic labels. Manual tab selection pauses automatic progression and flips
   the button to Play; Play resumes the cycle. Hover and focus pauses remain temporary. Under reduced
   motion the control is hidden and the panel is static, as before.
2. Hero proof row corrected from "03 regions: Australia, Middle East and North Sea" to "04 project
   markets: Australia, Middle East, North Sea and the US". The previous line contradicted the Chevron
   USA West Coast studies named later on the page.
3. Software-style reference "SPE / BASIS / 013F" replaced with "Illustrative method", and the panel is
   now linked to its disclaimer with aria-describedby.
4. novalidate removed from the form HTML. JavaScript sets form.noValidate on load, so the custom
   validation runs normally, and native browser validation protects the form if JavaScript ever fails.
5. Success panel response promise softened from "normally within one business day" to "Shaun reviews
   every enquiry and replies directly". Email and phone fallbacks unchanged.
6. JSON-LD extended: organisation @id, logo, image, five serviceType entries, areaServed Australia and
   International.
7. Branded 404.html added. GitHub Pages serves it automatically for unknown paths.
8. sitemap.xml lastmod set to 2026-08-06.

OWNER DECISIONS RECORDED
- Named clients and projects retained (Chevron Australia, Santos, Harriet Alpha, Statfjord A Equinor
  tender, Chevron USA), presented as personal career history delivered prior to SPE Group, per the
  qualifier line on the page. Basis: the engagements are publicly documented by Liberty Industrial and
  the clients themselves; no logos are used; no current-client claim is made.
- Single-file architecture retained deliberately for atomic deploys via the GitHub web interface.

VERIFIED (static analysis)
0 HTML parse errors on index.html and 404.html; 0 duplicate IDs; 0 broken anchors; both script blocks
pass node --check; 655/655 CSS braces balanced; all JS selectors resolve to existing elements;
playback wiring present with four state-sync points; JSON-LD parses; single Formspree endpoint
mjgnzjwn; all referenced local assets present.

LIVE SMOKE TEST AFTER DEPLOY (2 minutes)
1. Hard refresh https://spegroup.com.au (Ctrl+Shift+R). Hero header should read "Illustrative method"
   with a small pause button beside it.
2. Click the pause button: icon flips to play, auto-cycling stops. Click a stage tab: cycling stays
   stopped. Click play: cycling resumes.
3. Proof row under the hero reads "04 project markets".
4. Visit https://spegroup.com.au/anything-wrong and confirm the branded 404 appears.
5. On a phone: tabs, menu, dark mode, one scroll to the named projects.

DEPLOYMENT
Upload index.html, sitemap.xml and 404.html to the repository root, replacing index.html and
sitemap.xml and adding 404.html. The other files are unchanged. GitHub Pages redeploys in about a
minute. DNS, HTTPS, email and the Formspree form are unaffected.
