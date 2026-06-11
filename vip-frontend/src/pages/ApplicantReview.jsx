import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function ApplicantReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id');

  const [application, setApplication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadApplicationDetails() {
    if (!applicationId) {
      setLoading(false);
      return;
    }

    // 1. Fetch Application Details
    const { data: appData } = await supabase
      .from('applications')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          matric_number,
          bio,
          skills,
          department,
          avatar_url
        ),
        internships (
          title,
          company
        )
      `)
      .eq('id', applicationId)
      .single();

    if (appData) {
      setApplication(appData);
    }

    // 2. Fetch Messages
    const { data: msgData } = await supabase
      .from('application_messages')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: true });

    if (msgData) {
      setMessages(msgData);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadApplicationDetails();
  }, [applicationId]);

  const handleUpdateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (error) {
      alert(error.message);
    } else {
      setApplication({ ...application, status: newStatus });
      alert(`Application marked as ${newStatus}!`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSendingMessage(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('application_messages')
        .insert({
          application_id: applicationId,
          sender_id: user.id,
          message: newMessage.trim()
        });

      if (error) {
        alert(error.message);
      } else {
        setNewMessage('');
        loadApplicationDetails(); // Reload message thread
      }
    }
    setSendingMessage(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center p-8 bg-surface text-on-surface">
        Application not found. Please verify the URL.
      </div>
    );
  }

  const student = application.profiles;
  const internship = application.internships;
  const skillsArray = student?.skills ? student.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const displayName = student ? `${student.first_name} ${student.last_name}` : 'Unknown Applicant';
  const initials = student ? `${student.first_name?.charAt(0) || ''}${student.last_name?.charAt(0) || ''}`.toUpperCase() : 'UA';

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar 
          breadcrumbs={[
            { label: 'Home', link: '/company/dashboard' },
            { label: 'Applicants', link: '/company/dashboard' },
            { label: 'Applicant Review' }
          ]} 
        />

        <div className="p-margin-mobile md:p-margin-desktop max-w-[1280px] mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          <div>
            <button 
              onClick={() => navigate('/company/dashboard')}
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md bg-transparent border-none cursor-pointer p-0"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Dashboard
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-gutter">
            {/* Left Column: Details & Messages */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Candidate Header Card */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 rounded-lg border border-outline-variant bg-primary-container text-on-primary flex items-center justify-center text-3xl font-bold font-h1 shrink-0 overflow-hidden">
                    {student?.avatar_url ? (
                      <img src={student.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="font-h2 text-h2 text-on-surface font-bold font-h2 serif">{displayName}</h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Applying for: <span className="font-semibold text-primary">{internship?.title}</span></p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px] text-primary">school</span>
                            Matric: {student?.matric_number || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-block font-label-sm text-label-sm px-3 py-1.5 rounded-lg border uppercase tracking-wider font-semibold self-start md:self-center ${
                        application.status === 'approved' 
                          ? 'bg-green-600/10 border-green-600 text-green-700' 
                          : application.status === 'rejected' 
                          ? 'bg-error-container/15 border-error text-error' 
                          : 'bg-surface-variant border-outline-variant text-on-surface'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Grid Content */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* 1-Way Message Box for scheduling/shortlisting details */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                  <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Message Applicant</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Initiate a conversation thread with the candidate. Once you send the first message, they will be able to reply directly from their portal.</p>
                  
                  {/* Messages list */}
                  <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-2 flex flex-col gap-2">
                    {messages.length > 0 ? (
                      messages.map((msg) => {
                        const isStudent = msg.sender_id === application.student_id;
                        return (
                          <div 
                            key={msg.id} 
                            className={`p-3 border rounded-lg max-w-xl shadow-sm ${
                              isStudent 
                                ? 'bg-surface-variant border-outline-variant self-start' 
                                : 'bg-[#6B1B1B]/5 border-[#6B1B1B]/15 self-end'
                            }`}
                          >
                            <div className="font-label-sm text-label-sm uppercase tracking-wider mb-1 font-semibold text-[#6B1B1B]">
                              {isStudent ? 'Applicant' : 'Recruiter'}
                            </div>
                            <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">{msg.message}</p>
                            <span className="text-[9px] text-on-surface-variant mt-1.5 block">
                              {new Date(msg.created_at).toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-on-surface-variant text-xs italic text-center py-4">No messages exchanged yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message (e.g. Interview scheduled for Monday at 10 AM, Zoom Link...)"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border border-outline-variant rounded px-3 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface text-on-surface"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={sendingMessage}
                      className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 disabled:opacity-50 cursor-pointer border-none"
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </section>

                {/* Cover Letter */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                  <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Cover Letter</h2>
                  <div className="font-body-md text-body-md text-on-surface-variant space-y-4 leading-relaxed whitespace-pre-wrap">
                    {application.cover_letter || 'No cover letter provided.'}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Core Skills */}
                  <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col">
                    <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Applicant Core Skills</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillsArray.length > 0 ? (
                        skillsArray.map((skill, index) => (
                          <span key={index} className="bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md px-3 py-1.5 rounded-lg">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-on-surface-variant font-body-sm">No skills specified on profile.</span>
                      )}
                    </div>
                  </section>

                  {/* CV Document Link */}
                  <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h2 className="font-h3 text-h3 text-on-surface border-b border-outline-variant pb-3 mb-4 font-bold font-h3 serif">Resume / CV</h2>
                    </div>
                    {application.resume_url ? (
                      <a 
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-outline-variant rounded-xl p-4 flex items-center justify-between bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer group w-full mt-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-container/10 flex items-center justify-center rounded-lg">
                            <span className="material-symbols-outlined text-primary text-[28px]">picture_as_pdf</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-label-md text-label-md text-on-surface truncate">Click to View Resume</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">PDF Document</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">open_in_new</span>
                      </a>
                    ) : (
                      <span className="text-on-surface-variant font-body-sm mt-2">No resume uploaded.</span>
                    )}
                  </section>
                </div>
              </div>
            </div>

            {/* Right Column: Actions Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sticky top-24 shadow-sm flex flex-col">
                <h3 className="font-h3 text-h3 text-on-surface mb-6 font-bold font-h3 serif">Review Actions</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={application.status === 'approved'}
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-transparent shadow-sm disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Shortlist Candidate
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={application.status === 'rejected'}
                    className="w-full bg-transparent border border-outline text-on-surface font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors duration-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                    Reject Application
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
