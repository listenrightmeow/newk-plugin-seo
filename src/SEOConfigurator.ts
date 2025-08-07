import * as fs from 'fs/promises';
import * as path from 'path';
import { SEOConfig, SEOAnswers } from './SEOConfig.js';

export class SEOConfigurator {
  async configure(projectPath: string): Promise<SEOConfig> {
    const configPath = path.join(projectPath, 'seo.config.json');
    
    // Check for existing config
    try {
      const existing = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(existing);
      
      // Always use existing config without prompting
      console.log('ℹ Using existing SEO configuration from seo.config.json');
      return config;
    } catch {
      // No existing config - use defaults
      console.log('\n⚠️  No SEO configuration found - using defaults\n');
      return this.getDefaultConfig(projectPath);
    }
  }

  async interactiveConfigure(projectPath: string): Promise<SEOConfig> {
    const configPath = path.join(projectPath, 'seo.config.json');
    
    // Check for existing config
    try {
      const existing = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(existing);
      
      const inquirer = await import('inquirer');
      const { useExisting } = await inquirer.default.prompt([{
        type: 'confirm',
        name: 'useExisting',
        message: 'Found existing SEO configuration. Use it?',
        default: true
      }]);
      
      if (useExisting) {
        return config;
      }
    } catch {
      // No existing config, continue with setup
    }

    console.log('\n🎯 SEO Configuration Setup\n');
    console.log('Let\'s set up comprehensive SEO for your website.\n');

    // Gather information through prompts
    const answers = await this.gatherInformation();
    const config = this.buildConfig(answers);
    
    // Save configuration
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log('\n✅ SEO configuration saved to seo.config.json');
    
    return config;
  }

