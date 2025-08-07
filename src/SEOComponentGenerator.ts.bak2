import * as fs from 'fs/promises';
import * as path from 'path';
import { SEOConfig } from './SEOConfig.js';

export class SEOComponentGenerator {
  async generate(projectPath: string): Promise<void> {
    const componentDir = path.join(projectPath, 'client/src/components/SEO');
    await fs.mkdir(componentDir, { recursive: true });
    
    const content = this.createComponent();
    const filePath = path.join(componentDir, 'SEO.tsx');
    
    await fs.writeFile(filePath, content);
  }

  async generateWithConfig(projectPath: string, config: SEOConfig): Promise<void> {
    const componentDir = path.join(projectPath, 'client/src/components/SEO');
    await fs.mkdir(componentDir, { recursive: true });
    
    // Config file should already exist from configurator
    
    // Generate component with config
    const content = this.createComponentWithConfig(config);
    const filePath = path.join(componentDir, 'SEO.tsx');
    
    await fs.writeFile(filePath, content);
  }

  private createComponent(): string {
    return `import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Your Site Title',
  description = 'Your site description',
  keywords = 'your, keywords, here',
  author = 'Your Name',
  image = '/og-image.png',
  url = window.location.href,
  type = 'website'
}) => {
  const siteName = 'Your Site Name';
  const fullTitle = \`\${title} | \${siteName}\`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Helmet>
  );
};

export default SEO;`;
  }

  private createComponentWithConfig(config: SEOConfig): string {
    const twitterHandle = config.social?.twitter ? `@${config.social.twitter}` : '';
    
    return `import React from 'react';
import { Helmet } from 'react-helmet-async';
import seoConfig from '../../../seo.config.json';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = seoConfig.description,
  keywords = seoConfig.keywords,
  author = seoConfig.author,
  image = seoConfig.defaultImage,
  url,
  type = 'website',
  noindex = false,
  article
}) => {
  const pageTitle = title ? \`\${title} | \${seoConfig.siteName}\` : seoConfig.siteName;
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : seoConfig.siteUrl);
  const imageUrl = image.startsWith('http') ? image : \`\${seoConfig.siteUrl}\${image}\`;

  // Build structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : '${config.structuredData?.type || 'Organization'}',
    name: pageTitle,
    url: pageUrl,
    description,
    ...(type === 'article' && article && {
      headline: title || seoConfig.siteName,
      image: imageUrl,
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime,
      author: {
        '@type': 'Person',
        name: article.author || author
      }
    }),
    ...(!article && {
      logo: \`\${seoConfig.siteUrl}\${seoConfig.defaultImage}\`,
      ${config.isLocal ? `
      address: {
        '@type': 'PostalAddress',
        streetAddress: '${config.location?.streetAddress || ''}',
        addressLocality: '${config.location?.city || ''}',
        addressRegion: '${config.location?.state || ''}',
        postalCode: '${config.location?.postalCode || ''}',
        addressCountry: '${config.location?.country || ''}'
      },` : ''}
      ${config.social ? `
      sameAs: [
        ${config.social.twitter ? `'https://twitter.com/${config.social.twitter}',` : ''}
        ${config.social.facebook ? `'${config.social.facebook}',` : ''}
        ${config.social.instagram ? `'https://instagram.com/${config.social.instagram}',` : ''}
        ${config.social.linkedin ? `'${config.social.linkedin}',` : ''}
        ${config.social.youtube ? `'${config.social.youtube}',` : ''}
        ${config.social.github ? `'https://github.com/${config.social.github}',` : ''}
      ].filter(Boolean)` : ''}
    })
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={pageUrl} />
      
      {/* Robots meta tag */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph meta tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale || 'en_US'} />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      ${twitterHandle ? `<meta name="twitter:site" content="${twitterHandle}" />` : ''}
      ${twitterHandle ? `<meta name="twitter:creator" content="${twitterHandle}" />` : ''}

      {/* Additional SEO meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content={seoConfig.themeColor || '#ffffff'} />

      {/* Article-specific meta tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;`;
  }
}