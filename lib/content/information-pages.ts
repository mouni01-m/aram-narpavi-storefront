import type { Metadata } from "next";

export type DraftStatus = "development-draft" | "pending-owner-approval" | "verified-current-state";

export type PolicySection = {
  title: string;
  pendingDecision: string;
};

export type PolicyPageKey = "delivery" | "refund" | "cancellation" | "privacy" | "terms";

export const draftRobots = { index: false, follow: false, nocache: true } as const;

/** Owner-supplied contact channels. The additional number's role remains unconfirmed. */
export const contactDetails = {
  email: "aramnarpavi@gmail.com",
  whatsapp: "+91 9585304545",
  additionalPhone: "+91 9655082924",
} as const;

export function createDraftMetadata(title: string, description: string): Metadata {
  return { title: `${title} | Aram Narpavi Herbals`, description, robots: draftRobots };
}

export const aboutContent = {
  status: "development-draft" satisfies DraftStatus,
  title: "About Aram Narpavi Herbals",
  tagline: "Nature’s Purity, Tradition’s Healing",
  introduction: "Aram Narpavi Herbals is developing a considered storefront for personal-care and pantry products, guided by a traditional, nature-inspired brand direction.",
  philosophy: "The intended experience is calm and practical: clear product information, readable guidance and simple ways to explore products for everyday routines.",
  values: [
    { title: "Clarity", body: "Present product and order information only after it has been checked against approved records." },
    { title: "Everyday usefulness", body: "Design product discovery around the questions people need answered before choosing." },
    { title: "Respect for evidence", body: "Keep product claims, labels and operational details behind review until supporting information is available." },
  ],
} as const;

export const faqGroups = [
  {
    title: "Products and product information",
    items: [
      { question: "Where can I find a product’s ingredients?", answer: "Product-specific ingredients will be published after the exact information has been checked against the current approved label. Until then, use the approved pack label as the reference.", status: "verified-current-state" },
      { question: "How do I use a product?", answer: "Follow the directions on the product’s approved label. Online directions will be added only after they have been verified for that specific product.", status: "verified-current-state" },
      { question: "How do I check allergens or precautions?", answer: "Verified allergen and precaution information has not yet been supplied for the product previews. Check the approved pack label and do not rely on one product’s information for another.", status: "verified-current-state" },
    ],
  },
  {
    title: "Orders and shopping",
    items: [
      { question: "Can I place an order on this storefront?", answer: "Ordering is not enabled in the current development preview. Prices, availability, cart and checkout have not been connected.", status: "verified-current-state" },
      { question: "Which payment methods are available?", answer: "Payment methods and checkout behavior require confirmation when the commerce integration is configured.", status: "pending-owner-approval" },
    ],
  },
  {
    title: "Delivery",
    items: [
      { question: "How are delivery charges calculated?", answer: "Delivery charges, serviceable locations and any threshold remain unconfirmed. They must match the future configured checkout and approved Delivery Policy.", status: "pending-owner-approval" },
      { question: "How long will delivery take?", answer: "Dispatch and delivery estimates have not been approved. No delivery timeframe is promised by this preview.", status: "pending-owner-approval" },
    ],
  },
  {
    title: "Returns and cancellations",
    items: [
      { question: "Can I return or exchange a product?", answer: "Eligibility, reporting windows, product-category exceptions, return shipping and available resolutions still require owner and legal review.", status: "pending-owner-approval" },
      { question: "Can I cancel an order?", answer: "The cancellation request channel, cutoff and relationship to refunds have not been approved.", status: "pending-owner-approval" },
      { question: "What if an order is damaged, incorrect or incomplete?", answer: "The reporting channel, evidence requirements, reporting period and available remedies still require approval.", status: "pending-owner-approval" },
    ],
  },
  {
    title: "Contact and support",
    items: [
      { question: "How can I contact Aram Narpavi Herbals?", answer: "Verified support contact details and a working message-delivery service have not yet been supplied. The Contact page shows the planned form in a disabled development state.", status: "verified-current-state" },
    ],
  },
] as const;

