import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { Search, ChevronDown, FileText } from 'lucide-react';
import InternshipCard from '../components/InternshipCard';
import { useAuth } from '../AuthContext';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonList } from '../components/ui/Skeleton';

export default function MyApplications() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  async function loadApplications() {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          internships (
            id,
            title,
            company,
            location,
            duration,
            stipend,
            profiles(avatar_url)
          ),
          application_messages (
            id,
            message,
            created_at,
            sender_id
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Sort messages chronologically for each application
        const processed = data.map(app => {
          const msgs = app.application_messages || [];
          const sortedMsgs = [...msgs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          return {
            ...app,
            application_messages: sortedMsgs
          };
        });
        setApplications(processed);

        // Update selectedApp from fresh data if it is currently open
        setSelectedApp(prev => {
          if (!prev) return null;
          const updated = processed.find(a => a.id === prev.id);
          return updated || null;
        });
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    loadApplications();
  }, [user, authLoading, navigate]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedApp) return;
    setSendingReply(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('application_messages')
          .insert({
            application_id: selectedApp.id,
            sender_id: user.id,
            message: replyText.trim()
          });

        if (error) {
          alert(error.message);
        } else {
          setReplyText('');
          await loadApplications(); // Reload applications and messages
        }
      }
    } catch (err) {
      alert(err.message || 'Error sending reply.');
    } finally {
      setSendingReply(false);
    }
  };

  const filtered = applications.filter(app => {
    const title = app.internships?.title || '';
    const company = app.internships?.company || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === '' || app.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />
      
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: '/dashboard' }, { label: 'My Applications' }]} />
        
        <PageTransition className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-base mt-4 mb-8">
          <PageHeader
            title="My Applications"
            subtitle="Track and manage your academic internship progress."
          />

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
              <input
                className="w-full pl-10 pr-4 py-2.5 border border-outline bg-surface-container-lowest text-on-surface rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 font-body-md text-body-md placeholder:text-on-surface-variant transition-all shadow-soft"
                placeholder="Search by company or role..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-48">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-outline bg-surface-container-lowest text-on-surface rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md appearance-none cursor-pointer transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <SkeletonList count={4} />
            ) : filtered.length > 0 ? (
              filtered.map((app, i) => (
                <InternshipCard
                  key={app.id}
                  delay={i * 60}
                  title={app.internships?.title || 'Unknown Role'}
                  company={app.internships?.company || 'Unknown Company'}
                  avatarUrl={app.internships?.profiles?.avatar_url}
                  status={app.status}
                  appliedDate={new Date(app.created_at).toLocaleDateString()}
                  actionLabel="View Application"
                  messageCount={app.application_messages?.length || 0}
                  onViewDetails={() => setSelectedApp(app)}
                />
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title={search || filterStatus ? 'No matching applications' : 'No applications yet'}
                description={
                  search || filterStatus
                    ? 'Try clearing your search or status filter.'
                    : 'When you apply to internships, they will appear here so you can track their progress.'
                }
              />
            )}
          </div>
        </PageTransition>
      </main>

      {/* Detailed Application Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-outline-variant flex items-start justify-between">
              <div>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 block">
                  Application Details
                </span>
                <h3 className="font-h2 text-h2 text-primary serif font-bold leading-tight">
                  {selectedApp.internships?.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {selectedApp.internships?.company} • {selectedApp.internships?.location || 'Location Not Specified'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent p-1 rounded-full flex items-center justify-center hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Status Section */}
              <div className="p-4 rounded-lg bg-surface border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                    Application Status
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={selectedApp.status}
                      label={selectedApp.status === 'approved' ? 'Accepted / Shortlisted' : undefined}
                    />
                  </div>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Applied on: <span className="font-semibold text-on-surface">{new Date(selectedApp.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Recruiter Messages Timeline */}
              <div className="space-y-3">
                <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2 flex items-center gap-2 font-semibold">
                  <span className="material-symbols-outlined text-[20px] text-primary">chat</span>
                  Messages Timeline
                </h4>
                
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 flex flex-col gap-2">
                  {selectedApp.application_messages && selectedApp.application_messages.length > 0 ? (
                    selectedApp.application_messages.map((msg) => {
                      const isSelf = msg.sender_id === selectedApp.student_id;
                      return (
                        <div 
                          key={msg.id} 
                          className={`p-3 border rounded-lg max-w-[85%] relative shadow-sm ${
                            isSelf 
                              ? 'bg-primary-container border-primary-container text-white self-end rounded-br-none' 
                              : 'bg-surface-container-low border-outline-variant text-on-surface self-start rounded-bl-none'
                          }`}
                        >
                          {!isSelf && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container rounded-l-lg"></div>}
                          <div className={`font-label-sm text-[10px] uppercase tracking-wider mb-1 font-semibold ${
                            isSelf ? 'text-white/80' : 'text-primary-container'
                          }`}>
                            {isSelf ? 'You' : 'Recruiter'}
                          </div>
                          <p className="font-body-md text-body-md whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </p>
                          <span className={`text-[9px] mt-2 block text-right font-medium ${
                            isSelf ? 'text-white/60' : 'text-on-surface-variant'
                          }`}>
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-on-surface-variant font-body-sm italic bg-surface-container border border-dashed border-outline-variant rounded-lg">
                      No messages from the company recruiter yet.
                    </div>
                  )}
                </div>
                
                {/* Reply section or waiting notification */}
                {selectedApp.application_messages?.some(msg => msg.sender_id !== selectedApp.student_id) ? (
                  <form onSubmit={handleSendReply} className="flex gap-2 mt-4 pt-2 border-t border-outline-variant">
                    <input 
                      type="text" 
                      placeholder="Type your reply to the recruiter..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 border border-outline-variant rounded px-3 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface text-on-surface"
                      required
                      disabled={sendingReply}
                    />
                    <button 
                      type="submit" 
                      disabled={sendingReply || !replyText.trim()}
                      className="bg-primary-container text-white px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border border-transparent"
                    >
                      {sendingReply ? 'Sending...' : 'Send'}
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded bg-blue-50/50 border border-blue-100 text-blue-800 text-[13px] font-medium mt-2 dark:bg-blue-950/10 dark:border-blue-900/30 dark:text-blue-200">
                    <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">info</span>
                    <span>Waiting for the company recruiter to open the communication channel. You can reply once they message you.</span>
                  </div>
                )}
              </div>

              {/* Cover Letter Submitted */}
              <div className="space-y-2">
                <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2 font-semibold">
                  Your Cover Letter
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap leading-relaxed max-h-[150px] overflow-y-auto pr-2 bg-surface-container p-3 rounded border border-outline-variant/60">
                  {selectedApp.cover_letter || 'No cover letter provided.'}
                </p>
              </div>

              {/* Action Buttons & Resume Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-semibold">
                    Submitted CV / Resume
                  </div>
                  {selectedApp.resume_url ? (
                    <a 
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-outline-variant rounded-lg p-3 flex items-center justify-between bg-surface-container hover:bg-surface-container-high transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-primary text-[24px]">picture_as_pdf</span>
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md text-on-surface truncate">View Submitted CV</p>
                          <p className="text-[11px] text-on-surface-variant">PDF Document</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0 text-[18px]">open_in_new</span>
                    </a>
                  ) : (
                    <span className="text-on-surface-variant text-xs italic">No resume uploaded.</span>
                  )}
                </div>

                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-semibold">
                    Internship Details
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedApp(null);
                      navigate(`/internship-details?id=${selectedApp.internships?.id}`);
                    }}
                    className="border border-primary-container text-primary-container rounded-lg p-3 flex items-center justify-between bg-transparent hover:bg-primary-container/5 transition-all cursor-pointer w-full text-left font-label-md text-label-md"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-[24px]">work</span>
                      <div>
                        <p className="font-label-md text-label-md truncate">View Listing Details</p>
                        <p className="text-[11px] text-on-surface-variant">Original Post details</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined flex-shrink-0 text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface border-t border-outline-variant flex justify-end">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md rounded hover:opacity-90 transition-opacity cursor-pointer border border-transparent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
