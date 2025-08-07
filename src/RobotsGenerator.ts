import * as fs from 'fs/promises';
import * as path from 'path';

export class RobotsGenerator {
  async generate(projectPath: string, domain?: string): Promise<void> {
    const publicDir = path.join(projectPath, 'client', 'public');
    await fs.mkdir(publicDir, { recursive: true });
    
    const content = this.createContent(domain);
    const filePath = path.join(publicDir, 'robots.txt');
    
    await fs.writeFile(filePath, content);
  }

  private createContent(domain?: string): string {
    const lines = [
      '# robots.txt',
      'User-agent: *',
      'Allow: /',
      '',
      '# Disallow crawling of API routes',
      'Disallow: /api/',
      'Disallow: /_next/',
      'Disallow: /admin/',
      '',
      '# Allow crawling of static assets',
      'Allow: /images/',
      'Allow: /*.js$',
      'Allow: /*.css$',
      'Allow: /*.png$',
      'Allow: /*.jpg$',
      'Allow: /*.jpeg$',
      'Allow: /*.gif$',
      'Allow: /*.svg$',
      'Allow: /*.webp$',
      '',
      '# Crawl delay',
      'Crawl-delay: 1'
    ];

    if (domain) {
      lines.push('', `# Sitemap`, `Sitemap: ${domain}/sitemap.xml`);
    }

    return lines.join('\n');
  }
}