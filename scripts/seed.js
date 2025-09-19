const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
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
    },
  });

  // Create admin user
  await prisma.employee.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
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
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
      role: 'ADMIN',
      companyId: company.id,
    },
  });

  // Create HR user
  await prisma.employee.upsert({
    where: { email: 'hr@company.com' },
    update: {},
    create: {
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
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
      role: 'HR',
      companyId: company.id,
    },
  });

  // Create employee user
  await prisma.employee.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
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
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
      role: 'EMPLOYEE',
      companyId: company.id,
    },
  });

  console.log('Demo accounts seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
