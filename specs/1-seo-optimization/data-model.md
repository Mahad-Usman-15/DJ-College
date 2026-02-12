# Data Model: SEO Optimization for DJ College Website

## Entities

### SEO Metadata
**Description**: SEO-related metadata for each page
**Fields**:
- title: String (page title optimized for search)
- description: String (meta description for search snippets)
- keywords: Array<String> (relevant keywords for the page)
- ogTitle: String (Open Graph title)
- ogDescription: String (Open Graph description)
- ogImage: String (Open Graph image URL)
- twitterTitle: String (Twitter card title)
- twitterDescription: String (Twitter card description)
- canonicalUrl: String (canonical URL to prevent duplicate content)
- hreflang: Object (language and region-specific URLs)

### Schema Markup
**Description**: Structured data markup for search engines
**Fields**:
- type: String (schema type: Organization, EducationalOrganization, LocalBusiness, etc.)
- name: String (name of entity)
- description: String (description of entity)
- url: String (official URL)
- address: Object (physical address with street, locality, region, postal code, country)
- telephone: String (contact phone number)
- email: String (contact email)
- sameAs: Array<String> (social media/profile URLs)
- areaServed: String (geographic area served)
- availableLanguage: Array<String> (languages offered)

### Core Web Vitals Metrics
**Description**: Performance metrics for SEO optimization
**Fields**:
- lcp: Number (Largest Contentful Paint in seconds)
- fcp: Number (First Contentful Paint in seconds)
- fid: Number (First Input Delay in milliseconds)
- cls: Number (Cumulative Layout Shift)
- ttfb: Number (Time to First Byte in seconds)
- fcpTarget: Number (target FCP: <= 1.8s for excellent, <= 2.5s for good)
- lcpTarget: Number (target LCP: <= 2.5s for good)
- clsTarget: Number (target CLS: <= 0.1 for good)
- fidTarget: Number (target FID: <= 100ms for good)

### Page Performance Data
**Description**: Performance data for individual pages
**Fields**:
- path: String (URL path of the page)
- mobileLcp: Number (mobile LCP score)
- desktopLcp: Number (desktop LCP score)
- mobileCls: Number (mobile CLS score)
- desktopCls: Number (desktop CLS score)
- mobileFid: Number (mobile FID score)
- desktopFid: Number (desktop FID score)
- loadingTime: Number (overall loading time in seconds)
- status: String (performance status: excellent, good, needs improvement)

### Sitemap Entry
**Description**: Individual entry in the sitemap
**Fields**:
- url: String (full URL of the page)
- lastmod: Date (last modification date)
- changefreq: String (how frequently the page changes: daily, weekly, monthly, yearly, never)
- priority: Number (priority of the page relative to others: 0.0 to 1.0)
- images: Array<Object> (optional array of images on the page with titles and captions)
- alternates: Array<Object> (optional alternate language versions)

### Accessibility Compliance
**Description**: Accessibility metrics and compliance data
**Fields**:
- pageUrl: String (URL of the page being assessed)
- wcagLevel: String (WCAG compliance level: A, AA, AAA)
- colorContrastIssues: Number (number of color contrast issues)
- altTextMissing: Number (number of images without alt text)
- headingStructureIssues: Number (issues with heading hierarchy)
- keyboardNavigationScore: Number (score for keyboard navigation, 0-100)
- screenReaderCompatibility: Boolean (whether content is screen reader friendly)