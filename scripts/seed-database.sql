-- Create sample company
INSERT INTO "Company" (name, "registrationNo", address, "contactNo", email) 
VALUES ('Tech Solutions Sdn Bhd', '123456-A', '123 Jalan Bukit Bintang, 50200 Kuala Lumpur', '+60312345678', 'info@techsolutions.com.my');

-- Create admin user (password: demo123)
INSERT INTO "Employee" (
  "employeeId", "firstName", "lastName", nric, email, phone, address,
  "dateOfBirth", "dateJoined", department, position, salary,
  password, role, "companyId"
) VALUES (
  'EMP001', 'Ahmad', 'Rahman', '850101-01-1234', 'admin@company.com',
  '+60123456789', '456 Jalan Ampang, 50450 Kuala Lumpur',
  '1985-01-01', '2020-01-01', 'Administration', 'System Administrator', 8000.00,
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'ADMIN', 1
);

-- Create HR user (password: demo123)
INSERT INTO "Employee" (
  "employeeId", "firstName", "lastName", nric, email, phone, address,
  "dateOfBirth", "dateJoined", department, position, salary,
  password, role, "companyId"
) VALUES (
  'EMP002', 'Siti', 'Nurhaliza', '900215-08-5678', 'hr@company.com',
  '+60123456790', '789 Jalan Tun Razak, 50400 Kuala Lumpur',
  '1990-02-15', '2021-03-01', 'Human Resources', 'HR Manager', 6500.00,
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'HR', 1
);

-- Create sample employees
INSERT INTO "Employee" (
  "employeeId", "firstName", "lastName", nric, email, phone, address, 
  "dateOfBirth", "dateJoined", department, position, salary, 
  password, role, "companyId"
) VALUES 
('EMP003', 'Lim', 'Wei Ming', '880312-07-9012', 'employee@company.com', '+60123456791', '321 Jalan Imbi, 55100 Kuala Lumpur', '1988-03-12', '2022-01-15', 'Engineering', 'Senior Developer', 7500.00, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'EMPLOYEE', 1),
('EMP004', 'Raj', 'Kumar', '920505-14-3456', 'raj.kumar@techsolutions.com.my', '+60123456792', '654 Jalan Raja Chulan, 50200 Kuala Lumpur', '1992-05-05', '2023-06-01', 'Engineering', 'Junior Developer', 4500.00, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'EMPLOYEE', 1),
('EMP005', 'Fatimah', 'Abdullah', '870820-03-7890', 'fatimah.abdullah@techsolutions.com.my', '+60123456793', '987 Jalan Pudu, 55100 Kuala Lumpur', '1987-08-20', '2021-09-01', 'Finance', 'Accountant', 5000.00, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'EMPLOYEE', 1);
