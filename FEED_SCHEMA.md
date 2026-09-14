# NexaBank product feed — data dictionary

`nexabank_product_feed.csv` is **generated** from `lib/products.ts` (`npm run feed`) and also served at `/api/feed`. Never edit the CSV by hand — edit the product in `lib/catalog/<category>.ts` and regenerate. `validateFeed()` in `lib/feed.ts` enforces everything below before a file is written.

## Rules that apply to every column

- **One concept → one column → one unit.** A column means exactly the same thing on every row, whatever the category, so DY filters, sorting, facets and Shopping Muse comparisons work across products.
- **`0` means "none / not applicable / no cap"**, exactly as documented per column. Numeric columns are never empty (DY would default them to 0 anyway, and empty cells break comparisons).
- Cells are at most 1,000 characters; array cells are pipe-separated (`|`) and items never contain a pipe.
- Column names follow DY's typed convention: `type:number:*`, `type:array:*`, `type:date:*`, otherwise a string. **DY never lets you remove a column once uploaded** — add, don't rename.
- `url` and `image_url` are absolute, built from `NEXT_PUBLIC_SITE_URL` (default `https://banking-demo-five.vercel.app`).

## Mandatory DY columns

| Column | Meaning | Example |
|---|---|---|
| `sku` | Stable product identifier (`{CAT}-{SUB}-{3 digits}`); DY events are keyed on it | `LOAN-REAL-001` |
| `group_id` | Variant group — derived as `GRP-` + sku without the number | `GRP-LOAN-REAL` |
| `name` | Full product name | `Real Estate Loan` |
| `url` | Absolute product URL | `https://…/products/loans/real-estate-loan` |
| `price` | **Annual cost to hold or use the product** in EUR/year — fees and premiums. `0` = free. Loans are 0 (their cost is `interest_rate`) | `99` for NexaNomad |
| `in_stock` | Always lowercase `true` | `true` |
| `image_url` | Absolute image URL (loan photos, otherwise generated tiles) | `https://…/images/products/bond-fund.png` |
| `categories` | `Category\|Subcategory\|Short name` | `Cards\|Travel\|NexaNomad` |

## Descriptive columns

| Column | Meaning |
|---|---|
| `keywords` | 8–12 search intents and synonyms (array) — the main ML/affinity signal |
| `description` | One or two sentences (the original feed description) |
| `dy_display_price` | Human headline: `from 3.9% APR`, `€99/year`, `Free` |
| `life_stage` | Primary persona: `all`, `student`, `young_professional`, `family`, `pre_retirement`, `hnw`, `crypto`, `business`, `kids_teens` |
| `product_type` | Product family, e.g. `Credit Card`, `Savings Account`, `Robo-Advisory` |
| `brand` | `NexaBank` |
| `tagline` | Detail-page hero line |
| `long_description` | The "About" paragraph (2–4 sentences) |
| `segment` | `personal` · `business` · `kids` · `private` |
| `tier` | `free` · `essential` · `travel` · `premium` · `standard` · `private` · `na` |
| `badge` | Marketing badge shown on the card (`Most Popular`, `No notice period`) — may be empty |
| `rate_type` | `fixed` · `variable` · `none` |
| `liquidity` | `instant` · `notice` · `term` · `retirement` · `na` |
| `fee_summary` | Human fee line, e.g. `€49 annual fee · 2% FX markup · 19.9% APR` |
| `regulatory_note` | Protection / risk statement (`Deposits protected up to €100,000…`, `Capital at risk…`) |
| `faq` | Three Q&A pairs: `Question? => Answer \|\| Question? => Answer` |
| `type:array:features` | Detail-page "Key features" (5) |
| `type:array:eligibility` | Eligibility bullets (4) |
| `type:array:perks` | Listing-card bullets (cards, savings, investments, …) |
| `type:array:personas` | All personas the product suits; the first equals `life_stage` |
| `type:array:goals` | `save` · `invest` · `borrow` · `protect` · `spend` · `retire` · `build_credit` · `travel` · `home` · `education` · `family` · `business_growth` · `kids` |
| `type:array:related_skus` | Three cross-sell SKUs (all must exist in the feed) |

## Comparable numeric columns

| Column | Meaning (unit) | `0` means |
|---|---|---|
| `type:number:annual_fee` | Kept for compatibility — always equals `price` (EUR/year) | free |
| `type:number:monthly_fee` | Recurring fee or premium when billed monthly (EUR/month) | not billed monthly |
| `type:number:interest_rate` | APR the customer **pays** to borrow — loans, cards, credit lines (%) | not a borrowing product |
| `type:number:aer` | Rate the customer **earns** — savings AER, staking APY (%) | no yield |
| `type:number:expected_return_min` / `_max` | Target annual return range for investments, not guaranteed (%) | not an investment |
| `type:number:annual_fee_pct` | Ongoing charge as % of assets per year (robo 0.45, crypto portfolio 1.0) | none |
| `type:number:transaction_fee_pct` | Cost per transaction — crypto spread, card-terminal fee (%) | none |
| `type:number:fx_fee_pct` | Foreign-exchange markup (%) | no FX fee |
| `type:number:cashback_percent` | Maximum cashback rate (%) | none |
| `type:number:cashback_monthly_cap` | Monthly cashback cap (EUR) | no cap |
| `type:number:min_amount` | Minimum to open / borrow / deposit / invest (EUR) | no minimum |
| `type:number:max_amount` | Maximum the product handles — loan ceiling, credit limit, deposit cap, insurance cover, holdings cap (EUR) | no cap |
| `type:number:min_term_months` | Minimum term (months) | open-ended |
| `type:number:term_months` | Maximum term (months) | open-ended |
| `type:number:notice_days` | Notice required before withdrawal (days) | instant access |
| `type:number:risk_level` | Risk of capital loss on a 1–10 scale, set for **every** product. 1 = deposit-guaranteed; savings 1–2, bonds 3, robo/pension 4, managed/ESG funds 5, ETFs 6, crypto 8–9 | never 0 |
| `type:number:min_age` | Minimum customer age (years) | any age |
| `type:number:min_income` | Minimum annual income required (EUR/year) | no requirement |
| `type:number:customer_rating` | Average customer rating, 0–5 | — |
| `type:number:review_count` | Number of reviews | — |
| `type:number:popularity_score` | Relative popularity 1–100, for Boost & Bury demos | — |
| `type:date:launched_at` | Launch date `yyyy-mm-ddThh:mm:ss` — products launched July–September 2026 are the "new" ones | — |

## Configuring DY with this feed

- **Searchable fields (Experience Search):** `name` and `tagline` as high priority, then `product_type`, `categories`, `keywords`. Do not make `description` / `long_description` searchable — DY builds its own description-like field during training.
- **Facets:** `categories`, `segment`, `type:array:personas`, `type:array:goals`, `liquidity`, `rate_type`, and the numeric ranges `type:number:risk_level`, `type:number:interest_rate`, `type:number:aer`, `type:number:monthly_fee`.
- **Filters / merchandising rules:** any column above; numeric `min`/`max` filters work on `price` and every `type:number:*` column.
- **Sorting:** `price`, `popularity` (DY's own), or any `type:number:*` column such as `type:number:aer` or `type:number:risk_level`.
- **Affinity (`inform-affinity-v1`):** attribute names must match column names — the site reports `categories`, `goals` and `personas`.
