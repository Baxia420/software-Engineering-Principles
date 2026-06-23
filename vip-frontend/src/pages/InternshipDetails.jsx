import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function InternshipDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('student');

  useEffect(() => {
    async function loadDetails() {
      const userRole = localStorage.getItem('role') || 'student';
      setRole(userRole);

      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('internships')
        .select('*, profiles(avatar_url)')
        .eq('id', id)
        .single();

      if (data) {
        setListing(data);
      }
      setLoading(false);
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center p-8 bg-surface text-on-surface">
        Internship Listing not found.
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />
      
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar 
          breadcrumbs={[
            { label: 'Home', link: role === 'supervisor' ? '/supervisor/dashboard' : role === 'company' ? '/company/dashboard' : '/dashboard' },
            { label: role === 'company' ? 'My Postings' : 'Browse Listings', link: role === 'company' ? '/company/postings' : '/browse-listings' },
            { label: listing.title }
          ]} 
        />
        
        <div className="px-margin-desktop py-12 max-w-[1080px] mx-auto w-full flex-1 mb-8">
          {/* Header Section */}
          <header className="flex items-start gap-8 mb-12 pb-8 border-b border-outline-variant">
            <div className="w-24 h-24 rounded border border-outline-variant bg-surface-container-lowest flex items-center justify-center shrink-0 p-2 overflow-hidden shadow-sm font-bold text-primary-container text-2xl">
              {listing.profiles?.avatar_url ? (
                <img src={listing.profiles.avatar_url} alt={listing.company} className="w-full h-full object-cover" />
              ) : (
                listing.company.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className="inline-flex items-center px-2 py-1 mb-3 rounded bg-gray-600/10 text-gray-600 font-label-sm text-label-sm uppercase tracking-wider">
                {listing.type}
              </div>
              <h1 className="font-h1 text-h1 text-primary-container mb-2 leading-tight">{listing.title}</h1>
              <div className="font-h3 text-h3 text-secondary mb-4">{listing.company}</div>
              <div className="flex flex-wrap gap-4 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {listing.location}
                </div>
              </div>
            </div>
          </header>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column (Content Canvas) */}
            <div className="lg:col-span-8 space-y-10">
              <section>
                <h2 className="font-h3 text-h3 text-primary-container mb-4 pb-2 border-b border-surface-variant">Role Description</h2>
                <div className="font-body-md text-body-md text-on-surface space-y-4 whitespace-pre-wrap">
                  {listing.description}
                </div>
              </section>

              <section>
                <h2 className="font-h3 text-h3 text-primary-container mb-4 pb-2 border-b border-surface-variant">Requirements</h2>
                <div className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                  {listing.requirements}
                </div>
              </section>
            </div>

            {/* Right Column (Sticky Summary) */}
            <div className="lg:col-span-4">
              <aside className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container rounded-l"></div>
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-6 pb-4 border-b border-surface-variant">Internship Details</h3>
                <div className="space-y-5 mb-8">
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Duration</div>
                    <div className="font-body-md text-body-md text-on-surface font-medium">{listing.duration || 'Not Specified'}</div>
                  </div>
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mb-1">Monthly Stipend</div>
                    <div className="font-body-md text-body-md text-on-surface font-medium">
                      {listing.stipend ? `RM ${listing.stipend}` : 'Unpaid'}
                    </div>
                  </div>
                </div>
                {role === 'student' && (
                  <button 
                    onClick={() => navigate(`/apply?id=${listing.id}`)}
                    className="w-full bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md py-3.5 px-4 rounded transition-colors flex items-center justify-center gap-2 border border-transparent cursor-pointer shadow-soft hover:shadow-lift"
                  >
                    <span>Apply Now</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                )}
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
