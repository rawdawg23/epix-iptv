export interface SchemaOrganization {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  phone?: string;
  socialProfiles?: string[];
}

export interface SchemaProduct {
  name: string;
  description: string;
  brand: string;
  offers: Array<{
    priceCurrency: string;
    price: number;
    name: string;
    url?: string;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface SchemaArticle {
  headline: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}

export interface SchemaFAQ {
  question: string;
  answer: string;
}

export interface SchemaBreadcrumb {
  name: string;
  url: string;
}

export function generateOrganizationSchema(org: SchemaOrganization) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: org.email,
      ...(org.phone && { telephone: org.phone }),
    },
    ...(org.socialProfiles && org.socialProfiles.length > 0 && {
      sameAs: org.socialProfiles,
    }),
  };
}

export function generateProductSchema(product: SchemaProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: product.offers.map(offer => ({
      '@type': 'Offer',
      priceCurrency: offer.priceCurrency,
      price: offer.price.toString(),
      name: offer.name,
      availability: 'https://schema.org/InStock',
      ...(offer.url && { url: offer.url }),
    })),
    ...(product.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateArticleSchema(article: SchemaArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished.toISOString(),
    ...(article.dateModified && {
      dateModified: article.dateModified.toISOString(),
    }),
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      },
    },
  };
}

export function generateFAQSchema(faqs: SchemaFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: SchemaBreadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebSiteSchema(name: string, url: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateServiceSchema(
  name: string,
  description: string,
  provider: { name: string; url: string },
  areaServed: string = 'Worldwide'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider.name,
      url: provider.url,
    },
    areaServed,
    serviceType: 'IPTV Streaming Service',
  };
}

export interface SchemaReview {
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: Date;
}

export function generateReviewSchema(
  reviews: SchemaReview[],
  itemReviewed: { name: string; type?: string }
) {
  if (reviews.length === 0) return null;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.ratingValue, 0) / reviews.length;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemReviewed.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.ratingValue,
        bestRating: 5,
        worstRating: 1,
      },
      ...(review.datePublished && {
        datePublished: review.datePublished.toISOString(),
      }),
    })),
  };
}

export function generateLocalBusinessSchema(
  name: string,
  url: string,
  description: string,
  email: string,
  priceRange: string = '$$'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url,
    description,
    email,
    priceRange,
    '@id': url,
  };
}
