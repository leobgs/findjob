import {
  PrismaClient,
  Role,
  JobType,
  JobStatus,
  ApplicationStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash('Password123', 10);

  const seeker1 = await prisma.user.upsert({
    where: { email: 'seeker@test.com' },
    update: { passwordHash, name: 'Budi Santoso', role: Role.JOB_SEEKER },
    create: {
      email: 'seeker@test.com',
      passwordHash,
      name: 'Budi Santoso',
      role: Role.JOB_SEEKER,
    },
  });

  const seeker2 = await prisma.user.upsert({
    where: { email: 'seeker2@test.com' },
    update: { passwordHash, name: 'Siti Rahma', role: Role.JOB_SEEKER },
    create: {
      email: 'seeker2@test.com',
      passwordHash,
      name: 'Siti Rahma',
      role: Role.JOB_SEEKER,
    },
  });

  const companyUser1 = await prisma.user.upsert({
    where: { email: 'company@test.com' },
    update: { passwordHash, name: 'Tech Corp Admin', role: Role.COMPANY },
    create: {
      email: 'company@test.com',
      passwordHash,
      name: 'Tech Corp Admin',
      role: Role.COMPANY,
    },
  });

  const company1 = await prisma.company.upsert({
    where: { userId: companyUser1.id },
    update: {
      name: 'Tech Corp',
      description: 'Perusahaan teknologi inovatif penyedia solusi cloud computing dan sistem enterprise.',
      location: 'Jakarta Selatan',
    },
    create: {
      userId: companyUser1.id,
      name: 'Tech Corp',
      description: 'Perusahaan teknologi inovatif penyedia solusi cloud computing dan sistem enterprise.',
      location: 'Jakarta Selatan',
    },
  });

  const companyUser2 = await prisma.user.upsert({
    where: { email: 'company2@test.com' },
    update: { passwordHash, name: 'Creative Studio Admin', role: Role.COMPANY },
    create: {
      email: 'company2@test.com',
      passwordHash,
      name: 'Creative Studio Admin',
      role: Role.COMPANY,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { userId: companyUser2.id },
    update: {
      name: 'Creative Studio',
      description: 'Agensi digital kreatif ternama dengan spesialisasi branding, UI/UX, dan multimedia interaktif.',
      location: 'Bandung',
    },
    create: {
      userId: companyUser2.id,
      name: 'Creative Studio',
      description: 'Agensi digital kreatif ternama dengan spesialisasi branding, UI/UX, dan multimedia interaktif.',
      location: 'Bandung',
    },
  });

  const jobsData = [
    {
      companyId: company1.id,
      title: 'Senior Backend Engineer',
      description: 'Kami mencari Senior Backend Engineer berpengalaman dengan Node.js, TypeScript, PostgreSQL, dan arsitektur microservices untuk memimpin tim backend core.',
      location: 'Jakarta Selatan',
      salaryMin: 18000000,
      salaryMax: 28000000,
      jobType: JobType.FULL_TIME,
      status: JobStatus.OPEN,
    },
    {
      companyId: company1.id,
      title: 'Frontend React Developer',
      description: 'Membangun dashboard interaktif performa tinggi dengan React, TypeScript, dan Tailwind CSS. Pengalaman dengan Next.js menjadi nilai tambah.',
      location: 'Jakarta Selatan',
      salaryMin: 12000000,
      salaryMax: 20000000,
      jobType: JobType.FULL_TIME,
      status: JobStatus.OPEN,
    },
    {
      companyId: company1.id,
      title: 'DevOps & Cloud Specialist',
      description: 'Mengelola infrastruktur AWS/GCP, Kubernetes cluster, dan pipeline CI/CD otomatis untuk ketersediaan tinggi sistem.',
      location: 'Remote',
      salaryMin: 16000000,
      salaryMax: 25000000,
      jobType: JobType.CONTRACT,
      status: JobStatus.OPEN,
    },
    {
      companyId: company1.id,
      title: 'Cloud Architect Lead',
      description: 'Merancang arsitektur sistem cloud skala besar dengan standar keamanan tinggi.',
      location: 'Jakarta Selatan',
      salaryMin: 30000000,
      salaryMax: 45000000,
      jobType: JobType.FULL_TIME,
      status: JobStatus.CLOSED,
    },
    {
      companyId: company2.id,
      title: 'Senior UI/UX Designer',
      description: 'Memimpin riset pengguna, membuat wireframe, prototipe Figma interaktif, dan menyusun design system komprehensif.',
      location: 'Bandung',
      salaryMin: 10000000,
      salaryMax: 18000000,
      jobType: JobType.FULL_TIME,
      status: JobStatus.OPEN,
    },
    {
      companyId: company2.id,
      title: 'Graphic Design Intern',
      description: 'Kesempatan magang untuk mahasiswa tingkat akhir atau fresh graduate untuk belajar membuat aset media sosial, banner, dan materi pemasaran visual.',
      location: 'Bandung',
      salaryMin: 3000000,
      salaryMax: 4500000,
      jobType: JobType.INTERNSHIP,
      status: JobStatus.OPEN,
    },
    {
      companyId: company2.id,
      title: 'Freelance Motion Graphic Artist',
      description: 'Membuat animasi 2D/3D untuk kampanye iklan digital, explainer video, dan materi promosi produk.',
      location: 'Remote',
      salaryMin: 8000000,
      salaryMax: 14000000,
      jobType: JobType.FREELANCE,
      status: JobStatus.OPEN,
    },
    {
      companyId: company2.id,
      title: 'Product Illustrator',
      description: 'Membuat ilustrasi digital konsisten untuk kebutuhan aset branding dan aplikasi seluler.',
      location: 'Bandung',
      salaryMin: 6000000,
      salaryMax: 10000000,
      jobType: JobType.PART_TIME,
      status: JobStatus.OPEN,
    },
  ];

  const createdJobs = [];
  for (const jobData of jobsData) {
    const existing = await prisma.job.findFirst({
      where: { companyId: jobData.companyId, title: jobData.title },
    });
    if (existing) {
      const updated = await prisma.job.update({
        where: { id: existing.id },
        data: jobData,
      });
      createdJobs.push(updated);
    } else {
      const created = await prisma.job.create({
        data: jobData,
      });
      createdJobs.push(created);
    }
  }

  const backendJob = createdJobs[0];
  const app1 = await prisma.application.upsert({
    where: {
      jobId_applicantId: {
        jobId: backendJob.id,
        applicantId: seeker1.id,
      },
    },
    update: { status: ApplicationStatus.APPLIED },
    create: {
      jobId: backendJob.id,
      applicantId: seeker1.id,
      status: ApplicationStatus.APPLIED,
    },
  });

  const existingHistory1 = await prisma.applicationHistory.findFirst({
    where: { applicationId: app1.id, toStatus: ApplicationStatus.APPLIED },
  });
  if (!existingHistory1) {
    await prisma.applicationHistory.create({
      data: {
        applicationId: app1.id,
        fromStatus: null,
        toStatus: ApplicationStatus.APPLIED,
        changedById: seeker1.id,
        note: 'Melamar lowongan pekerjaan',
      },
    });
  }

  const devopsJob = createdJobs[2];
  const app2 = await prisma.application.upsert({
    where: {
      jobId_applicantId: {
        jobId: devopsJob.id,
        applicantId: seeker1.id,
      },
    },
    update: { status: ApplicationStatus.REVIEWING },
    create: {
      jobId: devopsJob.id,
      applicantId: seeker1.id,
      status: ApplicationStatus.REVIEWING,
    },
  });

  const existingHistory2 = await prisma.applicationHistory.findFirst({
    where: { applicationId: app2.id, toStatus: ApplicationStatus.REVIEWING },
  });
  if (!existingHistory2) {
    await prisma.applicationHistory.createMany({
      data: [
        {
          applicationId: app2.id,
          fromStatus: null,
          toStatus: ApplicationStatus.APPLIED,
          changedById: seeker1.id,
          note: 'Melamar lowongan pekerjaan',
        },
        {
          applicationId: app2.id,
          fromStatus: ApplicationStatus.APPLIED,
          toStatus: ApplicationStatus.REVIEWING,
          changedById: companyUser1.id,
          note: 'Kandidat memenuhi kualifikasi awal DevOps',
        },
      ],
    });
  }

  const uiuxJob = createdJobs[4];
  const app3 = await prisma.application.upsert({
    where: {
      jobId_applicantId: {
        jobId: uiuxJob.id,
        applicantId: seeker2.id,
      },
    },
    update: { status: ApplicationStatus.SHORTLISTED },
    create: {
      jobId: uiuxJob.id,
      applicantId: seeker2.id,
      status: ApplicationStatus.SHORTLISTED,
    },
  });

  const existingHistory3 = await prisma.applicationHistory.findFirst({
    where: { applicationId: app3.id, toStatus: ApplicationStatus.SHORTLISTED },
  });
  if (!existingHistory3) {
    await prisma.applicationHistory.createMany({
      data: [
        {
          applicationId: app3.id,
          fromStatus: null,
          toStatus: ApplicationStatus.APPLIED,
          changedById: seeker2.id,
          note: 'Melamar lowongan pekerjaan',
        },
        {
          applicationId: app3.id,
          fromStatus: ApplicationStatus.APPLIED,
          toStatus: ApplicationStatus.SHORTLISTED,
          changedById: companyUser2.id,
          note: 'Portofolio desain sangat relevan dan menarik',
        },
      ],
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('👤 Users created:');
  console.log('   - Job Seeker: seeker@test.com / Password123 (Budi Santoso)');
  console.log('   - Job Seeker: seeker2@test.com / Password123 (Siti Rahma)');
  console.log('   - Company: company@test.com / Password123 (Tech Corp)');
  console.log('   - Company: company2@test.com / Password123 (Creative Studio)');
  console.log(`📋 Total jobs created/updated: ${createdJobs.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

