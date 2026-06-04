import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const internshipId = searchParams.get('id');

  const [listing, setListing] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Fetch student's existing profile resume url if available
        const { data: profile } = await supabase
          .from('profiles')
          .select('skills, resume_url, resume_name')
          .eq('id', user.id)
          .single();
        if (profile && profile.resume_url) {
          setResumeUrl(profile.resume_url);
          setResumeName(profile.resume_name || 'Resume from Profile.pdf');
        }
      }

      if (internshipId) {
        const { data } = await supabase
          .from('internships')
          .select('*')
          .eq('id', internshipId)
          .single();
        if (data) {
          setListing(data);
        }
      }
    }
    loadData();
  }, [internshipId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setResumeUrl(publicUrl);
      setResumeName(file.name);
    } catch (err) {
      alert(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      alert('Please upload your CV/Resume first.');
      return;
    }
    setSubmitting(true);

    const { error } = await supabase
      .from('applications')
      .insert({
        internship_id: internshipId,
        student_id: userId,
        status: 'pending',
        cover_letter: coverLetter,
        resume_url: resumeUrl
      });

    setSubmitting(false);
    if (error) {
      alert(error.message);
    } else {
      alert('Application submitted successfully!');
      navigate('/my-applications');
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />
      
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[
          { label: 'Home', link: '/dashboard' }, 
          { label: 'Browse Listings', link: '/browse-listings' }, 
          { label: 'Application Form' }
        ]} />
        
        <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-[800px] mx-auto w-full flex-1 mb-8">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-h2 text-h2 text-on-surface">Application Form</h2>
              <div className="flex items-center gap-3">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">
                  Applying for: {listing?.title || 'Loading...'}
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Please provide your supporting documents and cover letter to apply for this position.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 shadow-sm flex flex-col gap-8">
            {/* Section 1: CV Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface">Curriculum Vitae (CV) <span className="text-error">*</span></label>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Upload your most recent CV in PDF format. Max size 5MB.</p>
              
              <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline-variant rounded bg-surface transition-colors duration-200 hover:border-primary hover:bg-primary-fixed/10 cursor-pointer text-center">
                <input accept=".pdf" className="hidden" onChange={handleFileUpload} type="file" required={!resumeUrl} />
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-3">upload_file</span>
                <span className="font-label-md text-label-md text-on-surface">
                  {uploading ? 'Uploading...' : resumeUrl ? 'CV Uploaded (Click to change)' : 'Click to upload your CV'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">PDF only (max. 5MB)</span>
              </label>

              {resumeUrl && (
                <div className="mt-2 text-sm text-secondary flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <span>{resumeName || 'Resume uploaded successfully!'}</span>
                </div>
              )}
            </div>

            {/* Section 2: Cover Letter */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="cover-letter">Cover Letter <span className="text-error">*</span></label>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Introduce yourself and explain why you are a strong candidate for this specific role.</p>
              <textarea 
                className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-outline-variant resize-y" 
                id="cover-letter" 
                placeholder="Dear Hiring Manager..." 
                required 
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-4 pt-6 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span className="font-body-sm text-body-sm">Your application will be reviewed by the faculty/company.</span>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-6 py-3 border border-primary text-primary font-label-md text-label-md rounded hover:bg-primary-fixed transition-colors duration-200 cursor-pointer bg-transparent" 
                  type="button"
                >
                  Back
                </button>
                <button 
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary font-label-md text-label-md rounded hover:bg-[#3a0306] transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer border border-transparent disabled:opacity-50" 
                  type="submit"
                  disabled={submitting || uploading}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
