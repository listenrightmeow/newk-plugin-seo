import * as fs from 'fs/promises';
import * as path from 'path';

export class MetaTagsUtilGenerator {
  async generate(projectPath: string): Promise<void> {
    const utilsDir = path.join(projectPath, 'client/src/utils');
    await fs.mkdir(utilsDir, { recursive: true });
    
    const content = this.createUtility();
    const filePath = path.join(utilsDir, 'metaTags.ts');
    
    await fs.writeFile(filePath, content);
  }

  private createUtility(): string {
    return `interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  twitterUsername?: string;
}

export class MetaTags {
  private static instance: MetaTags;
  
  static getInstance(): MetaTags {
    if (!MetaTags.instance) {
      MetaTags.instance = new MetaTags();
    }
    return MetaTags.instance;
  }

  updateMetaTags(config: MetaTagsConfig): void {
    if (config.title) {
      document.title = config.siteName 
        ? \`\${config.title} | \${config.siteName}\`
        : config.title;
    }

    this.setMetaTag('description', config.description);
    this.setMetaTag('keywords', config.keywords);
    this.setMetaTag('author', config.author);
    
    this.updateOpenGraph(config);
    this.updateTwitterCards(config);
    this.updateStructuredData(config);
  }

  private updateOpenGraph(config: MetaTagsConfig): void {
    const title = config.siteName 
      ? \`\${config.title} | \${config.siteName}\`
      : config.title;
      
    this.setMetaTag('og:title', title, 'property');
    this.setMetaTag('og:description', config.description, 'property');
    this.setMetaTag('og:image', config.image, 'property');
    this.setMetaTag('og:url', config.url, 'property');
    this.setMetaTag('og:type', config.type || 'website', 'property');
    this.setMetaTag('og:site_name', config.siteName, 'property');
  }

  private updateTwitterCards(config: MetaTagsConfig): void {
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', config.title);
    this.setMetaTag('twitter:description', config.description);
    this.setMetaTag('twitter:image', config.image);
    
    if (config.twitterUsername) {
      this.setMetaTag('twitter:site', config.twitterUsername);
      this.setMetaTag('twitter:creator', config.twitterUsername);
    }
  }

  private updateStructuredData(config: MetaTagsConfig): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': config.type === 'article' ? 'Article' : 'WebSite',
      name: config.siteName || config.title,
      description: config.description,
      url: config.url,
      image: config.image,
      author: {
        '@type': 'Person',
        name: config.author
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(structuredData);
  }

  private setMetaTag(name: string, content?: string, attr = 'name'): void {
    if (!content) return;
    
    let tag = document.querySelector(\`meta[\${attr}="\${name}"]\`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }
}

export const metaTags = MetaTags.getInstance();`;
  }
}