import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'fast-glob';

export class SitemapGenerator {
  async generate(projectPath: string, domain?: string): Promise<void> {
    const publicDir = path.join(projectPath, 'client', 'public');
    await fs.mkdir(publicDir, { recursive: true });
    
    const pages = await this.findPages(projectPath);
    const content = this.createContent(pages, domain);
    const filePath = path.join(publicDir, 'sitemap.xml');
    
    await fs.writeFile(filePath, content);
  }

  private async findPages(projectPath: string): Promise<string[]> {
    const patterns = [
      `${projectPath}/client/src/**/*.{jsx,tsx}`,
      `!${projectPath}/client/src/**/*.test.{jsx,tsx}`,
      `!${projectPath}/client/src/**/*.spec.{jsx,tsx}`,
      `!${projectPath}/client/src/components/**`,
      `!${projectPath}/client/src/utils/**`,
      `!${projectPath}/client/src/hooks/**`
    ];
    
    const files = await glob(patterns);
    return this.extractRoutes(files, projectPath);
  }

  private extractRoutes(files: string[], projectPath: string): string[] {
    const routes = new Set<string>();
    routes.add('/');
    
    files.forEach(file => {
      const route = this.fileToRoute(file, projectPath);
      if (route) routes.add(route);
    });
    
    return Array.from(routes);
  }

  private fileToRoute(file: string, projectPath: string): string | null {
    const relative = path.relative(
      path.join(projectPath, 'client/src'), 
      file
    );
    
    const route = relative
      .replace(/\.(jsx|tsx)$/, '')
      .replace(/\/index$/, '')
      .replace(/\\/g, '/');
    
    if (route.includes('_') || route.includes('[')) {
      return null;
    }
    
    return `/${route}`;
  }

  private createContent(pages: string[], domain?: string): string {
    const urlBase = domain || 'https://example.com';
    const date = new Date().toISOString().split('T')[0];
    
    const urls = pages.map(page => `  <url>
    <loc>${urlBase}${page}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${page === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }
}