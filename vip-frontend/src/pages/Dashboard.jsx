import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { Send, Hourglass, Award, ArrowRight, MessagesSquare, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { useAuth } from '../AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';

/** Small count-up for the stat numbers. */
function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, value || 0, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);
  return <>{display}</>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ sent: 0, pending: 0, approved: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentThreads, setRecentThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadDashboardData() {
      try {
        // 1. Load Stats
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

        // 2. Load Recent Applications
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

        // 3. Load Recent Discussions
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
  }, [user, profile, authLoading, navigate]);

  if (authLoading || loading) {
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
        
        <PageTransition className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter">
          {/* Welcome Banner */}
          <header className="relative overflow-hidden bg-primary text-on-primary rounded-lg p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4 shadow-lift">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-secondary-container" />
            <div className="relative z-10">
              <h2 className="font-h2 mb-2 text-h2 font-['Newsreader'] serif">Welcome back, {welcomeName}</h2>
              <p className="font-body-lg text-on-primary/80 text-body-lg">{subTitle}</p>
            </div>
            <div className="relative z-10 flex gap-4">
              <Button
                variant="secondary"
                onClick={() => navigate('/browse-listings')}
                className="!bg-secondary-container !text-on-secondary-fixed !border-transparent hover:!bg-secondary-fixed-dim"
              >
                <Send size={16} /> New Application
              </Button>
            </div>
          </header>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Applications Sent', value: stats.sent, Icon: Send },
              { label: 'Pending Review', value: stats.pending, Icon: Hourglass },
              { label: 'Offers Received', value: stats.approved, Icon: Award },
            ].map((s, i) => (
              <Card key={s.label} accent hover animate delay={i * 90} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="font-h1 text-on-surface text-h1 font-bold">
                    <AnimatedNumber value={s.value} />
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <s.Icon size={22} strokeWidth={1.75} />
                </div>
              </Card>
            ))}
          </div>

          {/* Lower Grid: Applications & Forums */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Applications Table Section */}
            <Card as="section" className="lg:col-span-2 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-h3 text-primary-container text-h3 font-['Newsreader'] serif">Recent Applications</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/my-applications')}>
                  View All <ArrowRight size={15} />
                </Button>
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
                  <tbody>
                    {recentApplications.length > 0 ? (
                      recentApplications.map((app, i) => (
                        <tr
                          key={app.id}
                          className={`border-b border-outline-variant/60 hover:bg-surface-container transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-surface-container-low/40' : ''}`}
                          onClick={() => navigate(`/internship-details?id=${app.internships?.id}`)}
                        >
                          <td className="p-4 font-body-md text-on-surface font-medium">{app.internships?.company}</td>
                          <td className="p-4 font-body-md text-on-surface-variant">{app.internships?.title}</td>
                          <td className="p-4 font-body-sm text-on-surface-variant">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={app.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-0">
                          <EmptyState
                            icon={FileText}
                            title="No applications yet"
                            description="Browse listings and submit your first application to get started."
                            action={
                              <Button size="sm" onClick={() => navigate('/browse-listings')}>
                                Browse Listings
                              </Button>
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Recent Forums Section */}
            <Card as="aside" className="flex flex-col">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-h3 text-primary-container text-h3 font-['Newsreader'] serif">Recent Discussions</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/forum')}>
                  View All <ArrowRight size={15} />
                </Button>
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
                        className="flex items-start gap-3 p-3 hover:bg-surface-variant/30 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-outline-variant/50"
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
                  <EmptyState
                    icon={MessagesSquare}
                    title="No discussions yet"
                    description="Be the first to start a conversation in the peer forum."
                    className="py-8"
                  />
                )}
              </div>
            </Card>
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
