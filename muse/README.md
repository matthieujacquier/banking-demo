# Shopping Muse — brand configuration

Four paste-ready blocks for the **Shopping Muse** customization screen in the Dynamic Yield admin (site 8782014).

| File | DY field it belongs in | Length |
|---|---|---|
| `BRAND_ARTICLE.md` | Brand / about-your-brand knowledge (the long free-text field Muse grounds its answers on) | ~10,300 words |
| `TONE_OF_VOICE.md` | Tone of voice | ~410 words |
| `TOPICS_TO_AVOID.md` | Topics to avoid | ~405 words |
| `VALUES_TO_EMPHASIZE.md` | Values to emphasise | ~405 words |

Paste the body of each file, without its `#` heading line — the heading is only there to identify the file.

## Notes

- **Everything is consistent with the product feed.** Every rate, fee, minimum, maximum, term, age limit, risk level, rating and review count in the article comes from `lib/products.ts`, which is the same source `nexabank_product_feed.csv` is generated from. If a product number changes, regenerate the feed *and* update the article, or Muse will contradict the product cards it renders.
- **The article is written for an LLM to ground on**, not for a customer to read end to end: short sections, explicit decision rules (the 1–10 risk ladder, save-vs-invest by time horizon, which card by income), worked scenarios, an FAQ, a glossary and a quick-reference card.
- **If the field has a character limit**, cut whole numbered sections from the end rather than trimming sentences throughout — sections 1–7 (identity, commitments, personas, decision frameworks, the catalogue, fees, protection) are the load-bearing ones; 15–20 (story, pairings, FAQ, misconceptions, glossary, quick reference) are the most expendable.
- **The article is the only place brand facts are written down.** Scale figures (4.2m customers, 38 advice centres, six markets, five languages, 2,600 staff, founded 2016 in Amsterdam) and the year-by-year history exist here and nowhere else in the codebase — keep this file as their source of truth.
- Section 14, *How to talk to customers about money*, overlaps deliberately with the tone-of-voice block. If DY's tone field is applied strictly and you want no duplication, drop section 14.
