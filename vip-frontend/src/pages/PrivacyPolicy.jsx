import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-dim text-on-surface font-body-md min-h-screen flex items-center justify-center p-4 md:p-8 w-full">
      {/* Policy Card Wrapper */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT max-w-[840px] w-full flex flex-col shadow-lg p-6 md:p-10 max-h-[90vh] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
        
        {/* Header */}
        <header className="border-b border-outline-variant pb-4 flex justify-between items-center">
          <div>
            <h1 className="font-h1 text-h2 md:text-h1 text-primary serif font-bold">Privacy Policy</h1>
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
            Effective Date: May 26, 2026. This policy outlines how UTM processes your data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA).
          </p>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">1. Collection of Personal Data</h2>
            <p>
              We collect information that you submit directly to the VIP portal. This includes personal identifiers (full name, matriculation number, university email, phone number), academic details (enrolled program, current CGPA, faculty), professional credentials (resumes, cover letters, portfolios, skills lists), and system interaction logs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">2. Purpose of Data Processing</h2>
            <p>
              Your data is processed strictly for the following academic and platform purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Facilitating internship applications and matches with registered UTM supervisors and corporate partners.</li>
              <li>Generating aggregated, anonymous metric models for the **Career Radar &amp; Market Trends** page.</li>
              <li>Enabling messaging, review, and feedback logs between student applicants and academic supervisors.</li>
              <li>Verifying matriculation records and eligibility parameters for student placements.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">3. Data Disclosure &amp; Sharing</h2>
            <p>
              Personal and academic documents, such as your CV and transcripts, are disclosed only to registered supervisors and prospective corporate employers whose listings you actively apply for. We do not sell, rent, or lease student datasets to third-party marketing networks. Anonymous, high-level skill statistics may be displayed on public trend sections.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">4. Security and Retention</h2>
            <p>
              UTM employs administrative and technical controls to guard student information against unauthorized disclosure, alteration, or theft. Resume documents and application history are retained securely for the duration of your academic program and subsequent validation windows, in line with university registrar policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">5. Your Access and Correction Rights</h2>
            <p>
              Under the PDPA 2010, you have the right to request access to and correction of your personal data. You can inspect, modify, or update your profile records, resume files, and listed core skills at any time via the **Profile Setup** panel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-h3 text-h3 text-on-surface font-bold serif">6. Contacting the DPA Officer</h2>
            <p>
              If you have inquiries, complaints, or seek to exercise data correction rights regarding the processing of personal data, please contact the UTM Career Centre Data Privacy Officer.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <footer className="border-t border-outline-variant pt-6 flex justify-end gap-4">
          <button 
            onClick={() => navigate('/auth')} 
            className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-DEFAULT hover:bg-primary-container transition-colors cursor-pointer border border-transparent shadow-sm"
          >
            I Agree and Close
          </button>
        </footer>
      </div>
    </div>
  );
}
