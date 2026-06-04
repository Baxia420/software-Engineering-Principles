import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';

export default function MyPostings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPostings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Query internships posted by current supervisor and join application count
        const { data, error } = await supabase
          .from('internships')
          .select(`
            *,
            applications (count)
          `)
          .eq('supervisor_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setPostings(data);
        }
      }
      setLoading(false);
    }
    loadPostings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('internships')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      setPostings(postings.filter(p => p.id !== id));
      alert('Listing deleted successfully!');
    }
  };

  const filtered = postings.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />

      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full flex flex-col bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: '/company/dashboard' }, { label: 'My Postings' }]} />

        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter mt-4 mb-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface font-bold font-h1 serif">My Internship Postings</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your current and past internship listings.</p>
            </div>
            <button 
              onClick={() => navigate('/company/create-listing')}
              className="bg-primary-container text-on-primary py-3 px-6 rounded-DEFAULT font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm border border-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              Post New Internship
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="relative w-full md:w-1/3">
              <label className="sr-only" htmlFor="search-postings">Search by title</label>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT bg-surface text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-on-surface" 
                id="search-postings" 
                placeholder="Search by title..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Listings Table / Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Header Row (Hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider font-semibold">
              <div className="col-span-5">Job Title</div>
              <div className="col-span-2">Workplace Type</div>
              <div className="col-span-2 text-center">Applicants</div>
              <div className="col-span-1 text-center">Stipend</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filtered.length > 0 ? (
              filtered.map(listing => {
                const applicantCount = listing.applications?.[0]?.count || 0;
                return (
                  <div key={listing.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-0 flex flex-col md:flex-row relative overflow-hidden group hover:border-outline transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-center p-6 pl-8">
                      <div className="col-span-1 md:col-span-5 flex flex-col">
                        <span className="font-h3 text-h3 text-on-surface font-bold font-h2 serif">{listing.title}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">{listing.company}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col md:block">
                        <span className="md:hidden font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Workplace Type</span>
                        <span className="font-body-md text-body-md text-on-surface capitalize">{listing.type}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden font-label-sm text-label-sm text-on-surface-variant uppercase">Applicants</span>
                        {applicantCount > 0 ? (
                          <button 
                            onClick={() => navigate('/company/dashboard')}
                            className="font-label-md text-label-md text-primary hover:underline bg-surface-container px-3 py-1 rounded-full border-none cursor-pointer"
                          >
                            {applicantCount} Applicants
                          </button>
                        ) : (
                          <span className="font-body-md text-body-md text-on-surface-variant">0</span>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-1 flex justify-between md:justify-center items-center">
                        <span className="md:hidden font-label-sm text-label-sm text-on-surface-variant uppercase">Stipend</span>
                        <span className="font-label-sm text-label-sm text-on-surface">
                          {listing.stipend ? `RM ${listing.stipend}` : 'Unpaid'}
                        </span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4 md:mt-0">
                        <button 
                          onClick={() => navigate(`/internship-details?id=${listing.id}`)}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors border border-transparent hover:border-outline-variant rounded-DEFAULT cursor-pointer bg-transparent"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(listing.id)}
                          className="p-2 text-error hover:bg-error-container/20 transition-colors border border-transparent rounded-DEFAULT cursor-pointer bg-transparent"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-on-surface-variant font-body-md bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg">
                No internship listings created yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
