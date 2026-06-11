import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ sent: 0, pending: 0, approved: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentThreads, setRecentThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.warn('No active session in Dashboard:', userError?.message);
          localStorage.removeItem('role');
          navigate('/auth');
          return;
        }

        const user = userData.user;

        // 1. Load Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.warn('Error fetching profile:', profileError.message);
        }

        if (profileData) {
          setProfile(profileData);
          if (!profileData.bio) {
            navigate('/profile-setup');
            return;
          }
        }

        // 2. Load Stats
        const { data: apps } = await supabase
          .from('applications')
          .select('status')
          .eq('student_id', user.id);
        
        if (apps) {
          const sent = apps.length;
          const pending = apps.filter(a => a.status === 'pending').length;
          const approved = apps.filter(a => a.status === 'approved').length;
          setStats({ sent, pending, approved });
        }

        // 3. Load Recent Applications
        const { data: recentApps } = await supabase
          .from('applications')
          .select(`
            id,
            created_at,
            status,
            internships (
              id,
              title,
              company
            )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);
        if (recentApps) {
          setRecentApplications(recentApps);
        }

        // 4. Load Recent Discussions
        const { data: threads } = await supabase
          .from('forum_threads')
          .select(`
            id,
            title,
            created_at,
            profiles (
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(3);
        if (threads) {
          setRecentThreads(threads);
        }

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const welcomeName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student';
  const subTitle = profile ? `${profile.matric_number || 'UTM Student'}` : '';

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]} />
        
        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter">
          {/* Welcome Banner */}
          <header className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
            <div>
              <h2 className="font-h2 text-primary-container mb-2 text-h2 font-['Newsreader'] serif">Welcome back, {welcomeName}</h2>
              <p className="font-body-lg text-on-surface-variant text-body-lg">{subTitle}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/browse-listings')}
                className="bg-primary-container text-on-primary font-label-md px-6 py-3 rounded-DEFAULT hover:bg-primary transition-colors border border-transparent cursor-pointer"
              >
                New Application
              </button>
            </div>
          </header>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-[#C4860A] rounded-DEFAULT p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Applications Sent</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.sent}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>send</span>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-[#C4860A] rounded-DEFAULT p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Pending Review</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>hourglass_empty</span>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-[#C4860A] rounded-DEFAULT p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Offers Received</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
              </div>
            </div>
          </div>

          {/* Lower Grid: Applications & Forums */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Applications Table Section */}
            <section className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT flex flex-col shadow-sm">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-h3 text-primary-container text-h3 font-['Newsreader'] serif">Recent Applications</h3>
                <button 
                  onClick={() => navigate('/my-applications')}
                  className="font-label-md text-primary-container text-label-md hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-variant/50 border-b border-outline-variant">
                      <th className="p-4 font-label-sm text-on-surface-variant text-label-sm font-semibold">Company</th>
                      <th className="p-4 font-label-sm text-on-surface-variant text-label-sm font-semibold">Role</th>
                      <th className="p-4 font-label-sm text-on-surface-variant text-label-sm font-semibold">Date Applied</th>
                      <th className="p-4 font-label-sm text-on-surface-variant text-label-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-surface-container transition-colors cursor-pointer" onClick={() => navigate(`/internship-details?id=${app.internships?.id}`)}>
                          <td className="p-4 font-body-md text-on-surface font-medium">{app.internships?.company}</td>
                          <td className="p-4 font-body-md text-on-surface-variant">{app.internships?.title}</td>
                          <td className="p-4 font-body-sm text-on-surface-variant">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-3 py-1 font-label-sm text-label-sm rounded uppercase ${
                              app.status === 'approved' 
                                ? 'bg-green-600/10 text-green-700' 
                                : app.status === 'rejected' 
                                ? 'bg-error-container/15 text-error' 
                                : 'bg-[#6B7280]/10 text-[#6B7280]'
                            }`}>
                              {app.status === 'approved' ? 'Accepted' : app.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-on-surface-variant font-body-sm">
                          No applications submitted recently.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Forums Section */}
            <aside className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT flex flex-col shadow-sm">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-h3 text-primary-container text-h3 font-['Newsreader'] serif">Recent Discussions</h3>
                <button 
                  onClick={() => navigate('/forum')}
                  className="font-label-md text-primary-container text-label-md hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {recentThreads.length > 0 ? (
                  recentThreads.map((thread) => {
                    const initials = thread.profiles 
                      ? `${thread.profiles.first_name?.charAt(0) || ''}${thread.profiles.last_name?.charAt(0) || ''}`.toUpperCase()
                      : 'A';
                    return (
                      <div 
                        key={thread.id} 
                        onClick={() => navigate(`/forum/thread/${thread.id}`)}
                        className="flex items-start gap-3 p-3 hover:bg-surface-variant/30 rounded cursor-pointer transition-colors border border-transparent hover:border-outline-variant/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-primary font-bold shrink-0 text-xs">
                          {initials}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-label-md text-on-surface hover:text-primary transition-colors truncate">
                            {thread.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-on-surface-variant text-xs py-4">No recent discussions.</p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
