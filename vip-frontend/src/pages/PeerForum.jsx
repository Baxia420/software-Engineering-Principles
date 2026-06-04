import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function PeerForum() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state for new thread
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  async function loadThreads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('forum_threads')
      .select(`
        *,
        profiles (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setThreads(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadThreads();
  }, []);

  const handleStartThread = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('forum_threads')
        .insert({
          author_id: user.id,
          title,
          content,
          category
        });

      if (error) {
        alert(error.message);
      } else {
        setTitle('');
        setContent('');
        setCategory('General');
        setShowModal(false);
        alert('Thread created successfully!');
        loadThreads();
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: localStorage.getItem('role') === 'supervisor' ? '/supervisor/dashboard' : localStorage.getItem('role') === 'company' ? '/company/dashboard' : '/dashboard' }, { label: 'Peer Forum' }]} />

        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-h1 text-h1 text-on-background font-bold font-h1 serif">Peer Discussion Forum</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">Connect, share experiences, and seek advice from fellow UTM students and alumni.</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary-container text-on-primary font-label-md text-label-md py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer border border-transparent shadow-sm"
            >
              <span className="material-symbols-outlined">add</span>
              Start New Thread
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-gutter items-start">
            {/* Left Column (Thread Feed) */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
              {/* Thread Cards */}
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto font-bold"></div>
                  </div>
                ) : threads.length > 0 ? (
                  threads.map(thread => {
                    const authorName = thread.profiles 
                      ? `${thread.profiles.first_name} ${thread.profiles.last_name}` 
                      : 'Anonymous';
                    const initials = thread.profiles 
                      ? `${thread.profiles.first_name?.charAt(0) || ''}${thread.profiles.last_name?.charAt(0) || ''}`.toUpperCase() 
                      : 'A';

                    return (
                      <article 
                        key={thread.id} 
                        onClick={() => navigate(`/forum/thread/${thread.id}`)}
                        className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 border-l-4 border-l-secondary-container hover:bg-surface-container-low transition-colors cursor-pointer shadow-sm relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                              {initials}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-secondary-container/10 text-secondary font-label-sm text-[11px] rounded uppercase font-semibold">
                                {thread.category}
                              </span>
                            </div>
                            <h3 className="font-h3 text-h3 text-on-background mb-2 font-bold font-h3 serif hover:text-primary transition-colors">
                              {thread.title}
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
                              {thread.content}
                            </p>
                            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                              <span className="text-xs">
                                Posted on {new Date(thread.created_at).toLocaleDateString()} by {authorName}
                              </span>
                              <span className="text-primary hover:underline font-medium text-xs flex items-center gap-0.5">
                                View Replies <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-on-surface-variant font-body-md bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg">
                    No forum discussions started yet. Be the first to start a thread!
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Guidelines Widget) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
              <aside className="bg-surface-container p-5 rounded-lg border border-outline-variant shadow-sm">
                <h4 className="font-h3 text-[18px] text-primary mb-2 flex items-center gap-2 font-bold font-h3 serif">
                  <span className="material-symbols-outlined">policy</span>
                  Forum Guidelines
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 leading-relaxed">
                  Please maintain professional conduct in all discussions. This forum is monitored by UTM career advisors.
                </p>
                <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-1 list-disc list-inside">
                  <li>Respect academic integrity.</li>
                  <li>Do not share confidential interview materials.</li>
                  <li>Be constructive and supportive.</li>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* Start Thread Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 w-full max-w-lg shadow-xl relative animate-in fade-in-50 duration-200">
            <h3 className="font-h2 text-h2 text-primary mb-4 font-bold serif">Start a New Discussion</h3>
            <form onSubmit={handleStartThread} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="modal-title">Thread Title</label>
                <input 
                  className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="modal-title"
                  placeholder="e.g. Tips for Petronas Software Engineering Interview"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="modal-category">Category</label>
                <select 
                  className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="modal-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="General">General Discussion</option>
                  <option value="Interview Prep">Interview Preparation</option>
                  <option value="Resume Advice">Resume &amp; CV Advice</option>
                  <option value="Career Advice">Career Advice</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="modal-content">Content</label>
                <textarea 
                  className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md bg-surface text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  id="modal-content"
                  placeholder="What is on your mind? Share detailed information..."
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded font-label-md text-label-md text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary text-on-primary rounded font-label-md text-label-md hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Thread'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
