import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { JobsPage } from '@/pages/jobs/JobsPage';
import { JobDetailPage } from '@/pages/jobs/JobDetailPage';
import { MyApplicationsPage } from '@/pages/applications/MyApplicationsPage';
import { MyJobsPage } from '@/pages/company/MyJobsPage';
import { CreateJobPage } from '@/pages/company/CreateJobPage';
import { JobApplicantsPage } from '@/pages/company/JobApplicantsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Only Auth Routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main Layout Routes */}
      <Route element={<AppLayout />}>
        {/* Landing Page / Home */}
        <Route path="/" element={<LandingPage />} />

        {/* Detail Lowongan (Dapat diakses Job Seeker & Company untuk pratinjau publik) */}
        <Route
          element={<ProtectedRoute allowedRoles={['JOB_SEEKER', 'COMPANY']} />}
        >
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Route>

        {/* Job Seeker Accessible Routes */}
        <Route element={<ProtectedRoute allowedRoles={['JOB_SEEKER']} />}>
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
        </Route>

        {/* Company Accessible Routes */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
          <Route path="/company/jobs" element={<MyJobsPage />} />
          <Route path="/company/jobs/new" element={<CreateJobPage />} />
          <Route
            path="/company/jobs/:id/applicants"
            element={<JobApplicantsPage />}
          />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
