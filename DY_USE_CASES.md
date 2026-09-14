# NexaBank — Dynamic Yield use-case catalogue

Campaigns to configure in Experience OS for site `8782014`. Every hook named below exists in the codebase today: `dy-*` element ids on the website, API selectors in the app (`lib/dy-config.ts`), `pageAttributes` sent on every serve call, and the feed columns in `FEED_SCHEMA.md`.

**How to read an entry** — *Goal* · *Audience / targeting* · *Campaign type* · *Site hook* · *Feed columns* · *KPI*.

---

## 0. Admin setup checklist (do once)

1. **Product feed** — upload `nexabank_product_feed.csv` (Feeds › Product Feed) or set the feed URL to `https://banking-demo-five.vercel.app/api/feed` for automatic sync. 54 products, 53 columns. Allow-list DY's crawler IPs so it can fetch the product images (`/images/products/*.png`, `/loans/*.jpg`).
2. **Experience Search** — searchable fields: `name` and `tagline` (high priority), `product_type`, `categories`, `keywords`. Not `description`. Facets: `categories`, `segment`, `type:array:personas`, `type:array:goals`, `liquidity`, `type:number:risk_level`, `type:number:aer`, `price`. Brand name: NexaBank. Selector name is fixed: **Semantic Search**.
3. **Shopping Muse** — brand name NexaBank, tone "clear, warm, no jargon, always mention that investments carry risk". Selector name is fixed: **Shopping Muse**. Product tile mapping: main text `name`, secondary `dy_display_price`, price `price`. Optional: switch the website launcher to DY's own chat template with `NEXT_PUBLIC_MUSE_MODE=template` (the launcher already carries the `dy-chat-cta` class).
4. **App selectors to create** (Experience API campaigns): `App Home Recommendations` (recommendations), `App Offers` (API Custom JSON), plus the existing `App Invest Advisor Prompt`.
5. **Events to expect in reports** — standard: pageviews, `identify-v1`, `login-v1`, `signup-v1`, `keyword-search-v1`, `add-to-cart-v1` (Application Started), `purchase-v1` (Submission / Purchase), `inform-affinity-v1` (`categories`, `goals`, `personas`). Custom: `LoanQuoteRequested`, `Time on Category`, `Financial Profile Updated`, `Search Result Click`, `Home Recommendation Click`, `Offer Click`, `Advisor Contact Request`, `Shopping Muse Chat Open / Message Sent / Product Click`. Engagements: `IMP`/`CLICK` on decisions, `SLOT_CLICK` on search, Muse and recommendation slots.
6. **pageAttributes available for targeting** (app serve calls, once the customer saves a financial profile): `riskAppetite` (1–10), `lifeStage`, `goals` (`a|b|c`), `household`.

---

## 1. Website personalization (Experience Web, client script)

**1.1 Persona hero** — *Goal:* show the right first screen. *Targeting:* affinity on `life_stage` / `type:array:personas` (or `?utm_persona=` for anonymous first visits). *Type:* Dynamic Content on `#dy-hero-banner`. *Hook:* homepage hero. *Columns:* `life_stage`, `personas`. *KPI:* CTA click-through, sign-up starts.

**1.2 Personal ↔ Business switch** — *Goal:* route business visitors. *Targeting:* referrer/UTM = business, or affinity to `segment = business`. *Type:* Dynamic Content on `#dy-nav-links` (swap "Personal" for "Business" first) + redirect variation to `/business`. *Columns:* `segment`. *KPI:* `/business` visits per session.

**1.3 Mega-menu reorder** — *Goal:* surface the category the visitor cares about. *Targeting:* category affinity. *Type:* Custom Code on `#dy-nav-products` (reorder columns, highlight the affinity category). *Columns:* `categories`. *KPI:* menu click-through.

**1.4 Social proof badges** — *Goal:* reassurance on product cards. *Targeting:* everyone (test on/off). *Type:* Custom Code injecting "★ 4.8 · 6,430 reviews" / "Most popular this month" into `#dy-{category}-grid` cards from `type:number:customer_rating`, `review_count`, `popularity_score`. *KPI:* card CTA click-through.

**1.5 Geo / device / time** — *Goal:* contextual copy. *Targeting:* mobile → "Open in 10 minutes in the app"; evening → savings message; city → local branch line. *Type:* Dynamic Content on `#dy-hero-banner`. *KPI:* engagement.

**1.6 Returning applicant — "continue your application"** — *Goal:* recover abandoned applications. *Targeting:* fired `add-to-cart-v1` (Application Started) without `purchase-v1` in the last 7 days. *Type:* Notification / Overlay linking to the product's URL. *Columns:* `sku`, `url`. *KPI:* Submission rate.

**1.7 Exit intent on sign-up** — *Goal:* keep the KYC flow alive. *Targeting:* page `OTHER["SIGNUP"]`, exit intent. *Type:* Overlay ("Save your progress — we'll email the link"). *KPI:* sign-up completion.

**1.8 Why NexaBank persona pre-select** — *Goal:* make `/why-nexabank` open on the visitor's situation. *Targeting:* persona affinity. *Type:* Custom Code on `#dy-why-persona` (click the matching tab). *KPI:* time on page, product clicks from the panel.

