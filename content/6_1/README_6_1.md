# Virima Documentation Website - Version 6.1 & NextGen

![Build Status](https://github.com/gopichand-virima/FeatureDocsite/actions/workflows/deploy.yml/badge.svg)

This repository contains the comprehensive documentation website for **Virima versions 6.1, 6.1.1, 5.13, and NextGen**. The documentation is built using React, TypeScript, Vite, and MDX, providing a modern, interactive, and SEO-optimized documentation experience.

> **Note**: This README focuses on **Version 6.1** specific features and changes. For general project information, see the main project documentation.

## 📋 Table of Contents

- [Overview](#overview)
- [Current Project Status](#current-project-status)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [SEO/GEO Implementation](#seogeo-implementation)
- [Breadcrumb Navigation](#breadcrumb-navigation)
- [Content Management](#content-management)
- [Development](#development)
- [Building and Deployment](#building-and-deployment)
- [Recent Improvements](#recent-improvements)
- [Contributing](#contributing)

## Overview

This documentation site provides comprehensive guides, references, and tutorials for all Virima versions. The content is organized by modules and sections, making it easy to find information about specific features and functionalities.

**Live Site**: https://gopichand-virima.github.io/FeatureDocsite/

## Current Project Status

### ✅ Completed Features

1. **Multi-Version Support**
   - NextGen (NG)
   - Version 6.1.1
   - Version 6.1
   - Version 5.13

2. **Complete Module Coverage**
   - My Dashboard (Application Overview, Shared Functions)
   - CMDB (Configuration Management Database)
   - Discovery Scan
   - ITSM (IT Service Management)
   - ITAM (IT Asset Management)
   - Vulnerability Management
   - Self Service
   - Program/Project Management
   - Risk Register
   - Reports
   - Admin (with full submodule hierarchy)

3. **SEO/GEO Foundation**
   - ✅ Canonical URLs with proper hostname
   - ✅ `robots.txt` for production and staging
   - ✅ Dynamic `sitemap.xml` generation
   - ✅ Unique meta tags per page (title, description, canonical, keywords)
   - ✅ JSON-LD structured data (BreadcrumbList, TechArticle)
   - ✅ HTML lang attributes and og:locale
   - ✅ Frontmatter support in all MDX files

4. **Navigation & Breadcrumbs**
   - ✅ 7-level breadcrumb structure: `Home > Version > Module > Section > Parent Topic > Nested > Page`
   - ✅ All breadcrumb levels are clickable
   - ✅ Automatic section detection (e.g., Application Overview for Shared Functions)
   - ✅ Dynamic parent topic detection
   - ✅ Full hierarchy matching TOC structure

5. **Content Loading**
   - ✅ Browser-safe MDX content loading (no Node.js dependencies)
   - ✅ Frontmatter parsing without Buffer dependency
   - ✅ Error handling with fallback content
   - ✅ NextGen path resolution
   - ✅ Version-specific content mapping

6. **Error Handling**
   - ✅ React Error Boundary for graceful error handling
   - ✅ Defensive checks for missing props
   - ✅ Fallback content for missing pages
   - ✅ Console error logging

### 🚧 In Progress / Future Enhancements

- Additional NextGen content files
- Internationalization (i18n) with hreflang tags
- Advanced search functionality
- Analytics integration
- Performance optimizations (code splitting)

## Key Features

- ✅ **Interactive Navigation**: Sidebar TOC with expandable sections
- ✅ **Smart Breadcrumbs**: 7-level hierarchy with clickable navigation
- ✅ **MDX-Based Content**: Rich formatting with markdown support
- ✅ **Version-Specific Organization**: Separate content for each version
- ✅ **SEO Optimized**: Meta tags, structured data, sitemaps
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Error Resilience**: Graceful error handling and fallbacks
- ✅ **Automated Deployment**: GitHub Actions CI/CD
- ✅ **Type Safety**: Full TypeScript implementation

## Getting Started

### Prerequisites

- Node.js 18 or 20
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

### Building for Production

```bash
# Build the project (includes sitemap generation)
npm run build

# The build output will be in the 'build' directory
```

## Project Structure

```
src/
├── components/
│   ├── DocumentationLayout.tsx    # Main layout with sidebar navigation
│   ├── DocumentationContent.tsx   # Content rendering with breadcrumbs
│   ├── MDXContent.tsx             # MDX content renderer
│   ├── Seo.tsx                    # SEO component (meta tags, structured data)
│   ├── ErrorBoundary.tsx          # Error boundary for error handling
│   └── ui/                        # Reusable UI components
├── content/
│   ├── 6_1/                      # Version 6.1 content
│   │   ├── admin_6_1/            # Admin module (full hierarchy)
│   │   ├── my_dashboard_6_1/     # My Dashboard module
│   │   ├── cmdb_6_1/             # CMDB module
│   │   ├── discovery_scan_6_1/   # Discovery Scan module
│   │   ├── itsm_6_1/             # ITSM module
│   │   ├── itam_6_1/             # ITAM module
│   │   └── ...                    # Other modules
│   ├── NG/                        # NextGen content
│   ├── 6_1_1/                     # Version 6.1.1 content
│   ├── 5_13/                      # Version 5.13 content
│   └── contentLoader.ts           # Content loading and frontmatter parsing
├── config/
│   └── seoConfig.ts               # SEO configuration (canonical host, defaults)
├── utils/
│   ├── mdxPathResolver.ts        # MDX file path resolution
│   └── routeBuilder.ts           # URL route building utility
├── scripts/
│   ├── generate-sitemap.ts       # Sitemap generation script
│   ├── add-frontmatter.ts        # Add frontmatter to MDX files
│   └── normalize-frontmatter.ts  # Normalize existing frontmatter
└── App.tsx                        # Main application component

public/
├── robots.txt                     # Robots.txt for search engines
├── sitemap.xml                    # Generated sitemap (auto-updated on build)
├── 404.html                       # 404 page for GitHub Pages routing
└── images_6_1/                    # Version 6.1 images (mapped from ../Resources/Images/)
    ├── CMDB/                      # CMDB module images
    ├── Admin/                     # Admin module images
    ├── ITSM/                      # ITSM module images
    └── ...                        # Other module image folders
```

## SEO/GEO Implementation

### Overview

The project implements comprehensive SEO (Search Engine Optimization) and GEO (Geographic/Internationalization) foundations to ensure maximum visibility and proper indexing by search engines.

### Features Implemented

#### 1. Canonical URLs
- **Location**: `src/config/seoConfig.ts`
- **Implementation**: Each page has a unique canonical URL
- **Format**: `https://gopichand-virima.github.io/FeatureDocsite/{version}/{module}/{section}/{page}`
- **Usage**: Prevents duplicate content issues

#### 2. robots.txt
- **Location**: `public/robots.txt`
- **Production**: Allows all crawlers (`Allow: /`)
- **Staging**: Can be configured to disallow indexing
- **Sitemap Reference**: Points to sitemap.xml

#### 3. Sitemap Generation
- **Script**: `scripts/generate-sitemap.ts`
- **Output**: `public/sitemap.xml`
- **Features**:
  - Automatically includes all public doc pages
  - Updates `lastmod` based on file modification times
  - Includes all modules and versions
  - Generated automatically on build (`prebuild` script)

#### 4. Meta Tags
- **Component**: `src/components/Seo.tsx`
- **Per-Page Tags**:
  - `title`: Unique page title
  - `description`: Page description
  - `canonical`: Canonical URL
  - `keywords`: Relevant keywords
  - `og:title`, `og:description`, `og:url`: Open Graph tags
  - `twitter:card`: Twitter card metadata

#### 5. Structured Data (JSON-LD)
- **BreadcrumbList**: Schema.org breadcrumb structured data
- **TechArticle**: Article metadata for documentation pages
- **Location**: Rendered in `<head>` via `Seo` component

#### 6. Frontmatter Support
- **Format**: YAML frontmatter in MDX files
- **Fields**:
  ```yaml
  ---
  title: Page Title
  description: Page description for SEO
  canonical: /path/to/page
  keywords:
    - keyword1
    - keyword2
  lastUpdated: 2025-01-15
  ---
  ```
- **Parsing**: Browser-safe parser (no Node.js dependencies)
- **Scripts**: 
  - `npm run add:frontmatter` - Add default frontmatter to files
  - `npm run normalize:frontmatter` - Normalize existing frontmatter

#### 7. GEO/Internationalization
- **HTML Lang**: `lang="en"` on all pages
- **OG Locale**: `og:locale: "en_US"`
- **Future**: Ready for hreflang tags when localized content is added

### SEO Management

For detailed information on managing SEO/GEO content, see:
- **Guide**: `tutorials/seo-geo-management.md`
- **Configuration**: `src/config/seoConfig.ts`

### Understanding SEO/GEO: A Simple Guide

#### What is SEO/GEO and Why Does It Matter?

**SEO (Search Engine Optimization)** helps your documentation appear in Google, Bing, and other search engines when people search for Virima-related topics. Think of it as making your documentation "findable" on the internet.

**GEO (Geographic/Internationalization)** tells search engines what language your content is in and who it's for. Right now, all content is in English, but the system is ready for other languages later.

#### Real-World Example: How Metadata Helps

**Scenario**: A user searches Google for "How to restart Discovery Client in Virima"

**Without SEO Metadata:**
- Google might not find your page
- If found, the search result might show a generic title like "Virima Documentation"
- No description appears, so users don't know if it's relevant
- Page might rank lower in search results

**With SEO Metadata:**
- Google finds your page easily
- Search result shows: **"Restart Client - Virima Documentation"**
- Description appears: *"Instructions for restarting the Discovery Client in Virima to apply configuration changes or troubleshoot connection issues."*
- Users can see it's exactly what they need before clicking
- Page ranks higher because Google understands the content better

#### Example 1: Advanced Search Page

**The MDX File** (`src/content/6_1/application_overview_6_1/shared_functions_6_1/advanced_search_6_1.md`):

```yaml
---
title: "Advanced Search"
description: "Learn how to use advanced search features in Virima to quickly find configuration items, incidents, and other records across all modules using filters, operators, and saved searches."
canonical: "/NextGen/my-dashboard/application-overview/advanced-search"
keywords:
  - "virima"
  - "advanced search"
  - "search filters"
  - "cmdb search"
  - "configuration items"
  - "find records"
lastUpdated: "2025-01-15"
---
```

**What This Does:**

1. **Title Tag** → Shows in browser tab and Google search results:
   ```
   Advanced Search - Virima Documentation
   ```

2. **Description** → Appears in Google search results:
   ```
   Learn how to use advanced search features in Virima to quickly find 
   configuration items, incidents, and other records across all modules...
   ```

3. **Canonical URL** → Tells Google this is the "official" page:
   ```
   https://gopichand-virima.github.io/FeatureDocsite/NextGen/my-dashboard/application-overview/advanced-search
   ```

4. **Keywords** → Helps Google understand what the page is about:
   - When someone searches "virima advanced search", your page appears
   - When someone searches "cmdb search filters", your page appears
   - When someone searches "find configuration items virima", your page appears

5. **Structured Data** → Google shows rich results:
   ```json
   {
     "@type": "TechArticle",
     "headline": "Advanced Search",
     "description": "Learn how to use advanced search...",
     "breadcrumb": "Home > NextGen > My Dashboard > Application Overview > Shared Functions > Advanced Search"
   }
   ```

**The Benefit:**
- Your page appears in search results when users look for Virima search features
- Higher click-through rate because the description is clear
- Better ranking because Google understands the content
- Users find answers faster

#### Example 2: CMDB Access Page

**The MDX File** (`src/content/6_1/cmdb_6_1/access_cmdb_6_1.md`):

```yaml
---
title: "Access CMDB"
description: "Step-by-step guide to accessing the Configuration Management Database (CMDB) in Virima, including navigation, permissions, and initial setup requirements."
canonical: "/6_1/cmdb/cmdb/access-cmdb"
keywords:
  - "virima"
  - "cmdb"
  - "configuration management database"
  - "access cmdb"
  - "how to open cmdb"
  - "cmdb setup"
lastUpdated: "2025-01-15"
---
```

**What Happens When Someone Searches:**

**Search Query**: "How to access CMDB in Virima"

**Google Search Result:**
```
🔍 Access CMDB - Virima Documentation
https://gopichand-virima.github.io/FeatureDocsite/6_1/cmdb/cmdb/access-cmdb

Step-by-step guide to accessing the Configuration Management Database 
(CMDB) in Virima, including navigation, permissions, and initial setup 
requirements.
```

**Why This Works:**
- The title matches the search query exactly
- The description answers the question directly
- Keywords include variations people might search for
- Canonical URL ensures no duplicate content issues
- Structured data helps Google show it in relevant searches

**The Benefit:**
- Users find your documentation instead of competitors
- Higher search ranking = more visitors
- Better user experience = users stay longer
- More traffic = more people using Virima

#### Example 3: Admin - Restart Client Page

**The MDX File** (`src/content/6_1/admin_6_1/admin_discovery/client/restart_client_6_1.md`):

```yaml
---
title: "Restart Client"
description: "Instructions for restarting the Discovery Client in Virima to apply configuration changes or troubleshoot connection issues. Includes step-by-step procedures and troubleshooting tips."
canonical: "/6_1/admin/discovery/client/restart-client"
keywords:
  - "virima"
  - "discovery client"
  - "restart client"
  - "troubleshooting"
  - "discovery configuration"
  - "client restart"
lastUpdated: "2025-01-15"
---
```

**Multiple Search Scenarios:**

**Scenario A**: User searches "virima discovery client not working"
- Your page appears because keywords include "discovery client" and "troubleshooting"
- Description mentions "troubleshoot connection issues"
- User clicks → finds solution → problem solved

**Scenario B**: User searches "how to restart virima client"
- Your page appears because title is "Restart Client"
- Keywords include "restart client"
- User clicks → follows instructions → success

**Scenario C**: User searches "apply discovery configuration changes"
- Your page appears because description mentions "apply configuration changes"
- User clicks → learns the process → completes task

**The Benefit:**
- One well-optimized page answers multiple search queries
- Users find solutions faster
- Reduces support tickets
- Builds trust in Virima documentation

#### How Metadata Appears in Search Results

**Before Adding Metadata:**
```
❌ Virima Documentation
   https://gopichand-virima.github.io/FeatureDocsite/...
   [No description - users don't know what's on the page]
```

**After Adding Metadata:**
```
✅ Advanced Search - Virima Documentation
   https://gopichand-virima.github.io/FeatureDocsite/NextGen/my-dashboard/...
   Learn how to use advanced search features in Virima to quickly find 
   configuration items, incidents, and other records across all modules...
```

**The Difference:**
- ✅ Clear, descriptive title
- ✅ Helpful description that explains what's on the page
- ✅ Users know what they'll find before clicking
- ✅ Higher click-through rate
- ✅ Better search ranking

#### Real Benefits You'll See

1. **More Website Visitors**
   - When people search for Virima topics, your docs appear
   - More clicks = more traffic
   - More traffic = more users finding answers

2. **Better User Experience**
   - Clear titles and descriptions help users find the right page
   - Users don't waste time on irrelevant pages
   - Faster problem-solving

3. **Professional Appearance**
   - Well-formatted search results look professional
   - Builds trust in Virima as a company
   - Shows attention to detail

4. **Reduced Support Load**
   - Users find answers themselves
   - Fewer "how do I..." support tickets
   - Documentation becomes a self-service resource

5. **Competitive Advantage**
   - Better SEO = higher search rankings
   - Your docs appear before competitors
   - More visibility = more users

#### How to See It Working

**Test It Yourself:**

1. **Add metadata to a new page** (follow the steps in "Adding SEO Metadata to New MDX Topics")

2. **Build and deploy** the site

3. **Wait a few days** (Google needs time to index)

4. **Search Google** for your topic:
   - Example: Search "virima advanced search"
   - Your page should appear in results
   - Check that title and description match your frontmatter

5. **Use Google Search Console** (if you have access):
   - Submit your sitemap: `https://gopichand-virima.github.io/FeatureDocsite/sitemap.xml`
   - See which pages Google has indexed
   - Monitor search performance

#### Common Questions

**Q: Do I need to add metadata to every page?**
A: Yes! Every page should have frontmatter. Use `npm run add:frontmatter` to add it automatically, then review and refine.

**Q: How long does it take for Google to find my pages?**
A: Usually 1-7 days after deployment. Submitting the sitemap in Google Search Console speeds it up.

**Q: What if I forget to add metadata?**
A: The system has fallbacks, but pages with proper metadata rank much higher. Always add frontmatter for best results.

**Q: Can I see if it's working?**
A: Yes! After a few days, search Google for your page topic. If it appears with your title and description, it's working.

**Q: Do keywords really matter?**
A: Yes, but not as much as title and description. Keywords help Google understand context, but well-written descriptions are more important.

#### Quick Summary

**What You Do:**
1. Add frontmatter to each MDX file
2. Write a clear title (50-60 characters)
3. Write a helpful description (150-160 characters)
4. Add relevant keywords
5. Set the canonical URL

**What Happens:**
- Google finds your pages
- Search results show clear titles and descriptions
- Users can find answers easily
- Your documentation ranks higher in search

**The Result:**
- More visitors to your documentation
- Better user experience
- Reduced support load
- Professional, trustworthy appearance

**Remember**: Good SEO metadata is like a good sign on a storefront - it tells people what's inside and why they should come in!

## Breadcrumb Navigation

### Structure

The breadcrumb follows a strict 7-level hierarchy:

```
Home > Version > Module > Section > Parent Topic > Nested > Page
```

### Examples

**My Dashboard - Advanced Search:**
```
Home > NextGen > My Dashboard > Application Overview > Shared Functions > Advanced Search
```

**CMDB - Details:**
```
Home > 6.1 > CMDB > CMDB > CI Details and Tabs > Details > Tasks
```

**Admin - Restart Client:**
```
Home > 6.1 > Admin > Discovery > Client > Restart Client
```

### Implementation

- **Location**: `src/components/DocumentationContent.tsx`
- **Features**:
  - All levels are clickable (except final page)
  - Automatic section detection (e.g., Application Overview for Shared Functions)
  - Dynamic parent topic detection based on page hierarchy
  - Full hierarchy matching TOC structure
  - Breadcrumb structured data (JSON-LD) for SEO

### Breadcrumb Logic

The breadcrumb system:
1. Detects the actual section based on page content (not just URL)
2. Identifies parent topics from page arrays
3. Shows nested levels when applicable
4. Formats page names using TOC label mapping

## Content Management

### File Naming Conventions

**Version 6.1:**
- Format: `{topic-name}_6_1.md` or `{topic-name}-6_1.md`
- Example: `my-dashboard-overview-6_1.md`, `access_cmdb_6_1.md`, `cmdb_graphical_workflow_6_1.md`
- Location: `src/content/6_1/{module_folder}/`
- **Image Paths**: Use `../Resources/Images/...` in MDX files (automatically transformed to `/images_6_1/...`)

**NextGen:**
- Format: `{topic-name}.md` or `{topic-name}_ng.md`
- Example: `system-icons.md`, `overview_ng.md`
- Location: `src/content/NG/{module}/`
- **Image Paths**: Use `../Resources/Images/...` in MDX files (automatically transformed to `/images_ng/...`)

### Adding New Content

1. **Create MDX File**
   ```bash
   # For version 6.1
   src/content/6_1/{module}/{topic-name}_6_1.md
   
   # For NextGen
   src/content/NG/{module}/{topic-name}.md
   ```

2. **Add Frontmatter**
   ```mdx
   ---
   title: Page Title
   description: Page description for SEO
   canonical: /NextGen/my-dashboard/my-dashboard/my-page
   keywords:
     - keyword1
     - keyword2
   lastUpdated: 2025-01-15
   ---
   
   # Page Content
   ```

3. **Update Content Loader**
   - Add import in `src/content/contentLoader.ts`
   - Add entry to `contentMap`

4. **Update Navigation**
   - Add to TOC in `src/components/DocumentationLayout.tsx`
   - Update page arrays in `src/components/DocumentationContent.tsx` if needed

5. **Update Path Resolver**
   - Add path mapping in `src/utils/mdxPathResolver.ts` if custom structure

### Frontmatter Management

**Add Frontmatter to New Files:**
```bash
npm run add:frontmatter
```

**Normalize Existing Frontmatter:**
```bash
npm run normalize:frontmatter
```

**Remove Auto-Added Frontmatter (if needed):**
```bash
npm run cleanup:frontmatter
```

## SEO/GEO Metadata Management

### Overview

Every MDX file should include frontmatter (YAML metadata) at the top of the file. This metadata is used by the SEO system to generate proper meta tags, canonical URLs, and structured data for search engines.

### Frontmatter Structure

The frontmatter block appears at the very top of each MDX file, enclosed by `---`:

```yaml
---
title: "Page Title"
description: "A clear, concise description of the page content (150-160 characters ideal)"
canonical: "/NextGen/my-dashboard/my-dashboard/advanced-search"
keywords:
  - "keyword1"
  - "keyword2"
  - "keyword3"
lastUpdated: "2025-01-15"
---
```

### Adding SEO Metadata to New MDX Topics

#### Step 1: Create the MDX File

Create your new `.md` file in the appropriate location:

```bash
# Example: Adding a new topic to My Dashboard 6.1
src/content/6_1/my_dashboard_6_1/my-new-topic-6_1.md
```

#### Step 2: Add Frontmatter Block

Add the frontmatter block at the very top of the file (before any content):

```mdx
---
title: "My New Topic"
description: "This page explains how to use the new feature in Virima."
canonical: "/6_1/my-dashboard/my-dashboard/my-new-topic"
keywords:
  - "virima"
  - "my dashboard"
  - "new feature"
lastUpdated: "2025-01-15"
---

# My New Topic

Your content goes here...
```

#### Step 3: Determine the Canonical URL

The canonical URL should match the actual route structure:

**Pattern**: `/{version}/{module}/{section}/{page}`

**Examples:**
- `/NextGen/my-dashboard/application-overview/advanced-search`
- `/6_1/cmdb/cmdb/access-cmdb`
- `/6_1/admin/discovery/client/restart-client`

**Rules:**
- Use lowercase
- Use hyphens to separate words
- Match the URL structure exactly as it appears in the browser
- No trailing slashes

#### Step 4: Write Effective Metadata

**Title:**
- Keep it concise (50-60 characters)
- Include the main topic name
- Be descriptive but not verbose
- Example: `"Advanced Search"` or `"Manage CMDB - Configuration"`

**Description:**
- 150-160 characters ideal (Google displays ~155)
- Summarize what the page covers
- Include key terms users might search for
- No HTML tags
- Example: `"Learn how to use advanced search features in Virima to quickly find configuration items, incidents, and other records across all modules."`

**Keywords:**
- 3-10 relevant keywords
- Include module name, feature name, and related terms
- Use lowercase
- Be specific
- Example:
  ```yaml
  keywords:
    - "virima"
    - "advanced search"
    - "search filters"
    - "cmdb search"
    - "configuration items"
  ```

**Last Updated:**
- Format: `YYYY-MM-DD`
- Update when content changes significantly
- Used for sitemap `lastmod` attribute

#### Step 5: Normalize Frontmatter

After creating the file, run the normalizer to ensure consistency:

```bash
npm run normalize:frontmatter
```

This script will:
- Clean up formatting
- Remove HTML tags from title/description/keywords
- Ensure proper YAML syntax
- Add missing fields if needed

#### Step 6: Verify Metadata

1. **Check the file** - Open your MDX file and verify the frontmatter looks correct
2. **Test locally** - Run `npm run dev` and navigate to the page
3. **View source** - Right-click → "View Page Source" and check:
   - `<title>` tag matches your title
   - `<meta name="description">` matches your description
   - `<link rel="canonical">` matches your canonical URL
   - Keywords appear in meta tags

### Managing Existing SEO Metadata

#### Updating Metadata for Existing Topics

1. **Edit the Frontmatter**
   - Open the MDX file
   - Update the frontmatter block at the top
   - Save the file

2. **Update Last Updated Date**
   ```yaml
   lastUpdated: "2025-01-20"  # Update to today's date
   ```

3. **Run Normalizer** (if you updated many files):
   ```bash
   npm run normalize:frontmatter
   ```

4. **Rebuild Sitemap**:
   ```bash
   npm run build
   # Or just the sitemap:
   npm run generate:sitemap
   ```

#### Common Update Scenarios

**Scenario 1: Content Changed Significantly**
```yaml
# Update description to reflect new content
description: "Updated description that matches new content"
lastUpdated: "2025-01-20"  # Update date
```

**Scenario 2: Keywords Need Refinement**
```yaml
keywords:
  - "virima"
  - "updated-keyword"
  - "new-feature-name"
  # Remove outdated keywords, add new ones
```

**Scenario 3: Canonical URL Changed**
```yaml
# If the page moved to a different location
canonical: "/6_1/new-module/new-section/new-page"
```

### Maintaining SEO Metadata

#### Best Practices

1. **Consistency**
   - Use the same title format across similar pages
   - Keep descriptions similar in length
   - Use consistent keyword patterns

2. **Accuracy**
   - Ensure canonical URLs match actual routes
   - Update `lastUpdated` when content changes
   - Keep descriptions current with content

3. **Quality**
   - Write unique descriptions (no duplicates)
   - Use relevant, specific keywords
   - Avoid keyword stuffing

4. **Regular Maintenance**
   - Review metadata quarterly
   - Update outdated information
   - Remove obsolete keywords

#### Bulk Operations

**Normalize All Frontmatter:**
```bash
# This processes all MDX files and normalizes their frontmatter
npm run normalize:frontmatter
```

**Add Missing Frontmatter:**
```bash
# Adds default frontmatter to files that don't have it
npm run add:frontmatter
```

**Clean Up (if needed):**
```bash
# Removes auto-added frontmatter (use with caution)
npm run cleanup:frontmatter
```

### Controlling SEO Metadata

#### Override Defaults

The SEO system uses a hierarchy:

1. **Frontmatter** (highest priority) - From MDX file
2. **Global Defaults** - From `src/config/seoConfig.ts`
3. **Fallback Values** - Generated from page/route info

**Example - Override in Frontmatter:**
```yaml
---
title: "Custom Title That Overrides Default"
description: "Custom description"
# If canonical is not provided, it's generated from the route
canonical: "/custom/path/override"
---
```

#### Environment Variables

Control global SEO settings via environment variables:

**Canonical Host:**
```bash
# Set custom canonical host (default: https://docs.virima.com)
export VITE_CANONICAL_HOST=https://custom-domain.com
npm run build
```

**Indexing Control:**
```bash
# Disable indexing (for staging/test environments)
export VITE_ALLOW_INDEXING=false
npm run build
```

#### Programmatic Control

**In Code:**
- Global defaults: `src/config/seoConfig.ts`
- Per-page overrides: Frontmatter in MDX files
- Component-level: `src/components/Seo.tsx`

### SEO Metadata Checklist

When adding or updating a topic, verify:

- [ ] Frontmatter block exists at top of file
- [ ] Title is clear and descriptive (50-60 chars)
- [ ] Description is unique and accurate (150-160 chars)
- [ ] Canonical URL matches actual route
- [ ] Keywords are relevant (3-10 keywords)
- [ ] Last updated date is current
- [ ] No HTML tags in title/description/keywords
- [ ] YAML syntax is correct (proper indentation)
- [ ] Metadata appears correctly in page source
- [ ] Sitemap includes the new page

### Troubleshooting SEO Metadata

| Issue | Solution |
|-------|----------|
| Metadata not appearing | Check frontmatter syntax, ensure `---` delimiters are correct |
| Wrong canonical URL | Verify canonical path matches route structure |
| Duplicate descriptions | Write unique descriptions for each page |
| HTML in metadata | Run `npm run normalize:frontmatter` to clean |
| Missing from sitemap | Run `npm run generate:sitemap` and rebuild |
| Keywords not showing | Check YAML array syntax (use `-` for list items) |

### Examples

#### Example 1: Simple Topic

```mdx
---
title: "System Icons"
description: "Learn about system icons in Virima and how they provide quick visual indicators and access to common functions throughout the application."
canonical: "/NextGen/my-dashboard/application-overview/system-icons"
keywords:
  - "virima"
  - "system icons"
  - "user interface"
  - "navigation"
lastUpdated: "2025-01-15"
---

# System Icons

System icons in Virima provide quick visual indicators...
```

#### Example 2: Nested Topic

```mdx
---
title: "Restart Client"
description: "Instructions for restarting the Discovery Client in Virima to apply configuration changes or troubleshoot connection issues."
canonical: "/6_1/admin/discovery/client/restart-client"
keywords:
  - "virima"
  - "discovery"
  - "client"
  - "restart"
  - "troubleshooting"
lastUpdated: "2025-01-15"
---

# Restart Client

To restart the Discovery Client...
```

#### Example 3: Module Overview

```mdx
---
title: "CMDB Overview"
description: "Comprehensive guide to the Configuration Management Database (CMDB) in Virima, including how to access, manage, and maintain configuration items."
canonical: "/6_1/cmdb/cmdb/access-cmdb"
keywords:
  - "virima"
  - "cmdb"
  - "configuration management"
  - "configuration items"
  - "ci"
lastUpdated: "2025-01-15"
---

# CMDB Overview

The Configuration Management Database (CMDB)...
```

### Quick Reference

**Add metadata to new file:**
1. Create MDX file
2. Add frontmatter block
3. Run `npm run normalize:frontmatter`
4. Verify in browser

**Update existing metadata:**
1. Edit frontmatter in MDX file
2. Update `lastUpdated` date
3. Run `npm run normalize:frontmatter` (if many files)
4. Rebuild: `npm run build`

**Verify metadata:**
1. View page source in browser
2. Check `<title>`, `<meta name="description">`, `<link rel="canonical">`
3. Verify sitemap includes the page

For more detailed guidance, see: `tutorials/seo-geo-management.md`

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# SEO/Sitemap
npm run generate:sitemap # Generate sitemap.xml
npm run prebuild         # Runs sitemap generation before build

# Frontmatter Management
npm run add:frontmatter        # Add frontmatter to MDX files
npm run normalize:frontmatter  # Normalize existing frontmatter
npm run cleanup:frontmatter    # Remove auto-added frontmatter

# Deployment
npm run deploy           # Deploy to GitHub Pages (requires gh-pages)
```

### Type Checking

```bash
# TypeScript type checking
npm run type-check
```

## Building and Deployment

### Automated Deployment

The project uses GitHub Actions for automated testing and deployment:

- **Workflow**: `.github/workflows/deploy.yml`
- **Test Job**: Runs on every pull request and push
  - TypeScript type checking
  - Build compilation
  - Artifact verification
  - Build size monitoring
- **Deploy Job**: Automatically deploys to GitHub Pages on push to `main`/`master`
  - Builds the project
  - Copies `404.html` for client-side routing
  - Deploys to `gh-pages` branch

### Manual Build

```bash
# Build for production (includes sitemap generation)
npm run build

# Output will be in the 'build' directory
```

### Build Process

1. ✅ Pre-build: Generate sitemap.xml
2. ✅ TypeScript type checking
3. ✅ Vite build compilation
4. ✅ Artifact verification
5. ✅ Build size monitoring

### GitHub Pages Configuration

- **Repository**: `gopichand-virima/FeatureDocsite`
- **Live URL**: https://gopichand-virima.github.io/FeatureDocsite/
- **Branch**: `gh-pages` (auto-updated by GitHub Actions)
- **404 Handling**: `public/404.html` for client-side routing

## Version 6.1 Specific Features

### Image Path Transformation

**Location**: `src/components/MDXContent.tsx`

All 6.1 MDX files automatically have their image paths transformed to use the version-specific image folder:

- **Source Path in MDX**: `../Resources/Images/...`
- **Transformed Path**: `/images_6_1/...`

**How It Works:**
1. When MDX content is loaded, the `transformImagePaths()` function checks the file path
2. If the path starts with `/content/6_1`, images are mapped to `/images_6_1/`
3. Image references in markdown format `![alt text](../Resources/Images/folder/image.png)` are automatically converted to `![alt text](/images_6_1/folder/image.png)`
4. URL encoding is preserved (spaces become `%20`, etc.)

**Example:**
```mdx
<!-- In MDX file: src/content/6_1/cmdb_6_1/access_cmdb_6_1.md -->
![CMDB Dashboard](../Resources/Images/CMDB/cmdb-dashboard.png)

<!-- Automatically transformed to: -->
![CMDB Dashboard](/images_6_1/CMDB/cmdb-dashboard.png)
```

**Image Folder Location**: `public/images_6_1/`

### File Naming Conventions for 6.1

**Format**: `{topic-name}_6_1.md` or `{topic-name}-6_1.md`

**Examples:**
- `access_cmdb_6_1.md`
- `my-dashboard-overview-6_1.md`
- `cmdb_graphical_workflow_6_1.md`
- `restart_client_6_1.md`

**Location**: `src/content/6_1/{module_folder}/`

### Content Structure

**6.1 Content Organization:**
```
src/content/6_1/
├── admin_6_1/                    # Admin module with full submodule hierarchy
│   ├── admin_org_details/        # Organizational Details
│   ├── admin_discovery/          # Discovery configuration
│   ├── admin_sacm/              # SACM (Service Asset & Configuration Management)
│   ├── admin_users/              # User management
│   ├── admin_integrations/       # Third-party integrations
│   └── admin_other/             # Other admin functions
├── my_dashboard_6_1/            # My Dashboard module
├── cmdb_6_1/                    # CMDB module
├── discovery_scan_6_1/           # Discovery Scan module
├── itsm_6_1/                    # ITSM module
├── itam_6_1/                    # ITAM module
└── ...                          # Other modules
```

### Path Resolution for 6.1

**Location**: `src/utils/mdxPathResolver.ts`

**Special Handling:**
1. **My Dashboard 6.1**: Custom path mapping for dashboard-related pages
2. **Admin > SACM**: Specific file name mappings for SACM submodule pages
3. **Admin Sub-sections**: Automatic detection of Admin sub-folders (org_details, discovery, sacm, users, etc.)

**Example Path Resolution:**
- URL: `/6.1/admin/sacm/cmdb-graphical-workflow`
- Resolved Path: `/content/6_1/admin_6_1/admin_sacm/cmdb_graphical_workflow_6_1.md`

### Admin Module Sub-sections

**6.1 Admin Module Structure:**

The Admin module in 6.1 has a comprehensive submodule hierarchy:

1. **Organizational Details** (`admin_org_details`)
   - Cost Center, Departments, Members, Designations, Holidays, Locations, Operational Hours

2. **Discovery** (`admin_discovery`)
   - Application Map, Client, Discovery Agents, Remote Install, Restart Client, Correlation, Credentials, Monitoring Profile, etc.

3. **SACM** (`admin_sacm`)
   - Blueprints, Custom BSM Views, CMDB Graphical Workflow, CMDB Properties, Confidence Configuration, etc.

4. **Users** (`admin_users`)
   - AD Configuration, Azure AD Configuration, SAML Configuration, User Groups, User Roles, Users List

5. **Management Functions** (`admin_*_mngmnt`)
   - Change Management, Contract Management, Event Management, Hardware Asset Management, Incident Management, Knowledge Management, Problem Management

6. **Integrations** (`admin_integrations`)
   - Cherwell, Ivanti, Jira, ServiceNow Credentials and Mappings, Infoblox Configuration

7. **Others** (`admin_other`)
   - Announcements, Business Rules, Custom Reports, KPIs, Reports, Role Access, Service Level Agreements, SMTP Configuration, etc.

**Breadcrumb Handling:**
- Admin sub-sections are automatically detected from the file path
- Breadcrumbs correctly show: `Home > 6.1 > Admin > SACM > CMDB Graphical Workflow`
- Section highlighting matches the actual content location

### Content Loading for 6.1

**Location**: `src/content/contentLoader.ts`

**6.1 Content Imports:**
- All 6.1 MDX files are statically imported at build time
- Content is mapped to file paths for fast lookup
- Missing content gracefully falls back to `DefaultContent` component

**Example Import:**
```typescript
import myDashboardOverview61 from './6_1/my_dashboard_6_1/my-dashboard-overview-6_1.md?raw';

const contentMap: Record<string, string> = {
  '/content/6_1/my_dashboard_6_1/my-dashboard-overview-6_1.md': myDashboardOverview61,
  // ... more 6.1 content mappings
};
```

### Adding New 6.1 Content

**Steps:**
1. Create MDX file in appropriate module folder: `src/content/6_1/{module}_6_1/{filename}_6_1.md`
2. Use relative image paths: `../Resources/Images/...` (will be auto-transformed)
3. Add frontmatter with SEO metadata
4. Import in `src/content/contentLoader.ts`
5. Add path mapping in `src/utils/mdxPathResolver.ts` if needed
6. Update TOC in `src/components/DocumentationLayout.tsx`

**Example:**
```mdx
---
title: "New Feature"
description: "Description of the new feature"
canonical: "/6_1/my-module/my-section/new-feature"
keywords:
  - "virima"
  - "new feature"
lastUpdated: "2025-01-20"
---

# New Feature

![Feature Screenshot](../Resources/Images/MyModule/feature-screenshot.png)

Content here...
```

## Recent Improvements

### December 2024 - January 2025

#### 1. Page Loading Fixes
- **Issue**: Blank pages due to `Buffer is not defined` error
- **Solution**: Replaced `gray-matter` with browser-safe frontmatter parser
- **Result**: All pages now load correctly in browser environment

#### 2. ReferenceError Fixes
- **Issue**: `pageDisplayName is not defined` and other ReferenceErrors
- **Solution**: Added proper variable declarations in all scopes
- **Result**: No more runtime errors, all breadcrumbs render correctly

#### 3. NextGen Support
- **Issue**: NextGen pages not loading
- **Solution**: Added NextGen path resolution and content imports
- **Result**: NextGen documentation fully functional

#### 4. Breadcrumb Structure
- **Issue**: Incorrect breadcrumb hierarchy, missing sections
- **Solution**: 
  - Implemented 7-level breadcrumb structure
  - Added automatic section detection
  - Made all levels clickable
- **Result**: Breadcrumbs match TOC structure exactly

#### 5. SEO/GEO Foundation
- **Implementation**: Complete SEO infrastructure
  - Canonical URLs
  - robots.txt
  - Dynamic sitemap.xml
  - Meta tags per page
  - Structured data (JSON-LD)
  - Frontmatter support
- **Result**: Production-ready SEO optimization

#### 6. Error Handling
- **Implementation**: 
  - React Error Boundary
  - Defensive prop checks
  - Fallback content
  - Graceful error messages
- **Result**: No more blank pages, user-friendly error messages

#### 7. Content Loading
- **Implementation**: 
  - Browser-safe content loading
  - Frontmatter parsing without Node.js dependencies
  - Version-specific path resolution
- **Result**: Reliable content loading across all versions

#### 8. Version 6.1 Image Path Mapping (January 2025)
- **Implementation**: Automatic image path transformation for 6.1 content
  - MDX files use `../Resources/Images/...` paths
  - Automatically transformed to `/images_6_1/...` at runtime
  - Version-aware path resolution
- **Result**: All 6.1 images load correctly without manual path updates

## Documentation Modules

### Complete Module List

1. **My Dashboard**
   - Application Overview (System Icons, User Specific Functions, Technical Design Documents)
   - Shared Functions (37+ common functions)
   - My Dashboard (Dashboards, Customization, Report Actions)

2. **CMDB**
   - Access CMDB
   - Manage CMDB
   - View and Edit a CI
   - CI Details and Tabs
   - Other Functions

3. **Discovery Scan**
   - Dashboard
   - Run a Scan
   - Recent Scans
   - Scheduled Scans and Imports
   - IPAM Networks
   - Discovered Items
   - Import from AWS/Azure/Meraki/Intune
   - Import Data Files
   - Imported Assets
   - AD/Azure AD User Import Logs

4. **ITSM**
   - Configuration Management
   - Change Management
   - Incident Management
   - Problem Management
   - Knowledge Management
   - Release Management
   - Request Fulfillment
   - Service Portfolio
   - Runbook

5. **ITAM**
   - Configuration Management
   - Audits
   - Asset License Entitlement
   - User License Entitlement
   - Stockroom
   - Procurement

6. **Vulnerability Management**
   - Core Functionality
   - Access and View
   - Best Practices
   - Limitations

7. **Self Service**
   - Service Catalog
   - My Incidents
   - My Requests

8. **Program/Project Management**
   - Programs
   - Projects
   - Program Dashboard
   - Project Dashboard

9. **Risk Register**
   - Risk Dashboard
   - Risks

10. **Reports**
    - Ad-hoc Reports
    - Canned Reports
    - Properties and Conditions
    - Run Report
    - Delete Report

11. **Admin** (Full Hierarchy)
    - Organizational Details (Cost Center, Departments, Members, Designations, Holidays, Locations, Operational Hours)
    - Discovery (Application Map, Client, Discovery Agents, Remote Install, Restart Client, Correlation, Credentials, Monitoring Profile, etc.)
    - SACM (Blueprints, Custom BSM Views, CMDB Graphical Workflow, CMDB Properties, etc.)
    - Users (AD Configuration, Azure AD Configuration, SAML Configuration, Time Track Reports, User Groups, User Roles, Users List)
    - Management Functions (Change Management, Contract Management, Event Management, Hardware Asset Management, Incident Management, Knowledge Management, Problem Management)
    - Procurement (About Procurement, Procurement Properties, Procurement Property Group)
    - Vendor Management
    - Integrations (Cherwell, Ivanti, Jira, ServiceNow Credentials and Mappings, Infoblox Configuration)
    - Others (Announcements, Business Rules, Custom Reports, Documentation and Tester, Inbox Configuration for ITSM, KPIs, Reports, Role Access, Service Level Agreements, SMTP Configuration, Risk Score Calculator, Graphical Workflows)

## Contributing

### Content Updates

1. Edit MDX files in `src/content/{version}/{module}/`
2. Follow existing naming conventions
3. Add/update frontmatter for SEO
4. Test locally with `npm run dev`
5. Submit pull request

### Code Changes

1. Make changes to components or utilities
2. Test thoroughly (check all modules and versions)
3. Ensure build passes: `npm run build`
4. Verify breadcrumbs and navigation
5. Submit pull request with clear description

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure tests pass (automated via GitHub Actions)
4. Verify SEO elements (sitemap, meta tags)
5. Submit PR with clear description
6. Wait for review and approval

## Resources

- **Main Documentation**: See `src/content/6_1/index.md` for complete TOC
- **Content Guidelines**: See `src/content/README.md`
- **Architecture**: See `src/docs/architecture-diagram.md`
- **SEO/GEO Management**: See `tutorials/seo-geo-management.md`
- **Deployment Guide**: See `tutorials/DEPLOYMENT_GUIDE.md`
- **Testing Checklist**: See `src/docs/testing-checklist.md`

## Support

For issues or questions:
1. Check existing documentation
2. Review GitHub Issues
3. Check browser console for errors
4. Verify content paths and naming conventions
5. Contact the documentation team

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Content**: MDX (Markdown + JSX)
- **Routing**: React Router
- **SEO**: react-helmet-async
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## Version History

- **v1.1.0** (January 2025): Version 6.1 image path transformation, feedback survey system, hero section design updates
- **v1.0.0** (January 2025): Complete SEO/GEO implementation, breadcrumb fixes, NextGen support
- **v0.9.0** (December 2024): Page loading fixes, error handling improvements
- **v0.8.0** (December 2024): Multi-version support, Admin module expansion
- **v0.7.0** (November 2024): Initial release with basic navigation

### Version 6.1 Change Log

**January 2025:**
- ✅ **Image Path Transformation**: Automatic conversion of `../Resources/Images/...` to `/images_6_1/...` for all 6.1 MDX files
- ✅ **Admin Module Breadcrumbs**: Fixed breadcrumb hierarchy for Admin sub-sections (SACM, Discovery, Users, etc.)
- ✅ **Content Path Resolution**: Enhanced path resolver for 6.1 Admin sub-modules
- ✅ **Feedback Survey**: Added feedback form to all 6.1 documentation pages
- ✅ **Error Boundary**: Improved error handling with route-based reset for 6.1 pages

---

**Version**: 6.1, 6.1.1, 5.13, NextGen  
**Last Updated**: January 2025  
**Build Status**: [Check badge above](#)  
**Live Site**: https://gopichand-virima.github.io/FeatureDocsite/
