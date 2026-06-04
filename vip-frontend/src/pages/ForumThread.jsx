import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function ForumThread() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyInitials, setReplyInitials] = useState('JA');

  async function loadThreadDetails() {
    if (!threadId) return;

    // Fetch Thread Details
    const { data: threadData } = await supabase
      .from('forum_threads')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          role,
          department
        )
      `)
      .eq('id', threadId)
      .single();

    if (threadData) {
      setThread(threadData);
    }

    // Fetch Replies
    const { data: postsData } = await supabase
      .from('forum_posts')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          role
        )
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (postsData) {
      setReplies(postsData);
    }

    // Fetch current user initials
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      if (profile) {
        setReplyInitials(`${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`.toUpperCase());
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadThreadDetails();
  }, [threadId]);

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('forum_posts')
      .insert({
        thread_id: threadId,
        author_id: user.id,
        content: newReply.trim()
      });

    if (error) {
      alert(error.message);
    } else {
      setNewReply('');
      loadThreadDetails();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center p-8 bg-surface text-on-surface">
        Discussion Thread not found.
      </div>
    );
  }

  const authorName = thread.profiles 
    ? `${thread.profiles.first_name} ${thread.profiles.last_name}` 
    : 'Anonymous';
  const authorInitials = thread.profiles 
    ? `${thread.profiles.first_name?.charAt(0) || ''}${thread.profiles.last_name?.charAt(0) || ''}`.toUpperCase() 
    : 'A';
  const authorSub = thread.profiles 
    ? (thread.profiles.role === 'student' ? 'UTM Student' : `${thread.profiles.department || 'Faculty'}`) 
    : '';

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background pb-8">
        <TopNavBar 
          breadcrumbs={[
            { label: 'Home', link: localStorage.getItem('role') === 'supervisor' ? '/supervisor/dashboard' : localStorage.getItem('role') === 'company' ? '/company/dashboard' : '/dashboard' },
            { label: 'Peer Forum', link: '/forum' },
            { label: 'Discussion' }
          ]} 
        />

        <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-4 w-full">
          <button 
            onClick={() => navigate('/forum')}
            className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
            Back to Discussions
          </button>
        </div>

        <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-gutter w-full">
          {/* Left Column: Thread Content */}
          <div className="flex flex-col gap-6">
            <article className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
              <div className="p-6 md:p-8 pl-8 md:pl-10">
                {/* Post Header */}
                <div className="flex flex-col gap-4 border-b border-outline-variant pb-6 mb-6">
                  <h1 className="font-h1 text-h1 text-on-background font-bold font-h1 serif leading-tight">
                    {thread.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-md shrink-0 border border-outline-variant">
                        {authorInitials}
                      </div>
                      <div>
                        <div className="font-label-md text-on-surface">{authorName}</div>
                        <div className="text-xs">{authorSub} • Posted on {new Date(thread.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-surface-variant text-on-surface-variant font-label-sm px-2 py-1 rounded uppercase">
                      #{thread.category}
                    </span>
                  </div>
                </div>

                {/* Post Body */}
                <div className="mb-8 font-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                  {thread.content}
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="font-h2 text-h2 mb-6 border-b border-outline-variant pb-2 font-bold font-h2 serif">
                Discussion ({replies.length})
              </h2>

              {/* Comment Thread */}
              <div className="flex flex-col gap-6 mb-8">
                {replies.map((reply, idx) => {
                  const replierName = reply.profiles 
                    ? `${reply.profiles.first_name} ${reply.profiles.last_name}` 
                    : 'Anonymous';
                  const replierInitials = reply.profiles 
                    ? `${reply.profiles.first_name?.charAt(0) || ''}${reply.profiles.last_name?.charAt(0) || ''}`.toUpperCase() 
                    : 'A';

                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-bold shrink-0">
                        {replierInitials}
                      </div>
                      <div className="flex-1">
                        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-label-md text-label-md text-on-surface">{replierName}</span>
                            <span className="text-xs text-on-surface-variant">
                              {new Date(reply.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostReply} className="flex gap-4 border-t border-outline-variant pt-6">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-md shrink-0 border border-outline-variant">
                  {replyInitials}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <textarea 
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg p-3 font-body-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-y min-h-[100px] bg-surface text-on-surface" 
                    placeholder="Add your thoughts or advice..."
                    required
                  ></textarea>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-primary text-on-primary font-label-md px-6 py-2.5 rounded-lg hover:opacity-90 transition-colors cursor-pointer border border-transparent shadow-sm"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="font-h3 text-h3 mb-4 border-b border-outline-variant pb-2 font-bold font-h3 serif">About this Thread</h3>
              <div className="flex flex-col gap-3 font-body-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-on-surface font-medium">
                    {new Date(thread.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="text-on-surface font-medium capitalize">{thread.category}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
