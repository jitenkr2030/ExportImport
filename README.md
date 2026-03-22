# ExportImport - Global B2B Trade Platform

![ExportImport Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=ExportImport)

A comprehensive B2B platform connecting global buyers and suppliers for international trade. Built with modern web technologies to provide a seamless experience for businesses to showcase products, connect with partners, and grow their international trade operations.

## 🌟 Features

### 🏢 **Company Management**
- Complete company profile creation and management
- Verification system with document uploads
- Contact information and social links
- Business description and capabilities
- Country and industry classification

### 📦 **Product Listings**
- Add and manage product catalogs
- High-quality image uploads
- Pricing and MOQ (Minimum Order Quantity) settings
- Multi-currency support
- Product categorization and search

### 🔍 **Search & Discovery**
- Advanced search for companies and products
- Filter by country, industry, and categories
- Real-time search results
- Verified supplier badges
- Mobile-responsive design

### 📩 **Inquiry System**
- Direct inquiry forms for products
- WhatsApp integration for instant communication
- Inquiry tracking and management
- Response management tools
- Email notifications

### 🔐 **Authentication & Security**
- Secure user registration and login
- Role-based access control
- Session management
- Protected routes and API endpoints

### 📊 **Business Dashboard**
- Real-time statistics and analytics
- Product performance tracking
- Inquiry management
- Profile views and engagement metrics
- Customizable business insights

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Hooks, Zustand
- **Form Handling:** React Hook Form

### **Backend**
- **API:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js
- **File Upload:** Native handling with cloud storage ready
- **Validation:** Zod schema validation

### **Development Tools**
- **Package Manager:** Bun
- **Code Quality:** ESLint, TypeScript
- **Git:** Version control
- **Environment:** Development, staging, production ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/ExportImport.git
   cd ExportImport
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="file:./db/custom.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   bun run db:generate
   ```

5. **Seed the database (optional)**
   ```bash
   bun run seed.ts
   ```

6. **Start the development server**
   ```bash
   bun run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Demo Account

For testing purposes, use the following demo credentials:

- **Email:** demo@exportimport.com
- **Password:** demo123

## 📁 Project Structure

```
ExportImport/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── company/       # Company management
│   │   │   ├── products/      # Product management
│   │   │   └── inquiries/     # Inquiry system
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   └── InquiryForm.tsx   # Custom components
│   ├── lib/                  # Utilities and configurations
│   │   ├── auth.ts           # NextAuth configuration
│   │   └── db.ts             # Prisma client
│   └── types/                # TypeScript definitions
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server

# Database
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma client
bun run db:migrate   # Run database migrations
bun run db:reset     # Reset database

# Code Quality
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript checks
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `POST /api/auth/register` - User registration

### Companies
- `GET /api/company/my-company` - Get user's company
- `POST /api/company/create` - Create company profile
- `GET /api/companies/all` - Get all companies

### Products
- `GET /api/products/my-products` - Get user's products
- `POST /api/products/create` - Create product
- `GET /api/products/all` - Get all products (public)

### Inquiries
- `GET /api/inquiries/my-inquiries` - Get received inquiries
- `POST /api/inquiries/create` - Send inquiry

## 🏗️ Database Schema

The platform uses the following main entities:

- **Users** - User accounts and authentication
- **Companies** - Business profiles and information
- **Products** - Product listings and details
- **Inquiries** - Communication between buyers and sellers
- **Reviews** - Company ratings and feedback
- **Categories** - Industry and product classifications
- **VerificationDocuments** - Company verification files

## 🎨 UI Components

The platform uses shadcn/ui components for consistent design:

- Forms, inputs, and validation
- Cards, badges, and alerts
- Navigation and layout components
- Modals and dialogs
- Tables and data display

## 🔐 Security Features

- **Authentication:** Secure login with NextAuth.js
- **Authorization:** Role-based access control
- **Input Validation:** Zod schema validation
- **SQL Injection Prevention:** Prisma ORM
- **XSS Protection:** React's built-in protections
- **CSRF Protection:** Next.js built-in protections

## 📱 Responsive Design

- **Mobile-First:** Designed for mobile devices first
- **Breakpoints:** Optimized for tablet and desktop
- **Touch-Friendly:** Large touch targets and gestures
- **Performance:** Optimized images and lazy loading

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Other Platforms
The platform can be deployed to any Node.js hosting service:
- Netlify
- AWS Amplify
- DigitalOcean
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: support@exportimport.com
- 🐛 Issues: [GitHub Issues](https://github.com/jitenkr2030/ExportImport/issues)
- 📖 Documentation: [Project Wiki](https://github.com/jitenkr2030/ExportImport/wiki)

## 🗺️ Roadmap

### ✅ Completed Features
- [x] Authentication system
- [x] Company profiles
- [x] Product listings
- [x] Inquiry system
- [x] Search and filtering
- [x] Responsive design

### 🚧 In Development
- [ ] Verification system with document uploads
- [ ] Rating and review system
- [ ] Admin panel
- [ ] Real-time notifications
- [ ] Advanced analytics

### 📋 Planned Features
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Shipping calculator
- [ ] Mobile apps
- [ ] AI-powered recommendations
- [ ] Advanced reporting

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

---

**Built with ❤️ for the global trade community**