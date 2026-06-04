import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ postings: 0, applicants: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Company Profile
      const { data: companyProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (companyProfile) {
        setProfile(companyProfile);
        if (!companyProfile.bio) {
          navigate('/profile-setup');
          return;
        }
      }

      // 2. Fetch Postings count & Applications if approved
      const { data: myInternships } = await supabase
        .from('internships')
        .select('id')
        .eq('supervisor_id', user.id);

      const internshipIds = myInternships?.map(i => i.id) || [];
      const postingsCount = internshipIds.length;

      if (internshipIds.length > 0) {
        const { data: apps } = await supabase
          .from('applications')
          .select(`
            *,
            profiles (
              first_name,
              last_name,
              matric_number,
              department,
              skills
            ),
            internships (
              title
            )
          `)
          .in('internship_id', internshipIds)
          .order('created_at', { ascending: false });

        if (apps) {
          setApplications(apps);
          const applicants = apps.length;
          const pending = apps.filter(a => a.status === 'pending').length;
          setStats({ postings: postingsCount, applicants, pending });
        }
      } else {
        setStats({ postings: postingsCount, applicants: 0, pending: 0 });
      }

      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const welcomeName = profile?.company_name || 'Company Partner';
  const isApproved = profile?.is_approved;

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home' }, { label: 'Company Dashboard' }]} />

        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          
          {/* Welcome Header */}
          <div className="mb-2">
            <h1 className="font-h1 text-h1 text-on-surface mb-2 font-bold font-h1 serif">Welcome, {welcomeName}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your corporate recruitment dashboard.</p>
          </div>

          {/* Pending Approval Banner */}
          {!isApproved && (
            profile?.rejection_reason ? (
              <div className="bg-error-container/15 border-l-4 border-error text-[#ba1a1a] p-4 rounded-lg flex items-start gap-3 shadow-sm mb-4">
                <span className="material-symbols-outlined text-[24px] text-error">report</span>
                <div>
                  <p className="font-label-md text-label-md font-bold">Correction Required</p>
                  <p className="font-body-sm text-body-sm mt-0.5">
                    Your company profile has been flagged by the UTM Supervisor with the following feedback:
                  </p>
                  <p className="font-label-md text-label-md mt-2 p-3 bg-error-container/10 border border-error/20 rounded italic text-error">
                    "{profile.rejection_reason}"
                  </p>
                  <p className="font-body-sm text-body-sm mt-2">
                    Please go to your <span className="font-semibold underline hover:text-[#4d0408] cursor-pointer" onClick={() => navigate('/profile')}>Profile Page</span> to correct your details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#fff3cd] border-l-4 border-[#ffc107] text-[#856404] p-4 rounded-lg flex items-start gap-3 shadow-sm mb-4">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <div>
                  <p className="font-label-md text-label-md font-bold">Verification Pending</p>
                  <p className="font-body-sm text-body-sm mt-0.5">Your organization's account is currently awaiting admin approval. You will be able to post internships and review candidates once verified.</p>
                </div>
              </div>
            )
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Posted Positions */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter border-l-4 border-l-[#C4860A] flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Posted Internships</p>
                  <h2 className="font-h2 text-h2 text-on-surface font-bold">{stats.postings}</h2>
                </div>
                <div className="p-2 bg-surface-container rounded-lg text-primary">
                  <span className="material-symbols-outlined">work</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Active internship positions</p>
            </div>

            {/* Total Applicants */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter border-l-4 border-l-[#C4860A] flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Applicants</p>
                  <h2 className="font-h2 text-h2 text-on-surface font-bold">{stats.applicants}</h2>
                </div>
                <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Students applied to listings</p>
            </div>

            {/* Pending Reviews */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-gutter border-l-4 border-l-[#C4860A] flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Pending Review</p>
                  <h2 className="font-h2 text-h2 text-on-surface font-bold">{stats.pending}</h2>
                </div>
                <div className="p-2 bg-error-container/50 rounded-lg text-error">
                  <span className="material-symbols-outlined">pending_actions</span>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Requires recruitment attention</p>
            </div>
          </div>

          {/* Roster Area */}
          {isApproved && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm mt-4">
              <div className="p-gutter border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-h3 text-h3 text-on-surface font-['Newsreader'] serif font-bold">Applicant Roster</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-lowest border-b border-outline-variant">
                    <tr>
                      <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Internship Position</th>
                      <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date Applied</th>
                      <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {applications.length > 0 ? (
                      applications.map((app) => {
                        const studentName = app.profiles 
                          ? `${app.profiles.first_name} ${app.profiles.last_name}` 
                          : 'Unknown Student';

                        return (
                          <tr key={app.id} className="hover:bg-surface-container transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                                  {app.profiles?.first_name?.charAt(0)}{app.profiles?.last_name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-label-md text-label-md text-on-surface">{studentName}</p>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant">Matric: {app.profiles?.matric_number || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface">
                              {app.internships?.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface capitalize">
                              <span className={`px-2 py-1 rounded font-semibold text-xs uppercase ${
                                app.status === 'approved' 
                                  ? 'bg-green-600/10 text-green-700' 
                                  : app.status === 'rejected' 
                                  ? 'bg-error-container/15 text-error' 
                                  : 'bg-surface-variant text-on-surface'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface">
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => navigate(`/company/review?id=${app.id}`)}
                                className="px-4 py-1.5 bg-primary text-on-primary font-label-sm text-label-sm rounded hover:opacity-90 transition-opacity cursor-pointer border-none"
                              >
                                Review Candidate
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant font-body-sm bg-surface-container-lowest">
                          No applicants found for your positions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
