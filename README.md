# HRMS Malaysia

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kk-matmotofix-2025/v0-gomen-my)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A comprehensive Human Resource Management System (HRMS) specifically designed for Malaysian businesses, featuring AI-powered automation, full compliance with local regulations, and modern web technologies.

## 🌟 Overview

HRMS Malaysia is a complete HR management solution that streamlines workforce operations for Malaysian companies. Built with cutting-edge technologies, it offers automated payroll processing, employee lifecycle management, leave tracking, document management, and AI-assisted HR functions - all while ensuring compliance with Malaysian labor laws, EPF, SOCSO, and tax regulations.

The system supports multiple user roles (Admin, HR, Manager, Employee, Employer, Job Seeker) with role-based access control, making it suitable for businesses of all sizes.

## ✨ Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle from onboarding to offboarding
- **Payroll Automation**: Automated salary calculations with EPF, SOCSO, EIS, and progressive tax compliance
- **Leave Management**: Comprehensive leave tracking with Malaysian leave types and approval workflows
- **Document Management**: Secure storage and organization of employee documents and certificates

### AI-Powered Features
- **AI Agents**: Multiple specialized AI agents for HR tasks:
  - Compliance Agent: Ensures regulatory compliance
  - IR Agent: Industrial relations management
  - ER Agent: Employee relations
  - CB Agent: Case building and documentation
  - TA Agent: Talent acquisition
  - LD Agent: Learning and development
  - Performance Agent: Performance management
  - Resume Parser: Automated resume analysis
  - Candidate Matcher: AI-powered job matching
  - Chatbot: HR query assistance
- **Smart Recommendations**: AI-driven job recommendations and candidate matching

### Compliance & Integration
- **Malaysian Compliance**: Built-in compliance with local labor laws and regulations
- **Government API Integration**: Seamless integration with Malaysian government APIs (KWSP, PERKESO, LHDN, MyWorkID)
- **Tax Calculations**: Automated progressive tax calculations for Malaysian tax system
- **EPF/SOCSO Processing**: Automatic contribution calculations and filings

### Job Portal & Recruitment
- **Job Portal**: Integrated job posting and application system
- **Resume Management**: Upload, parse, and manage candidate resumes
- **Application Tracking**: End-to-end recruitment workflow management

### Security & Access Control
- **Role-Based Security**: Multi-level access control (Admin, HR, Manager, Employee, Employer, Job Seeker)
- **Authentication**: Secure authentication with NextAuth.js
- **Data Privacy**: Enterprise-grade security and data protection

### Additional Features
- **Industrial Relations (IR) Case Management**: Track and manage workplace disputes and cases
- **Attendance Tracking**: Automated attendance monitoring and reporting
- **Dashboard Analytics**: Comprehensive HR analytics and reporting
- **Multi-tenant Support**: Support for multiple companies/organizations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit and ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication and authorization

### AI & Integrations
- **OpenAI** - AI agent capabilities
- **Nodemailer** - Email services
- **Government APIs** - Malaysian government service integrations

### Development & Testing
- **Vitest** - Unit testing
- **Playwright** - End-to-end testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### DevOps & Deployment
- **Vercel** - Deployment platform
- **Docker** - Containerization
- **PostgreSQL** - Database hosting

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** database
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hrms-malaysia.git
   cd hrms-malaysia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/hrms_malaysia"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"

   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"

   # Email (optional)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"

   # Government API Keys (optional)
   KWSP_API_KEY="your-kwsp-api-key"
   PERKESO_API_KEY="your-perkeso-api-key"
   LHDN_API_KEY="your-lhdn-api-key"
   MYWORKID_API_KEY="your-myworkid-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`.

## 📖 Usage

### For Administrators
1. **Sign up** as an admin user
2. **Create company profile** and configure settings
3. **Add employees** and set up their profiles
4. **Configure payroll settings** and compliance parameters
5. **Manage roles and permissions**

### For HR Personnel
1. **Manage employee data** and documents
2. **Process payroll** and generate reports
3. **Handle leave requests** and approvals
4. **Oversee recruitment** and job postings
5. **Monitor compliance** and regulatory requirements

### For Employees
1. **Update personal information** and documents
2. **Submit leave requests**
3. **View payroll information** and payslips
4. **Access company resources** and policies

### For Employers/Job Seekers
1. **Post job openings** (Employers)
2. **Search and apply for jobs** (Job Seekers)
3. **Manage applications** and track status

## 🔌 API Documentation

The application provides RESTful API endpoints for integration:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Employee Management
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/[id]` - Get employee details
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Payroll
- `GET /api/payroll` - Get payroll data
- `POST /api/payroll/calculate` - Calculate payroll
- `GET /api/payroll/[id]` - Get employee payroll

### Leave Management
- `GET /api/leaves` - List leave requests
- `POST /api/leaves` - Submit leave request
- `PUT /api/leaves/[id]` - Update leave status

### AI Agents
- `POST /api/ai/dispatch` - Dispatch AI agent tasks
- `GET /api/ai/agents` - List available AI agents

For complete API documentation, see the [API Documentation](./docs/api/) directory.

## 🧪 Testing

### Unit Tests
```bash
npm run test
# or
yarn test
# or
pnpm test
```

### End-to-End Tests
```bash
npx playwright test
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment
```bash
# Build the Docker image
docker build -t hrms-malaysia .

# Run the container
docker run -p 3000:3000 hrms-malaysia
```

### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Ensure code passes linting: `npm run lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@hrpbloom.com
- Documentation: [docs/](./docs/)
- Issues: [GitHub Issues](https://github.com/your-username/hrms-malaysia/issues)

---

**HRMS Malaysia** - Empowering Malaysian businesses with intelligent HR management. 🇲🇾
