# Xpertly Platform Overview

## Quick Summary

- **Project:** NoBroker-style CA listing platform (Xpertly.in)
- **Objective:** Mobile-first, modular CA discovery and contact portal
- **Key Constraint:** All components under 200 lines of code
- **Status:** Active development with Contact Request and Profile systems

## Detailed Sections

### [Project Description](#project-description)
### [Business Goals & Objectives](#business-goals--objectives)  
### [Target Audience](#target-audience)
### [Success Metrics](#success-metrics)

---

## Project Description

**Project Name:** Xpertly.in  
**Description:** A NoBroker-style platform where users can discover, filter, and contact Chartered Accountants (CAs).  
**Objective:** Build a mobile-first, modular, and maintainable CA listing portal from scratch. Every UI component must be kept under **200 lines of code** and all progress, context, and guidelines must be meticulously tracked via dedicated documents.

### Update (July 2025)
- The Leads and Feed (Forum) features have been removed from the product scope. All related code, components, and requirements are deprecated and no longer part of the platform.

### Key Documentation Structure
- `docs/prd/` - Product Requirements Documentation (this directory)
- `docs/progress/` - Development progress tracking and implementation status
- `database-schema.md` - Complete database schema documentation and guidelines

---

## Business Goals & Objectives

### Primary Goals

1. **User Experience Excellence**
   - Provide intuitive CA discovery and filtering
   - Enable seamless contact and communication flow
   - Ensure mobile-first responsive design

2. **Technical Excellence**
   - Maintain component size limit (200 lines max)
   - Achieve comprehensive test coverage (90%+)
   - Implement robust authentication and security

3. **Platform Growth**
   - Support scalable CA onboarding
   - Enable efficient contact request management
   - Provide analytics and insights

### Key Performance Indicators (KPIs)

- **User Engagement**: Contact request conversion rate > 15%
- **Technical Quality**: Test coverage > 90%, component size compliance 100%
- **Performance**: Page load time < 2s on 3G networks
- **User Satisfaction**: 4.5+ star rating in feedback surveys

---

## Target Audience

### Primary Users

#### 1. Chartered Accountants (CAs)
- **Profile**: Professional CAs seeking client acquisition
- **Goals**: Increase visibility, manage contact requests, build professional profile
- **Pain Points**: Limited online presence, inefficient lead management
- **Features Used**: Profile creation, contact request management, professional showcase

#### 2. Customers (Individuals & Businesses)
- **Profile**: Individuals and businesses needing CA services
- **Goals**: Find qualified CAs, compare services, establish contact
- **Pain Points**: Difficulty finding reliable CAs, unclear service offerings
- **Features Used**: CA search and filtering, contact requests, service comparison

### Secondary Users

#### 3. Platform Administrators
- **Profile**: Platform operators and content moderators
- **Goals**: Maintain platform quality, moderate content, analyze metrics
- **Features Used**: Admin dashboard, content moderation, analytics

---

## Success Metrics

### Technical Metrics
- ✅ **Component Size Compliance**: 100% of components under 200 lines
- ✅ **Test Coverage**: 90%+ across all critical components
- ✅ **Performance**: Lighthouse scores 90+ on mobile
- ✅ **Accessibility**: WCAG AA compliance

### Business Metrics
- **User Growth**: 50+ verified CAs in first quarter
- **Engagement**: 20+ contact requests per week
- **Conversion**: 15%+ contact-to-engagement conversion rate
- **Quality**: 4.5+ average CA rating

### Development Metrics
- **Velocity**: 2-week sprint cycles with consistent delivery
- **Quality**: <5% bug escape rate to production
- **Maintainability**: New developer onboarding < 1 week
- **Documentation**: 100% feature coverage in documentation

---

## Related Documentation

- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management patterns
- [Database Schema](./database-schema.md) - Complete database documentation
- [Component Standards](./component-standards.md) - Development standards and naming conventions
- [UI/UX Guidelines](./ui-ux-guidelines.md) - Design system and visual guidelines
- [Testing Standards](./testing-standards.md) - Testing methodologies and requirements 