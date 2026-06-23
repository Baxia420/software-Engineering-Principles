import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Trash2 } from 'lucide-react';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [threads, setThreads] = useState([]);
  const [stats, setStats] = useState({ students: 0, companies: 0, pending: 0, internships: 0 });
  const [loading, setLoading] = useState(true);
  const [rejectionCompanyId, setRejectionCompanyId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  async function loadData() {
    // 1. Load Pending Companies
    const { data: companyProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'company')
      .order('is_approved', { ascending: true });
    if (companyProfiles) {
      setCompanies(companyProfiles);
    }

    // 2. Load Forum Threads
    const { data: forumThreads } = await supabase
      .from('forum_threads')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          company_name,
          role
        )
      `)
      .order('created_at', { ascending: false });
    if (forumThreads) {
      setThreads(forumThreads);
    }

    // 3. Load Overall platform stats
    const { data: studentsList } = await supabase.from('profiles').select('id').eq('role', 'student');
    const { data: companiesList } = await supabase.from('profiles').select('id').eq('role', 'company');
    const { data: pendingList } = await supabase.from('profiles').select('id').eq('role', 'company').eq('is_approved', false);
    const { data: internshipsList } = await supabase.from('internships').select('id');

    setStats({
      students: studentsList?.length || 0,
      companies: companiesList?.length || 0,
      pending: pendingList?.length || 0,
      internships: internshipsList?.length || 0
    });

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveCompany = async (id) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_approved: true,
        rejection_reason: null
      })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      alert('Company Approved successfully!');
      loadData();
    }
  };

  const submitRejection = async () => {
    if (!rejectionCompanyId || !feedbackText.trim()) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_approved: false,
        rejection_reason: feedbackText.trim()
      })
      .eq('id', rejectionCompanyId);

    if (error) {
      alert(error.message);
    } else {
      alert('Changes requested and company profile flagged.');
      setRejectionCompanyId(null);
      setFeedbackText('');
      loadData();
    }
  };

  const handleDeleteThread = async (id) => {
    if (!window.confirm('Are you sure you want to delete this forum thread?')) return;
    const { error } = await supabase
      .from('forum_threads')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      alert('Forum thread deleted!');
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home' }, { label: 'Supervisor Admin Panel' }]} />

        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          {/* Welcome Header */}
          <PageHeader
            title="UTM Admin Supervisor Panel"
            subtitle="Moderate registered industry partners and peer discussion forums."
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-lg shadow-soft p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Total Students</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.students}</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[32px]">school</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-lg shadow-soft p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Industry Partners</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.companies}</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[32px]">corporate_fare</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-lg shadow-soft p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Pending Approvals</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.pending}</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[32px]">pending_actions</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-lg shadow-soft p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-label-sm text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">Active Positions</p>
                <p className="font-h1 text-on-surface text-h1 font-bold">{stats.internships}</p>
              </div>
              <span className="material-symbols-outlined text-secondary text-[32px]">work</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* 1. Company Registrations Approvals */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Company Registrations</h2>
              <div className="flex flex-col gap-4">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <div key={company.id} className="p-4 border border-outline-variant rounded bg-surface flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-label-md text-label-md text-on-surface font-bold text-lg">{company.company_name}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Recruiter: {company.first_name} {company.last_name}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{company.bio || 'No description provided.'}</p>
                        {company.rejection_reason && (
                          <p className="text-xs text-primary-container bg-primary-container/5 border border-primary-container/15 p-2 rounded mt-2 font-medium">
                            ⚠️ Correction Feedback: "{company.rejection_reason}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0 items-center">
                        {company.is_approved ? (
                          <StatusBadge status="accepted" label="Verified" />
                        ) : (
                          <>
                            <Button size="sm" onClick={() => handleApproveCompany(company.id)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setRejectionCompanyId(company.id);
                                setFeedbackText('');
                              }}
                            >
                              Reject / Flag
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-on-surface-variant font-body-sm">No registered companies found.</p>
                )}
              </div>
            </section>

            {/* 2. Monitor Forum Threads */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Monitor Forums</h2>
              <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2">
                {threads.length > 0 ? (
                  threads.map((thread) => {
                    const author = thread.profiles 
                      ? (thread.profiles.role === 'company' ? thread.profiles.company_name : `${thread.profiles.first_name} ${thread.profiles.last_name}`)
                      : 'Anonymous';
                    return (
                      <div key={thread.id} className="p-4 border border-outline-variant rounded bg-surface flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate hover:text-primary cursor-pointer" onClick={() => navigate(`/forum/thread/${thread.id}`)}>
                            {thread.title}
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-1">{thread.content}</p>
                          <p className="text-[11px] text-on-surface-variant mt-2">By {author} ({thread.profiles?.role})</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteThread(thread.id)}
                          className="text-error hover:bg-error-container/20 p-2 rounded cursor-pointer shrink-0 bg-transparent border-none transition-colors"
                          title="Delete thread"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-on-surface-variant font-body-sm">No active discussions to monitor.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Rejection Feedback Dialog */}
      {rejectionCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-h3 text-h3 text-primary-container serif font-bold mb-2">Request Profile Changes</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Provide clear feedback to the company partner explaining why their registration is rejected or flagged. They will see this feedback when they log in.</p>
            
            <textarea 
              className="w-full px-3 py-2 border border-outline-variant rounded text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface resize-none mb-4"
              rows={4}
              placeholder="e.g. Please provide a verified corporate email and link to your active website."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setRejectionCompanyId(null);
                  setFeedbackText('');
                }}
                className="px-4 py-2 border border-outline text-on-surface rounded font-label-md hover:bg-surface-container transition-colors cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={submitRejection}
                disabled={!feedbackText.trim()}
                className="px-5 py-2 bg-primary-container text-white rounded font-label-md hover:opacity-90 disabled:opacity-50 cursor-pointer border border-transparent"
              >
                Submit & Flag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