**1.9 Rates page promo** — *Goal:* the one rate that matters to this visitor. *Targeting:* affinity (savings → best AER; loans → lowest APR; cards → best cashback). *Type:* Dynamic Content on `#dy-rates-promo`. *Columns:* `type:number:aer`, `interest_rate`, `cashback_percent`. *KPI:* click-through to product.

**1.10 Help-centre promo** — *Goal:* the right human touchpoint. *Targeting:* home affinity → "Book a mortgage appointment"; retirement → "Free retirement check-in"; business → "Talk to a business advisor". *Type:* Dynamic Content on `#dy-help-promo`. *KPI:* service page visits / contact requests.

**1.11 Business hub hero** — *Goal:* speak to the trade. *Targeting:* UTM/industry or `pageAttributes` in future. *Type:* Dynamic Content on `#dy-business-hero`. *KPI:* "Open a business account" clicks.

**1.12 Family hub hero** — *Goal:* stage-specific message (new parent vs. teenager). *Targeting:* affinity to `segment = kids` products or `goals` containing `kids`. *Type:* Dynamic Content on `#dy-family-hero`. *KPI:* NexaKids / Junior Savings visits.

## 2. Recommendations (Experience Web + Experience API)

**2.1 PDP "often paired with"** — *Goal:* cross-sell. *Targeting:* page `PRODUCT [sku]`. *Type:* Recommendations widget on `#dy-related-products` (strategy: Purchased Together / Viewed Together, fallback Similar Products; merchandising rule: same `segment`, exclude `crypto` for `risk_level ≤ 3` affinity). *Columns:* `related_skus` (seed), `segment`, `risk_level`. *KPI:* widget CTR, applications started from the widget.

**2.2 Homepage featured plans** — *Goal:* personalise the four plan tiles. *Targeting:* affinity. *Type:* Recommendations on `#dy-featured-products` (Affinity strategy, filter `categories` contains `Cards`; pin NexaNomad for travel affinity via `#dy-card-nexanomad`). *KPI:* Apply Now clicks.

**2.3 Compare-page alternative** — *Goal:* "you might also compare". *Targeting:* page `OTHER["COMPARE"]`. *Type:* Recommendations (1 slot) on `#dy-compare-suggestion` (Similar Products to the first compared SKU). *KPI:* Add-to-comparison clicks.

**2.4 Search zero-results rescue** — *Goal:* never a dead end. *Targeting:* `#dy-search-results` absent (no results). *Type:* Recommendations (Most Popular, filtered by affinity category) injected under the empty state. *KPI:* click-through from empty searches.

**2.5 Hub product rows** — *Goal:* personalise the rows on `/business` (`#dy-business-products`) and `/family` (`#dy-family-products`). *Type:* Recommendations (Affinity, filter `segment`). *KPI:* CTR.

**2.6 App Home "For you"** — *Goal:* next best product in the app. *Targeting:* logged-in customers, `pageAttributes.riskAppetite`, `lifeStage`, `goals`. *Type:* Experience API recommendations, selector **`App Home Recommendations`** (strategy Affinity → fallback Most Popular; rules: exclude held products, `risk_level ≤ riskAppetite` for Investments/Crypto). *Hook:* `app/app/home` renders `RECS_DECISION` slots, reports `IMP` + `SLOT_CLICK`; shows a local pick until the campaign exists. *KPI:* slot CTR, Application Started.

**2.7 Risk-matched investing** — *Goal:* investments that fit the declared appetite. *Targeting:* `pageAttributes.riskAppetite` bands (1–3 / 4–6 / 7–10). *Type:* variations of 2.6 (or a second selector) with merchandising rules on `type:number:risk_level`. *KPI:* investment applications by band.

## 3. Search merchandising & experimentation (Experience Search)

**3.1 Boost featured products** — *Goal:* promote strategic products. *Targeting:* default experience. *Type:* Semantic Search variation — Boost `badge = Most Popular`, `type:number:popularity_score ≥ 80`. *KPI:* search CTR (`SLOT_CLICK`).

**3.2 Bury high risk for cautious customers** — *Goal:* don't lead with crypto for risk-averse profiles. *Targeting:* `pageAttributes.riskAppetite ≤ 4` (app) or affinity to Savings. *Type:* Semantic Search variation — Bury `type:number:risk_level ≥ 8`. *KPI:* CTR, complaints avoided.

**3.3 Pin safety for "safe / guaranteed" queries** — *Goal:* answer the intent. *Targeting:* query terms `safe`, `guaranteed`, `protected`, `no risk`. *Type:* Semantic Search variation — Pin `SAV-REG-001`, `SAV-TERM-001`. *KPI:* CTR on pinned slots.

**3.4 Query targeting: kids / business / retire** — *Goal:* segment-appropriate results. *Targeting:* query contains `kid|child|teen` → filter `segment = kids`; `business|company|invoice` → `segment = business`; `retire|pension` → boost `goals` contains `retire`. *Type:* Semantic Search variations with Filters / Boost. *KPI:* CTR, zero-result rate.

