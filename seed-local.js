const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash the demo password
  const hashedPassword = await bcrypt.hash('demo123', 12);

  // Create sample company
  const company = await prisma.company.upsert({
    where: { registrationNo: '123456-A' },
    update: {},
    create: {
      name: 'Tech Solutions Sdn Bhd',
      registrationNo: '123456-A',
      address: '123 Jalan Bukit Bintang, 50200 Kuala Lumpur',
      contactNo: '+60312345678',
      email: 'info@techsolutions.com.my',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Delete existing employees to force recreation with hashed passwords
  await prisma.employee.deleteMany({
    where: {
      email: {
        in: ['admin@company.com', 'hr@company.com', 'employee@company.com']
      }
    }
  });

  // Create admin user
  await prisma.employee.create({
    data: {
      employeeId: 'EMP001',
      firstName: 'Ahmad',
      lastName: 'Rahman',
      nric: '850101-01-1234',
      email: 'admin@company.com',
      phone: '+60123456789',
      address: '456 Jalan Ampang, 50450 Kuala Lumpur',
      dateOfBirth: new Date('1985-01-01'),
      dateJoined: new Date('2020-01-01'),
      department: 'Administration',
      position: 'System Administrator',
      salary: 8000.00,
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create HR user
  await prisma.employee.create({
    data: {
      employeeId: 'EMP002',
      firstName: 'Siti',
      lastName: 'Nurhaliza',
      nric: '900215-08-5678',
      email: 'hr@company.com',
      phone: '+60123456790',
      address: '789 Jalan Tun Razak, 50400 Kuala Lumpur',
      dateOfBirth: new Date('1990-02-15'),
      dateJoined: new Date('2021-03-01'),
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 6500.00,
      password: hashedPassword,
      role: 'HR',
      companyId: company.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create employee user
  await prisma.employee.create({
    data: {
      employeeId: 'EMP003',
      firstName: 'Lim',
      lastName: 'Wei Ming',
      nric: '880312-07-9012',
      email: 'employee@company.com',
      phone: '+60123456791',
      address: '321 Jalan Imbi, 55100 Kuala Lumpur',
      dateOfBirth: new Date('1988-03-12'),
      dateJoined: new Date('2022-01-15'),
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 7500.00,
      password: hashedPassword,
      role: 'EMPLOYEE',
      companyId: company.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create sample jobs
  const adminUser = await prisma.employee.findFirst({
    where: { email: 'admin@company.com' }
  });

  if (adminUser) {
    await prisma.job.create({
      data: {
        title: 'Senior Software Engineer',
        description: 'We are looking for an experienced software engineer to join our team.',
        requirements: '5+ years of experience in web development, React, Node.js, TypeScript',
        location: 'Kuala Lumpur',
        department: 'Engineering',
        salaryMin: 8000,
        salaryMax: 12000,
        type: 'FULL_TIME',
        status: 'OPEN',
        employerId: adminUser.id,
        companyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.job.create({
      data: {
        title: 'HR Specialist',
        description: 'Join our HR team to help manage employee relations and development.',
        requirements: '3+ years in HR, knowledge of Malaysian labor laws',
        location: 'Kuala Lumpur',
        department: 'Human Resources',
        salaryMin: 5000,
        salaryMax: 7000,
        type: 'FULL_TIME',
        status: 'OPEN',
        employerId: adminUser.id,
        companyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.job.create({
      data: {
        title: 'Marketing Coordinator',
        description: 'Creative role in digital marketing and brand management.',
        requirements: '2+ years in marketing, social media experience',
        location: 'Kuala Lumpur',
        department: 'Marketing',
        salaryMin: 4000,
        salaryMax: 6000,
        type: 'FULL_TIME',
        status: 'OPEN',
        employerId: adminUser.id,
        companyId: company.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log('Demo accounts and jobs seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
