import { Metadata } from "next";

export interface MetadataProps {
  title: string;
  description: string;
  path: string;
}

export function generatePageMetadata({ title, description, path }: MetadataProps): Metadata {
  const siteUrl = "https://aifinancecalculator.in"; // Placeholder URL
  const fullUrl = `${siteUrl}${path}`;

  return {
    title: `${title} | FinAI India`,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | FinAI India`,
      description,
      url: fullUrl,
      siteName: "FinAI India",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${title} - FinAI India`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | FinAI India`,
      description,
      images: [`${siteUrl}/og-image.png`],
      creator: "@FinAI_India",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateCalculatorSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": name,
    "description": description,
    "url": url,
    "category": "Finance",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}