  private async gatherInformation(): Promise<SEOAnswers> {
    const inquirer = await import('inquirer');
    
    // Basic Information
    console.log('\n📋 Basic Information\n');
    const basicInfo = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'businessName',
        message: 'What is your business/website name?',
        validate: (input) => input.length > 0 || 'Business name is required'
      },
      {
        type: 'input',
        name: 'siteUrl',
        message: 'What is your website URL?',
        default: 'https://example.com',
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch {
            return 'Please enter a valid URL';
          }
        }
      },
      {
        type: 'list',
        name: 'businessType',
        message: 'What type of business/website is this?',
        choices: [
          'E-commerce',
          'SaaS/Software',
          'Blog/Content',
          'Portfolio',
          'Corporate/Business',
          'Restaurant/Food',
          'Health/Medical',
          'Education',
          'Real Estate',
          'Other Service'
        ]
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe your business in 1-2 sentences:',
        validate: (input) => input.length > 10 || 'Please provide a meaningful description'
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Enter main keywords (comma-separated):',
        default: 'website, business, service'
      }
    ]);

    // Target Audience & Value Proposition
    console.log('\n🎯 Target Audience & Value\n');
    const audienceInfo = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'targetAudience',
        message: 'Who is your target audience?',
        default: 'General consumers'
      },
      {
        type: 'input',
        name: 'uniqueValue',
        message: 'What makes your business unique?'
      }
    ]);

    // Location Information
    console.log('\n📍 Location Information\n');
    const { isLocal } = await inquirer.default.prompt([
      {
        type: 'confirm',
        name: 'isLocal',
        message: 'Do you have a physical location/serve a local area?',
        default: false
      }
    ]);

    let locationInfo: any = {};
    if (isLocal) {
      locationInfo = await inquirer.default.prompt([
        {
          type: 'input',
          name: 'streetAddress',
          message: 'Street address:'
        },
        {
          type: 'input',
          name: 'city',
          message: 'City:',
          validate: (input) => input.length > 0 || 'City is required for local SEO'
        },
        {
          type: 'input',
          name: 'state',
          message: 'State/Province:'
        },
        {
          type: 'input',
          name: 'postalCode',
          message: 'Postal/ZIP code:'
        },
        {
          type: 'input',
          name: 'country',
          message: 'Country:',
          default: 'United States'
        }
      ]);

      // Contact information for local businesses
      const contactInfo = await inquirer.default.prompt([
        {
          type: 'input',
          name: 'phone',
          message: 'Business phone number (optional):'
        },
        {
          type: 'input',
          name: 'email',
          message: 'Business email (optional):'
        },
        {
          type: 'input',
          name: 'hours',
          message: 'Business hours (e.g., Mon-Fri 9-5):'
        }
      ]);

      locationInfo = { ...locationInfo, ...contactInfo };
    }

    // SEO Strategy
    console.log('\n📈 SEO Strategy\n');
    const seoStrategy = await inquirer.default.prompt([
      {
        type: 'list',
        name: 'primaryGoal',
        message: 'What is your primary SEO goal?',
        choices: [
          { name: 'Increase website traffic', value: 'traffic' },
          { name: 'Generate leads/inquiries', value: 'leads' },
          { name: 'Drive online sales', value: 'sales' },
          { name: 'Build brand awareness', value: 'awareness' }
        ]
      },
      {
        type: 'input',
        name: 'targetKeywords',
        message: 'List your top target keywords (comma-separated):',
        default: basicInfo.keywords
      },
      {
        type: 'input',
        name: 'competitors',
        message: 'List main competitors (comma-separated, optional):'
      }
    ]);

    // Social Media
    console.log('\n📱 Social Media (optional)\n');
    const socialInfo = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'twitter',
        message: 'Twitter/X handle (without @):'
      },
      {
        type: 'input',
        name: 'facebook',
        message: 'Facebook page URL:'
      },
      {
        type: 'input',
        name: 'instagram',
        message: 'Instagram handle:'
      },
      {
        type: 'input',
        name: 'linkedin',
        message: 'LinkedIn page URL:'
      },
      {
        type: 'input',
        name: 'youtube',
        message: 'YouTube channel URL:'
      },
      {
        type: 'input',
        name: 'github',
        message: 'GitHub organization/user:'
      }
    ]);

    // Author Information
    const { author } = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'author',
        message: 'Content author/company name:',
        default: basicInfo.businessName
      }
    ]);

    return {
      ...basicInfo,
      ...audienceInfo,
      isLocal,
      ...locationInfo,
      ...seoStrategy,
      ...socialInfo,
      author
    };
  }

  private buildConfig(answers: SEOAnswers): SEOConfig {
    const config: SEOConfig = {
      // Basic Information
      siteName: answers.businessName,
      siteUrl: answers.siteUrl.replace(/\/$/, ''), // Remove trailing slash
      businessType: answers.businessType,
      description: answers.description,
      keywords: answers.keywords.split(',').map(k => k.trim()).filter(k => k),

      // Business Details
      businessName: answers.businessName,
      targetAudience: answers.targetAudience,
      uniqueValue: answers.uniqueValue,

      // Technical SEO
      defaultImage: '/og-image.png',
      themeColor: '#ffffff',
      locale: 'en_US',
      author: answers.author
    };

    // Add location if local business
    if (answers.isLocal) {
      config.isLocal = true;
      config.location = {
        streetAddress: answers.streetAddress,
        city: answers.city,
        state: answers.state,
        postalCode: answers.postalCode,
        country: answers.country || 'United States'
      };
      
      if (answers.phone || answers.email || answers.hours) {
        config.contact = {
          phone: answers.phone,
          email: answers.email,
          hours: answers.hours
        };
      }
    }

    // Add social media
    const social: any = {};
    if (answers.twitter) social.twitter = answers.twitter;
    if (answers.facebook) social.facebook = answers.facebook;
    if (answers.instagram) social.instagram = answers.instagram;
    if (answers.linkedin) social.linkedin = answers.linkedin;
    if (answers.youtube) social.youtube = answers.youtube;
    if (answers.github) social.github = answers.github;
    
    if (Object.keys(social).length > 0) {
      config.social = social;
    }

    // Add SEO strategy
    config.seoStrategy = {
      primaryGoal: answers.primaryGoal as any,
      targetKeywords: answers.targetKeywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k),
      competitors: answers.competitors
        ?.split(',')
        .map(c => c.trim())
        .filter(c => c)
    };

    // Determine structured data type based on business type
    config.structuredData = {
      type: this.getStructuredDataType(answers.businessType, answers.isLocal)
    };

    return config;
  }

  private getStructuredDataType(businessType: string, isLocal: boolean): string {
    const typeMap: Record<string, string> = {
      'E-commerce': 'OnlineStore',
      'SaaS/Software': 'SoftwareApplication',
      'Blog/Content': 'Blog',
      'Portfolio': 'Person',
      'Corporate/Business': isLocal ? 'LocalBusiness' : 'Organization',
      'Restaurant/Food': 'Restaurant',
      'Health/Medical': 'MedicalBusiness',
      'Education': 'EducationalOrganization',
      'Real Estate': 'RealEstateAgent',
      'Other Service': isLocal ? 'LocalBusiness' : 'Organization'
    };

    return typeMap[businessType] || 'Organization';
  }

  private async getDefaultConfig(projectPath: string): Promise<SEOConfig> {
    // Get project name from package.json or directory name
    let projectName = 'My Website';
    try {
      const packagePath = path.join(projectPath, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      projectName = packageJson.name || projectName;
    } catch {
      // Use directory name as fallback
      projectName = path.basename(projectPath);
    }

    return {
      siteName: projectName,
      siteUrl: 'https://example.com',
      businessType: 'Corporate/Business',
      description: `${projectName} - Built with Replrod`,
      keywords: ['website', projectName.toLowerCase()],
      businessName: projectName,
      targetAudience: 'General audience',
      uniqueValue: 'Quality products and services',
      structuredData: {
        type: 'Organization'
      }
    };
  }
}