import Head from 'next/head'
import { SEOData, StructuredData } from '@/types/seo'

interface SEOHeadProps {
  seo: SEOData
  structuredData?: StructuredData[]
  breadcrumbs?: { name: string; url: string }[]
}

export default function SEOHead({ seo, structuredData, breadcrumbs }: SEOHeadProps) {
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    noIndex = false
  } = seo

  const siteTitle = title.includes('Jaluxi') ? title : `${title} | Jaluxi - Жалюзи в Санкт-Петербурге`
  const siteDescription = description || 'Профессиональные жалюзи в Санкт-Петербурге. Изготовление, установка и ремонт всех видов жалюзи.'
  
  const jsonLd = structuredData?.map(item => ({
    __html: JSON.stringify(item.data)
  })) || []

  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0 ? {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    })
  } : null

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || siteTitle} />
      <meta property="og:description" content={ogDescription || siteDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || siteTitle} />
      <meta name="twitter:description" content={ogDescription || siteDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Additional SEO Meta */}
      <meta name="author" content="Jaluxi" />
      <meta name="language" content="ru" />
      <meta name="geo.region" content="RU-SPE" />
      <meta name="geo.placename" content="Санкт-Петербург" />
      <meta name="ICBM" content="59.9343,30.3351" />
      
      {/* Structured Data */}
      {jsonLd.map((ld, index) => (
        <script key={`structured-${index}`} type="application/ld+json" dangerouslySetInnerHTML={ld} />
      ))}
      
      {/* Breadcrumbs */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={breadcrumbJsonLd} />
      )}
    </Head>
  )
}