**3.5 A/B: relevance vs. popularity** — *Goal:* learn what ranking converts. *Type:* two variations of the default experience (Boost `popularity_score` vs. pure relevance), 50/50. *KPI:* `SLOT_CLICK` rate and downstream Application Started.

**3.6 Personalised search by affinity** — *Goal:* same query, different customer. *Type:* Semantic Search variation with Affinity personalization on `categories`. *Hook:* the app sends `pageAttributes`; the site shares the DY cookie identity. *KPI:* CTR uplift vs. 3.5 control.

**3.7 Spell-check on** — keep `enableSpellCheck` (the site already sends it) and watch the "Showing results for…" notice in the search report.

## 4. Shopping Muse

**4.1 Pre-customer advice** — *Goal:* "which account/card for my situation". *Hook:* website widget starter prompts (family with two kids; invest a little + card benefits; why NexaBank; what can I do in the app). *Config:* brand tone; make sure `long_description`, `type:array:features`, `fee_summary` are in the feed so answers are specific. *KPI:* `Shopping Muse Product Click` → `SLOT_CLICK` → Application Started.

**4.2 Post-customer advice with profile** — *Goal:* "investment for a risk-averse 6/10 profile". *Hook:* app MuseSheet "Use my profile" toggle appends `Context: risk appetite 6/10; goals: …` to the prompt (visible), and the same profile travels as `pageAttributes`. *Targeting:* a Muse variation per risk band can adjust tone/merchandising. *KPI:* product clicks per conversation.

**4.3 PDP "Ask Muse about this"** — *Goal:* answer objections on the spot. *Hook:* every detail page opens the widget with a prefilled prompt about that product. *KPI:* conversion of PDP visits that used Muse.

**4.4 Muse ↔ template swap** — when the OOTB chat template is preferred, run a Notification campaign triggered by element click on `.dy-chat-cta` and set `NEXT_PUBLIC_MUSE_MODE=template`.

## 5. App (Experience API)

**5.1 App Offers** — *Goal:* personalised offers screen. *Targeting:* `pageAttributes`, affinity, events (e.g., `LoanQuoteRequested` → mortgage offer). *Type:* API Custom JSON, selector **`App Offers`**, payload `{ "offers": [{ "title", "body", "sku", "ctaLabel" }] }`. *Hook:* `app/app/offers` reports `IMP`/`CLICK`. *KPI:* CTR, Application Started.

**5.2 Investment advisor prompt** (exists) — selector `App Invest Advisor Prompt`, Custom JSON `{ title, body, ctaLabel, ctaHref }` on the Investments screen; target `pageAttributes.riskAppetite` or portfolio events. *KPI:* Advisor Contact Request.

**5.3 Contact follow-up** — *Goal:* close the loop. *Targeting:* fired `Advisor Contact Request`. *Type:* Triggered email/push (DY Triggers) or an Offers variation ("Your advisor call is booked — here's what to prepare"). *KPI:* attendance.

**5.4 Savings nudge** — *Goal:* move idle cash. *Targeting:* customers whose profile `goals` contains `save` and who viewed Savings (Time on Category ≥ 15 s). *Type:* `App Offers` variation featuring `SAV-NOT-001`. *KPI:* Application Started on Savings.

**5.5 Product-screen sorting** — *Goal:* order the Products screen by affinity. *Type:* Sorting campaign on the app's `CATEGORY` pageviews (future: send `listedItems`). *KPI:* CTR.

## 6. Audiences & triggers

- **Mortgage intent** — `LoanQuoteRequested` in the last 30 days → hero 1.1 (home), rates promo 1.9, Offers 5.1 with `SVC-MORT-001`.
- **Category dwellers** — `Time on Category` ≥ 15 s on a category → affinity boost; combine with 2.6.
- **Declared goals** — `inform-affinity-v1` attribute `goals` (e.g., `retire`, `kids`, `home`) → audiences per goal for 1.1, 1.10, 5.1.
- **Risk bands** — `Financial Profile Updated.risk_level` → three audiences (cautious ≤ 3, balanced 4–6, adventurous ≥ 7) for 2.7 and 3.2.
- **Muse engagers** — `Shopping Muse Message Sent` → high-intent audience for 5.1 and email.
- **Business segment** — visits to `/business` or `segment = business` affinity → 1.2, 1.11.
- **Parents** — clicks on `segment = kids` products or `goals` contains `kids` → 1.12, 2.5 family row.
- **Searchers without a click** — `keyword-search-v1` without `SLOT_CLICK` in the session → 2.4 rescue, Offers variation with the top result.

## 7. Measuring

- **Search report** — impressions, `SLOT_CLICK` CTR, zero-result queries, spell-corrected queries; compare variations from 3.5.
- **Muse report** — conversations, messages, `Shopping Muse Product Click`, `SLOT_CLICK` attribution to Application Started / Submission.
- **Custom events** — `Search Result Click` (with `source: dy|local`), `Home Recommendation Click`, `Offer Click`, `Financial Profile Updated` make every local fallback measurable too, so the demo is honest about what DY served (the Inspector shows a DY / LOCAL badge on each call).
