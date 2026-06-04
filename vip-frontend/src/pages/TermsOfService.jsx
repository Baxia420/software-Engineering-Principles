import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-dim text-on-surface font-body-md min-h-screen flex items-center justify-center p-4 md:p-8 w-full">
      {/* Policy Card Wrapper */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT max-w-[840px] w-full flex flex-col shadow-lg p-6 md:p-10 max-h-[90vh] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
        
        {/* Header */}
        <header className="border-b border-outline-variant pb-4 flex justify-between items-center">
          <div>
            <h1 className="font-h1 text-h2 md:text-h1 text-primary serif font-bold">Terms of Service</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Universiti Teknologi Malaysia • Virtual Internship Portal</p>
          </div>
          <button 
            onClick={() => navigate('/auth')} 
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors bg-transparent border-none cursor-pointer p-2"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </button>
        </header>

        {/* Policy Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 my-6 space-y-6 text-on-surface-variant leading-relaxed font-body-md text-body-md scrollbar-thin">
          <p className="font-body-md text-body-md text-on-surface italic">
            Effective Date: May 26, 2026. Please read these Terms of Service carefully before utilizing the UTM Virtual Internship Portal.
          </p>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">1. Acceptance of Terms</h2>
            <p>
              By accessing, registering, or using the Virtual Internship Portal (VIP), you agree to comply with and be bound by these Terms of Service. If you are registering on behalf of a faculty, corporate partner, or supervisor, you represent that you have the authority to bind such entities to these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">2. User Eligibility &amp; Enrollment Rules</h2>
            <p>
              Use of this portal is restricted to active students, alumni, faculty coordinators, and approved industry partners of Universiti Teknologi Malaysia (UTM). Students must maintain satisfactory academic status and represent their academic standing, including current CGPA and faculty enrollment, truthfully and without manipulation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">3. Academic &amp; Professional Integrity</h2>
            <p>
              The VIP portal facilitates official academic internships. All job postings, resume submissions, and interview logs must reflect authentic, verifiable opportunities and credentials. Any attempt to upload fraudulent documents, post duplicate/phantom listings, or submit falsified supervisor evaluations is a violation of UTM's Student Code of Conduct and will result in immediate suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">4. Code of Conduct on Peer Discussion Forums</h2>
            <p>
              The Peer Discussion Forum is designed to foster a community of guidance. Users must maintain professional decorum. You agree not to post confidential interview questionnaires, proprietary company test materials, or derogatory remarks regarding supervisors or corporate partners. Forums are active spaces monitored by UTM career advisors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">5. Platform Ownership &amp; System Abuse</h2>
            <p>
              All portal code, stylesheets, logo representations, and assets are owned by UTM or licensors. You agree not to scrape, reverse engineer, or bypass the portal's authentication mechanisms. Role credentials provided for students and supervisors are strictly personal and must not be shared or reused across sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">6. Changes to Terms</h2>
            <p>
              UTM Career Centre reserves the right to modify these Terms of Service at any time. Your continued use of the VIP portal following changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <footer className="border-t border-outline-variant pt-6 flex justify-end gap-4">
          <button 
            onClick={() => navigate('/auth')} 
            className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-DEFAULT hover:bg-primary-container transition-colors cursor-pointer border border-transparent shadow-sm"
          >
            I Accept and Understand
          </button>
        </footer>
      </div>
    </div>
  );
}
