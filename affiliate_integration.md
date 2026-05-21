# Affiliate CPA & Click Tracking Integration Guide

This guide details how to integrate affiliate marketing monetizations, click tracking systems, and CPA postback parameters inside **CasinoSwipe**.

---

## 1. Monetization Flow Architecture

```
[ Swipe Discover Card ] ──( Swipe Up or Claim Button )──> [ Generate Unique click_id ]
                                                                     │
                                                                     ▼
[ Redirect Outbound URL ] <──( Deep-linked parameters )── [ Write Click logs / Server ]
         │
         ▼
[ Casino Registration / First Deposit (FTD) ] ───> [ Casino triggers CPA Webhook ]
                                                                 │
                                                                 ▼
                                                  [ Credit Affiliate Commissions ]
```

---

## 2. Dynamic Outbound CPA Redirect Hook

To properly attribute registrations to our marketing channel, every click must append a unique tracking key (typically passed as `subid` or `click_id`) which the operator's tracking software (e.g. MyAffiliates, NetRefer, Cellxpert) logs.

```javascript
/**
 * Triggers affiliate tracking, writes click details to DB logs, and performs outbound redirect
 * @param {Object} casino - Selected matched casino object
 */
function initiateAffiliateRedirect(casino) {
  // 1. Generate unique high-precision transaction key
  const clickId = 'swp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // 2. Formulate tracking parameters payload
  const trackData = {
    clickId: clickId,
    timestamp: new Date().toISOString(),
    casinoId: casino.id,
    targetUrl: casino.affiliateLink,
    userGeo: detectPlayerCountry(),
    campaignId: "casinoswipe_mobile_v1"
  };
  
  // 3. Post to system analytics endpoints (Fire-and-forget)
  navigator.sendBeacon('https://api.casinoswipe.com/v1/clicks', JSON.stringify(trackData));
  
  // 4. Formulate the final tracking URL using standard parameters
  // subid/click_id parameters differ depending on operator software:
  const finalAffiliateUrl = `${casino.affiliateLink}&subid=${clickId}&click_id=${clickId}&utm_source=casinoswipe`;
  
  // 5. Open deep-linked URL to registration or play screen
  window.open(finalAffiliateUrl, '_blank');
}
```

---

## 3. Standard URL Parameter Mapping by Affiliate Software

When setting up casino campaigns on the backend panel, choose the parameter format based on the casino's tracking partner:

| Software Provider | Standard Outbound Parameter | Example Outbound Redirect URL |
|---|---|---|
| **MyAffiliates** | `subid=` or `customid=` | `https://royal.partners/visit/?bta=1234&brand=spinroyal&subid=swp_98765` |
| **NetRefer** | `subid=` or `s=` | `https://ref.grandcasino.com/redirect.aspx?pid=112&bid=45&subid=swp_98765` |
| **Cellxpert** | `clickid=` or `keyword=` | `https://track.bitvelocity.io/visit/?bta=99&brand=bitv&clickid=swp_98765` |
| **Scaleo** | `aff_sub1=` | `https://betstrike.scaleo.com/click?o=15&a=22&aff_sub1=swp_98765` |

---

## 4. CPA Postback S2S Webhook (Post-Registration Conversion)

Once a swiped player completes their registration and makes their first deposit (FTD) at the casino, the casino's system triggers a Server-to-Server (S2S) postback webhook back to our servers to record the conversion:

- **Webhook URL Endpoint**: `https://api.casinoswipe.com/v1/postbacks`
- **Method**: `GET` or `POST`
- **CPA Trigger Parameters**:
  - `click_id`: matches the original subid we generated (e.g. `swp_98765`).
  - `status`: conversion state (e.g. `signup`, `lead`, `ftd`).
  - `payout`: commission payout (e.g. `250.00` in EUR).
  - `currency`: currency code (e.g. `EUR`).
