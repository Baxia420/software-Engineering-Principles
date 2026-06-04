import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data);
        } else {
          const meta = user.user_metadata || {};
          setProfile({
            id: user.id,
            first_name: meta.first_name || '',
            last_name: meta.last_name || '',
            role: meta.role || 'student',
            matric_number: meta.matric_number || '',
            company_name: meta.company_name || '',
            department: meta.department || '',
            bio: '',
            skills: '',
            avatar_url: ''
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isSupervisor = profile?.role === 'supervisor';
  const isCompany = profile?.role === 'company';
  const isStudent = profile?.role === 'student';

  const displayName = profile 
    ? (isCompany ? profile.company_name : `${profile.first_name} ${profile.last_name}`) 
    : 'No Name Set';

  const roleLabel = profile 
    ? (isSupervisor ? 'Faculty Supervisor' : isCompany ? 'Company Partner' : 'UTM Student') 
    : '';

  const skillsArray = profile?.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const initials = profile 
    ? (isCompany ? profile.company_name?.charAt(0) : `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`)?.toUpperCase() 
    : 'U';

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />
      
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: isSupervisor ? '/supervisor/dashboard' : isCompany ? '/company/dashboard' : '/dashboard' }, { label: 'Profile' }]} />
        
        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex-1 flex flex-col gap-gutter">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-base border-b border-outline-variant">
            <div>
              <h2 className="font-h1 text-h1 text-primary">Profile</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your professional or academic details.</p>
            </div>
            <button 
              onClick={() => navigate('/profile-setup')}
              className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-95 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-4">
            {/* Personal Overview Card */}
            <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant mb-4 bg-primary-container text-on-primary flex items-center justify-center text-3xl font-bold font-h1 shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <h3 className="font-h2 text-h2 text-on-surface mb-1">{displayName}</h3>
              <p className="font-label-md text-label-md text-secondary mb-4">{roleLabel}</p>
              <div className="w-full border-t border-outline-variant pt-4 mt-2 flex flex-col gap-3 text-left">
                {isStudent && (
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Matriculation Number</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium">{profile?.matric_number || 'Not Set'}</p>
                  </div>
                )}
                {isSupervisor && (
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Faculty / Department</p>
                    <p className="font-body-md text-body-md text-on-surface font-medium">{profile?.department || 'Not Set'}</p>
                  </div>
                )}
                {isCompany && (
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Approval Status</p>
                    <p className={`font-body-md text-body-md font-bold uppercase ${profile?.is_approved ? 'text-green-700' : 'text-amber-600'}`}>
                      {profile?.is_approved ? 'Approved Partner' : 'Awaiting Admin Approval'}
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Bio / Description</p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {profile?.bio || 'No description provided yet.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Skills Grid */}
            <div className="lg:col-span-2 flex flex-col gap-gutter">
              {/* Contact Info */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
                <h4 className="font-h3 text-h3 text-on-surface mb-4 pb-2 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline">contact_mail</span>
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Email Address</label>
                    <div className="px-3 py-2 border border-outline-variant rounded bg-surface text-on-surface font-body-md text-body-md flex items-center gap-2">
                      {email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills (Students only) */}
              {isStudent && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col gap-4">
                  <h4 className="font-h3 text-h3 text-on-surface pb-2 border-b border-outline-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">psychology</span>
                    Core Skills &amp; Competencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.length > 0 ? (
                      skillsArray.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-surface-container-high border border-outline-variant rounded font-label-md text-label-md text-on-surface">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">No skills added yet.</p>
                    )}
                    <button 
                      onClick={() => navigate('/profile-setup')}
                      className="px-3 py-1 border border-primary text-primary border-dashed rounded font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span> Add Skill
                    </button>
                  </div>
                </div>
              )}

              {/* CV / Resume (Students only) */}
              {isStudent && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col gap-4">
                  <h4 className="font-h3 text-h3 text-on-surface pb-2 border-b border-outline-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline">picture_as_pdf</span>
                    Curriculum Vitae (CV) / Resume
                  </h4>
                  {profile?.resume_url ? (
                    <a 
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-outline-variant rounded-lg p-4 flex items-center justify-between bg-surface hover:bg-surface-container transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-error text-[32px]">picture_as_pdf</span>
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-surface truncate">{profile.resume_name || 'View Resume.pdf'}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">PDF Document</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">open_in_new</span>
                    </a>
                  ) : (
                    <div className="text-center py-4 text-on-surface-variant font-body-sm italic">
                      No CV/Resume uploaded yet. Go to Edit Profile to upload.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="h-8"></div> {/* Spacer */}
        </div>
      </main>
    </div>
  );
}