export const policyPages: Record<PolicyPageKey, {
  title: string;
  eyebrow: string;
  description: string;
  sections: readonly PolicySection[];
}> = {
  delivery: {
    title: "Delivery Policy",
    eyebrow: "Draft delivery structure",
    description: "This page identifies the delivery decisions that must be confirmed before customer-facing terms can be published.",
    sections: [
      { title: "Coverage and serviceable locations", pendingDecision: "Confirm destinations, excluded locations and how serviceability will be checked." },
      { title: "Shipping and delivery charges", pendingDecision: "Confirm the actual checkout rate rules, order conditions and whether any threshold applies." },
      { title: "Processing and dispatch", pendingDecision: "Confirm payment conditions, order-processing steps and the dispatch timeframe the operation can meet." },
      { title: "Delivery estimates", pendingDecision: "Confirm carrier-dependent transit estimates and how location differences will be communicated." },
      { title: "Tracking and delivery updates", pendingDecision: "Confirm the carrier workflow and the channel used for dispatch and tracking updates." },
      { title: "Incorrect, incomplete or damaged deliveries", pendingDecision: "Confirm the reporting period, information required and available resolution process." },
      { title: "Support and escalation", pendingDecision: "Provide an approved support channel and escalation procedure." },
    ],
  },
  refund: {
    title: "Refund and Return Policy",
    eyebrow: "Draft returns structure",
    description: "Return, replacement and refund terms remain subject to operational and legal approval.",
    sections: [
      { title: "Scope and eligibility", pendingDecision: "Define eligible issues, products and conditions, including any category-specific requirements." },
      { title: "Damaged, defective, incorrect or missing items", pendingDecision: "Confirm how each issue is reported, assessed and resolved." },
      { title: "Return request process", pendingDecision: "Provide the approved support channel, reporting window and steps for a request." },
      { title: "Documentation", pendingDecision: "Confirm whether order details, photographs or other evidence are required." },
      { title: "Return shipping", pendingDecision: "Confirm pickup arrangements, shipping responsibility and any applicable cost." },
      { title: "Refunds and processing", pendingDecision: "Define eligibility, method and processing timeframe only after the payment workflow is known." },
      { title: "Exceptions and support", pendingDecision: "Review food, personal-care, opened-product and other exceptions with appropriate advice; provide a verified contact." },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    eyebrow: "Draft cancellation structure",
    description: "Cancellation terms depend on the future order-management and fulfilment workflow.",
    sections: [
      { title: "Submitting a request", pendingDecision: "Provide the approved request channel and the information a customer must include." },
      { title: "When cancellation may be possible", pendingDecision: "Define the operational cutoff without promising that every request can be completed." },
      { title: "Processed or dispatched orders", pendingDecision: "Confirm how fulfilment status affects cancellation and which policy applies afterward." },
      { title: "Cancellation and refunds", pendingDecision: "Align any eligible reversal with the confirmed payment and refund process." },
      { title: "Customer support", pendingDecision: "Provide a verified support channel and escalation process." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Draft privacy structure",
    description: "Actual data practices and legal requirements must be mapped before this policy can be approved.",
    sections: [
      { title: "Information collected", pendingDecision: "Map account, order, checkout, contact, device and other data actually collected by the final services." },
      { title: "How information is used", pendingDecision: "Document each operational purpose and the appropriate legal basis with qualified review." },
      { title: "Orders and service providers", pendingDecision: "Identify the actual commerce, payment, hosting, delivery and support providers and their roles." },
      { title: "Cookies and analytics", pendingDecision: "Document the cookies and analytics that are actually enabled, together with the consent approach." },
      { title: "Payment processing", pendingDecision: "Describe the confirmed payment flow and responsible provider without implying local card collection." },
      { title: "Retention and sharing", pendingDecision: "Approve retention periods, deletion processes and the circumstances in which information is shared." },
      { title: "Customer requests", pendingDecision: "Confirm applicable rights, identity checks, request procedure and a verified privacy contact." },
      { title: "Security and policy updates", pendingDecision: "Document appropriate safeguards, update procedures and the policy effective date." },
    ],
  },
  terms: {
    title: "Terms and Conditions",
    eyebrow: "Draft terms structure",
    description: "These headings are a development outline and do not create approved contractual terms.",
    sections: [
      { title: "Introduction and acceptance", pendingDecision: "Confirm the legal operator, customer scope and basis on which website terms take effect." },
      { title: "Product information", pendingDecision: "Define how verified descriptions, imagery, variants and corrections will be handled." },
      { title: "Orders and availability", pendingDecision: "Confirm order acceptance, inventory, modification and refusal rules in the actual commerce workflow." },
      { title: "Pricing and payment", pendingDecision: "Confirm currencies, taxes, payment providers, pricing corrections and payment conditions." },
      { title: "Shipping and delivery", pendingDecision: "Align with the approved Delivery Policy and configured checkout." },
      { title: "Cancellations, returns and refunds", pendingDecision: "Align with approved policies and actual operational processes." },
      { title: "Acceptable website use and intellectual property", pendingDecision: "Obtain review of permitted use, ownership and enforcement wording." },
      { title: "Liability and disclaimers", pendingDecision: "Obtain qualified legal review; no limitation, warranty or remedy terms are approved here." },
      { title: "Changes, governing terms and contact", pendingDecision: "Confirm update notice, governing jurisdiction, dispute process, legal entity and verified contact." },
    ],
  },
};
