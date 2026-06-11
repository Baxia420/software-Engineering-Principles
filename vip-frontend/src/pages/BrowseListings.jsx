import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import InternshipCard from '../components/InternshipCard';

export default function BrowseListings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      const { data, error } = await supabase
        .from('internships')
        .select('*, profiles(avatar_url)')
        .order('created_at', { ascending: false });
      if (data) {
        setListings(data);
      }
      setLoading(false);
    }
    loadListings();
  }, []);

  const filteredListings = listings.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background font-body-md h-screen overflow-hidden flex w-full">
      <SideNavBar />
      
      <main className="flex-1 ml-0 md:ml-64 flex flex-col w-full overflow-y-auto bg-background">
        <TopNavBar breadcrumbs={[{ label: 'Home', link: '/dashboard' }, { label: 'Browse Listings' }]} />
        
        <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-base mt-4 mb-8">
          <header className="mb-6 border-b border-outline-variant pb-6">
            <h2 className="font-h1 text-h1 text-primary mb-2">Browse Listings</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Find and apply for premium academic internship opportunities.</p>
          </header>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 border border-outline bg-surface-container-lowest text-on-surface rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md placeholder:text-on-surface-variant transition-colors" 
                placeholder="Search by company or role..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredListings.length > 0 ? (
              filteredListings.map(listing => (
                <InternshipCard 
                  key={listing.id}
                  title={listing.title}
                  company={`${listing.company} • ${listing.location}`}
                  status={listing.type}
                  avatarUrl={listing.profiles?.avatar_url}
                  onViewDetails={() => navigate(`/internship-details?id=${listing.id}`)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-on-surface-variant font-body-md">
                No active internship listings found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
