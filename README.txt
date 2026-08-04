SPE GROUP WEBSITE - RELEASE V11
Updated 4 August 2026

CHANGES FROM V10
1. Formspree endpoint updated to mjgnzjwn (SPE Group form, delivering to shaun@spegroup.com.au).
   Previous endpoint mnjkwryq sat in a different Formspree team and is no longer referenced.
2. Added a named project background block to the Experience section. The site previously described
   capability in the abstract and did not name a single project or client, while the LinkedIn profile
   named Chevron, Santos, Equinor and five specific assets. Five entries added: nine platforms for
   Chevron Australia, Campbell platforms for Santos, Harriet Alpha, Statfjord A topside method
   statement for the Equinor tender, and West Coast feasibility studies for Chevron USA. A qualifying
   note states these were delivered in senior project engineering roles before SPE Group was formed.
3. Added LinkedIn to the contact details block so the site and profile cross-link both ways.
4. Experience grid adjusted so the left panel spans both rows and the two right-hand blocks stack.
   Collapses to single column below 960px.
5. sitemap.xml lastmod updated to 2026-08-04.

VERIFY BEFORE PUBLISHING
1. Read the five project entries and confirm each is accurate and not commercially restricted.
   Statfjord A was a Commercial in Confidence tender. If Liberty treated the engagement as
   confidential, delete that row before publishing.
2. Confirm +61 450 165 492 is the number to publish.
3. After the site is live, submit a real enquiry through the form and confirm it arrives at
   shaun@spegroup.com.au.

DEPLOYMENT - GITHUB PAGES
1. Create a public repo named "spegroup" under github.com/shaunbkr.
2. Upload all ten files in this folder to the repo root, including CNAME.
3. Settings > Pages > Source: Deploy from a branch > main > / (root) > Save.
4. Settings > Pages > Custom domain: spegroup.com.au > Save.
5. In GoDaddy DNS, first delete the parked A record on host @ and any GoDaddy CNAME on host www.
   Leaving them in place is the most common reason the site fails to load. Then add:
     A     @     185.199.108.153
     A     @     185.199.109.153
     A     @     185.199.110.153
     A     @     185.199.111.153
     CNAME www   shaunbkr.github.io
   Do not touch the MX records or any TXT record starting with v=spf1 or MS=. Those are the
   Microsoft 365 email records. A records and MX records do not conflict.
6. Check Domain Settings for Forwarding. If domain forwarding is on, turn it off. It silently
   overrides DNS records.
7. Wait for the green DNS check in GitHub Pages settings, then tick Enforce HTTPS.

NOTE ON _headers
The _headers file is Netlify and Cloudflare Pages format. GitHub Pages does not support custom
response headers, so on GitHub Pages the file is ignored. The site still serves over HTTPS. If the
security headers are wanted in force, deploy to Cloudflare Pages instead, which reads _headers
natively and uses the same DNS approach. The file is harmless either way and has been kept.

AFTER GOING LIVE
Add the site to Google Search Console and submit https://spegroup.com.au/sitemap.xml.
Paste the URL into a message to yourself to check the link preview renders the og-cover image.
Add the website to the LinkedIn profile under Contact info and Featured.

ENTITY POSITION
SPE Group Pty Ltd and Endura Decommissioning are separate legal entities. Endura is presented as a
delivery partner.

PRE-EXISTING IP
Record this website design, code, copy and SPE branding as SPE Group pre-existing IP where relevant
under the applicable engagement terms.
