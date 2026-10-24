# Environment setup

Copy `.env.example` to `.env.local` for local development. Keep real values out of Git and configure deployment values through the hosting provider's environment settings.

## Canonical site URL

Set `SITE_URL` to the verified production origin, for example `https://shop.example.com`. The homepage uses it for canonical metadata, and the sitemap and robots file publish an absolute sitemap URL only when this value is valid. The project currently has no confirmed production domain, so it is intentionally unset.

## Google Analytics 4

Set `GA4_MEASUREMENT_ID` to the property's `G-...` measurement ID in `.env.local` and in the production host environment. No ID is included in the repository. The analytics consent notice appears only when this value is configured. Tracking begins only after a visitor allows analytics; a rejection is saved in that browser. No free-text search terms, personal details, prices, or transaction data are sent.

The current preview reports `page_view`, `view_item_list`, `select_item`, `view_item`, and `search` (without its search term). It does not send cart, checkout, or purchase events: the cart is local preview state, and real pricing, inventory, checkout, and payment confirmation are not connected. Do not add a `purchase` event until a verified successful transaction can be reported by the commerce backend.

To check events, use a test GA4 property, allow analytics in the storefront, then inspect **Admin → DebugView** while testing shop visits, product pages, product selection, and Enter-key searches. In browser developer tools, confirm the `gtag/js?id=G-...` request occurs only after consent and inspect the `g/collect` request payload for the expected event name. Decline analytics to verify that these requests do not load.

Update the privacy notice with the final analytics and consent details before enabling a production measurement ID.

## Commerce integration

The project has Shopify environment placeholders, but no Shopify API, verified product catalog, order flow, delivery configuration, or payment integration is implemented. Product prices, stock, discounts, combo offers, and checkout must remain disabled until the business supplies verified catalog and commerce data. When pricing is approved, any individual discount must be truthful and no greater than 15%; a combo must cost exactly ₹5 less than the sum of its verified individual selling prices, with no stacked discount.
