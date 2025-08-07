import * as fs from 'fs/promises';
import * as path from 'path';
import { SEOConfig } from './SEOConfig.js';

export class IndexHtmlUpdater {
  async update(projectPath: string): Promise<void> {
    const indexPath = await this.findIndexHtml(projectPath);
    if (!indexPath) return;
    
    let content = await fs.readFile(indexPath, 'utf-8');
    content = this.addMetaTags(content);
    
    await fs.writeFile(indexPath, content);
  }

  async updateWithConfig(projectPath: string, config: SEOConfig): Promise<void> {
    const indexPath = await this.findIndexHtml(projectPath);
    if (!indexPath) return;
    
    let content = await fs.readFile(indexPath, 'utf-8');
    content = this.addMetaTagsWithConfig(content, config);
    
    await fs.writeFile(indexPath, content);
  }

  private async findIndexHtml(projectPath: string): Promise<string | null> {
    const paths = [
      path.join(projectPath, 'index.html'),
      path.join(projectPath, 'client/index.html'),
      path.join(projectPath, 'client/public/index.html')
    ];
    
    for (const p of paths) {
      try {
        await fs.access(p);
        return p;
      } catch {
        continue;
      }
    }
    
    return null;
  }

  private addMetaTags(content: string): string {
    if (content.includes('og:title')) {
      return content; // Already has meta tags
    }
    
    const metaTags = `    <!-- SEO Meta Tags -->
    <meta name="description" content="Your site description">
    <meta name="keywords" content="your, keywords, here">
    <meta name="author" content="Your Name">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Your Site Title">
    <meta property="og:description" content="Your site description">
    <meta property="og:image" content="/og-image.png">
    <meta property="og:url" content="https://example.com">
    <meta property="og:type" content="website">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Your Site Title">
    <meta name="twitter:description" content="Your site description">
    <meta name="twitter:image" content="/og-image.png">`;
    
    return content.replace(
      '</head>',
      `${metaTags}\n  </head>`
    );
  }

  private addMetaTagsWithConfig(content: string, config: SEOConfig): string {
    if (content.includes('og:title')) {
      return content; // Already has meta tags
    }
    
    const twitterHandle = config.social?.twitter ? `@${config.social.twitter}` : '';
    
    const metaTags = `    <!-- SEO Meta Tags -->
    <meta name="description" content="${config.description}">
    <meta name="keywords" content="${config.keywords.join(', ')}">
    <meta name="author" content="${config.author || config.businessName}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${config.siteName}">
    <meta property="og:description" content="${config.description}">
    <meta property="og:image" content="${config.siteUrl}${config.defaultImage}">
    <meta property="og:url" content="${config.siteUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${config.siteName}">
    <meta property="og:locale" content="${config.locale || 'en_US'}">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${config.siteName}">
    <meta name="twitter:description" content="${config.description}">
    <meta name="twitter:image" content="${config.siteUrl}${config.defaultImage}">
    ${twitterHandle ? `<meta name="twitter:site" content="${twitterHandle}">` : ''}
    ${twitterHandle ? `<meta name="twitter:creator" content="${twitterHandle}">` : ''}
    
    <!-- Additional SEO Meta Tags -->
    <meta name="theme-color" content="${config.themeColor || '#ffffff'}">
    <link rel="canonical" href="${config.siteUrl}">`;
    
    // Add structured data script
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': config.structuredData?.type || 'Organization',
      name: config.businessName,
      url: config.siteUrl,
      description: config.description,
      logo: `${config.siteUrl}${config.defaultImage}`
    };
    
    const structuredDataScript = `
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>`;
    
    return content.replace(
      '</head>',
      `${metaTags}\n${structuredDataScript}\n  </head>`
    );
  }
}