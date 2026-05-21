# iGaming Compliance & Responsible Gambling Market Checklist

To successfully launch **CasinoSwipe** in key target jurisdictions, the platform must satisfy the unique regulatory requirements of each market regarding advertising, age verifications, licensing details, and safety checks.

---

## 1. Core General Platform Requirements (Universal)

- **Age Verification Gate**: Must prompt an active, non-skippable gate verifying that the visitor is 18+ (or 21+ depending on market laws) before loading any promo cards.
- **Wagering Transparency**: Wagering requirements rating (🟢 Low, 🟡 Medium, 🔴 High) and exact numbers (e.g. "35x") must be prominently displayed next to the bonus title.
- **RG Helpline Disclaimer**: Every casino listing must show a responsible gambling helpline reminder (e.g., "🔞 Be Gamble Aware. 18+ only. Standard terms apply").
- **Self-Exclusion Mechanism**: The discovery platform must provide a one-click local cool-off tool that disables swiping, profiles, matches, and outbound referral links for a minimum of 24 hours.

---

## 2. Market Specific Regulations

### 🇬🇧 United Kingdom (UKGC Compliant)
- **Mandatory licensing**: Only display casinos holding an active license from the **United Kingdom Gambling Commission**.
- **No credit cards**: Outbound payment icons must not suggest credit cards are permitted for gambling deposits (debit cards & e-wallets only).
- **GamStop link**: Include reference links to the UK's national self-exclusion database (GamStop) in the footer.
- **Bonus Wording**: Promotional descriptions must not suggest payouts or wins are "guaranteed" or "risk-free". Exact terms and conditions (T&Cs apply) must be inline.

### 🇩🇪 Germany (GlüStV / GGL Compliant)
- **OASIS System Integration**: The platform must reference OASIS national self-exclusion registration details.
- **Strict Spin Limits**: Slot profiles must show details regarding the €1 maximum stake per spin regulations in Germany.
- **LUGAS Connection**: Mock systems should describe compliance checks validating that players aren't active on multiple bookmaker sites simultaneously.
- **5-Second Rule**: Mention that automatic slot autoplay is strictly forbidden for German traffic.

### 🇨🇦 Canada (Kahnawake & Ontario iGaming Compliant)
- **Ontario Geo-fence**: If serving Ontario players, the platform must filter and show only **iGaming Ontario (iGO)** registered operators.
- **Multi-lingual support**: Offer toggles for English and Canadian French options.
- **Currency matching**: All bonuses must display in Canadian Dollars (CAD / $).
- **Licensed by Kahnawake**: Outside Ontario, verify registrations with the Kahnawake Gaming Commission.

### 🇳🇿 New Zealand (DIA Guidelines Compliant)
- **Offshore Operator Checks**: Inform NZ players that offshore online casinos are legal to join as long as they are fully certified in reputable international jurisdictions (MGA/Curaçao).
- **NZD Promos**: List NZD currency equivalents to maximize conversion conversions.

---

## 3. Platform Compliance Matrix Summary

| Regulatory Body | License Area | Minimum Age | Required Safety Features | Suggested Action |
|---|---|---|---|---|
| **UKGC** | United Kingdom | 18+ | Debit cards only, GamStop, Strict promo words | Hard Filter active for UK geo-market |
| **GGL (GlüStV)**| Germany | 18+ | OASIS cross-reference, spin speed, deposit ceilings | Hard Filter + German translation hooks |
| **iGO (Ontario)**| Ontario (CA) | 19+ | Strict geofencing, CAD currencies | Hard geo-routing validation |
| **MGA** | International | 18+ | Deposit ceilings, cool-offs, standard KYC | Default international fallback |
