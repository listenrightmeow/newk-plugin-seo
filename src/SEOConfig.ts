export interface SEOConfig {
  // Basic Information
  siteName: string;
  siteUrl: string;
  businessType: string;
  description: string;
  keywords: string[];
  
  // Business Details
  businessName: string;
  targetAudience: string;
  uniqueValue: string;
  
  // Location (optional)
  isLocal?: boolean;
  location?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Contact Information
  contact?: {
    phone?: string;
    email?: string;
    hours?: string;
  };
  
  // Social Media
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  
  // SEO Strategy
  seoStrategy?: {
    primaryGoal: 'traffic' | 'leads' | 'sales' | 'awareness';
    targetKeywords: string[];
    competitors?: string[];
  };
  
  // Technical SEO
  defaultImage?: string;
  themeColor?: string;
  locale?: string;
  author?: string;
  
  // Advanced
  structuredData?: {
    type: string;
    additionalTypes?: string[];
  };
}

export interface SEOAnswers {
  businessName: string;
  siteUrl: string;
  businessType: string;
  description: string;
  keywords: string;
  targetAudience: string;
  uniqueValue: string;
  isLocal: boolean;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  hours?: string;
  primaryGoal: string;
  targetKeywords: string;
  competitors?: string;
  author?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  github?: string;
}