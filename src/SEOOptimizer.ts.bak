import { 
  OptimizationPlugin, 
  OptimizationContext, 
  OptimizationResult 
} from '@listenrightmeow/replrod/plugin/OptimizationPlugin';
import { RobotsGenerator } from './RobotsGenerator.js';
import { SitemapGenerator } from './SitemapGenerator.js';
import { SEOComponentGenerator } from './SEOComponentGenerator.js';
import { MetaTagsUtilGenerator } from './MetaTagsUtilGenerator.js';
import { IndexHtmlUpdater } from './IndexHtmlUpdater.js';
import { SEOConfigurator } from './SEOConfigurator.js';
import { SEOConfig } from './SEOConfig.js';

export class SEOOptimizer implements OptimizationPlugin {
  name = 'seo';
  description = 'Generate SEO files and components';
  category = 'seo' as const;
  priority = 4;

  private robots = new RobotsGenerator();
  private sitemap = new SitemapGenerator();
  private seoComponent = new SEOComponentGenerator();
  private metaTagsUtil = new MetaTagsUtilGenerator();
  private indexUpdater = new IndexHtmlUpdater();
  private configurator = new SEOConfigurator();

  async isApplicable(_context: OptimizationContext): Promise<boolean> {
    return true;
  }

  async optimize(context: OptimizationContext): Promise<OptimizationResult> {
    try {
      const start = Date.now();
      
      // Check if we're in interactive mode
      const isInteractive = process.env.REPLROD_INTERACTIVE === 'true';
      
      let config;
      if (isInteractive) {
        // Use interactive configuration when run with --plugins seo
        config = await this.configurator.interactiveConfigure(context.projectPath);
      } else {
        // Use non-interactive mode when run with other plugins
        config = await this.configurator.configure(context.projectPath);
      }
      
      const fileCount = await this.generateSEOAssets(context, config);
      
      // Check if using default config (no seo.config.json exists)
      const path = await import('path');
      const fs = await import('fs/promises');
      const configPath = path.join(context.projectPath, 'seo.config.json');
      let isUsingDefaults = false;
      
      try {
        await fs.access(configPath);
      } catch {
        isUsingDefaults = true;
      }
      
      return this.createResult(fileCount, start, isUsingDefaults);
    } catch (error) {
      return this.createError(error);
    }
  }

  async validate(context: OptimizationContext): Promise<boolean> {
    try {
      await this.checkFiles(context);
      return true;
    } catch {
      return false;
    }
  }

  private async generateSEOAssets(
    context: OptimizationContext,
    config: SEOConfig
  ): Promise<number> {
    let fileCount = 0;
    
    // Generate robots.txt with config
    await this.robots.generate(context.projectPath, config.siteUrl);
    fileCount++;
    
    // Generate sitemap.xml with config
    await this.sitemap.generate(context.projectPath, config.siteUrl);
    fileCount++;
    
    // Generate SEO component with config
    await this.seoComponent.generateWithConfig(context.projectPath, config);
    fileCount++;
    
    // Generate meta tags utility
    await this.metaTagsUtil.generate(context.projectPath);
    fileCount++;
    
    // Update index.html with config
    await this.indexUpdater.updateWithConfig(context.projectPath, config);
    fileCount++;
    
    // Generate structured data if needed
    if (config.structuredData) {
      await this.generateStructuredData(context.projectPath, config);
      fileCount++;
    }
    
    return fileCount;
  }


  private async generateStructuredData(
    projectPath: string,
    config: SEOConfig
  ): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const structuredData = this.buildStructuredData(config);
    const filePath = path.join(projectPath, 'client', 'public', 'structured-data.json');
    
    await fs.writeFile(filePath, JSON.stringify(structuredData, null, 2));
  }

  private buildStructuredData(config: SEOConfig): any {
    const baseData: any = {
      '@context': 'https://schema.org',
      '@type': config.structuredData?.type || 'Organization',
      name: config.businessName,
      url: config.siteUrl,
      description: config.description
    };

    // Add logo/image
    if (config.defaultImage) {
      baseData.logo = `${config.siteUrl}${config.defaultImage}`;
      baseData.image = `${config.siteUrl}${config.defaultImage}`;
    }

    // Add location for local businesses
    if (config.isLocal && config.location) {
      baseData.address = {
        '@type': 'PostalAddress',
        streetAddress: config.location.streetAddress,
        addressLocality: config.location.city,
        addressRegion: config.location.state,
        postalCode: config.location.postalCode,
        addressCountry: config.location.country
      };

      if (config.location.coordinates) {
        baseData.geo = {
          '@type': 'GeoCoordinates',
          latitude: config.location.coordinates.latitude,
          longitude: config.location.coordinates.longitude
        };
      }
    }

    // Add contact information
    if (config.contact) {
      if (config.contact.phone) {
        baseData.telephone = config.contact.phone;
      }
      if (config.contact.email) {
        baseData.email = config.contact.email;
      }
      if (config.contact.hours) {
        baseData.openingHours = config.contact.hours;
      }
    }

    // Add social media profiles
    if (config.social) {
      const sameAs = [];
      if (config.social.twitter) {
        sameAs.push(`https://twitter.com/${config.social.twitter}`);
      }
      if (config.social.facebook) {
        sameAs.push(config.social.facebook);
      }
      if (config.social.instagram) {
        sameAs.push(`https://instagram.com/${config.social.instagram}`);
      }
      if (config.social.linkedin) {
        sameAs.push(config.social.linkedin);
      }
      if (config.social.youtube) {
        sameAs.push(config.social.youtube);
      }
      if (config.social.github) {
        sameAs.push(`https://github.com/${config.social.github}`);
      }
      
      if (sameAs.length > 0) {
        baseData.sameAs = sameAs;
      }
    }

    return baseData;
  }

  private async checkFiles(context: OptimizationContext): Promise<void> {
    const path = await import('path');
    const fs = await import('fs/promises');
    
    const publicDir = path.join(context.projectPath, 'client', 'public');
    const robotsPath = path.join(publicDir, 'robots.txt');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    await fs.access(robotsPath);
    await fs.access(sitemapPath);
  }

  private createResult(count: number, start: number, isUsingDefaults: boolean = false): OptimizationResult {
    const baseMessage = `Created ${count} SEO files and components`;
    
    let message = baseMessage;
    if (isUsingDefaults) {
      message = `${baseMessage} with default configuration`;
      
      // Print prominent message for interactive setup
      console.log('\n' + '='.repeat(70));
      console.log('🎯 PERSONALIZE YOUR SEO FOR BETTER SEARCH RANKINGS!');
      console.log('='.repeat(70));
      console.log('\nYour SEO files were created with default settings.');
      console.log('For personalized, business-specific SEO configuration, run:\n');
      console.log('  npx replrod optimize --plugins seo\n');
      console.log('This interactive setup will guide you through:');
      console.log('  • Business information and keywords');
      console.log('  • Target audience and unique value proposition');  
      console.log('  • Local SEO (if applicable)');
      console.log('  • Social media integration');
      console.log('  • SEO strategy and goals\n');
      console.log('='.repeat(70) + '\n');
    } else {
      message = `${baseMessage} with custom configuration`;
    }
    
    return {
      success: true,
      message,
      metrics: {
        improvement: 'Complete SEO setup with business-specific optimization',
        timeBefore: start,
        timeAfter: Date.now()
      }
    };
  }

  private createError(error: unknown): OptimizationResult {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `SEO optimization failed: ${message}`
    };
  }
}