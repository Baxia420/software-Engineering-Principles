import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import { supabase } from '../supabaseClient';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import InternshipCard from '../components/InternshipCard';
import { SkeletonList } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import PageTransition from '../components/ui/PageTransition';
import PageHeader from '../components/ui/PageHeader';

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
        
        <PageTransition className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-base mt-4 mb-8">
          <PageHeader
            title="Browse Listings"
            subtitle="Find and apply for premium academic internship opportunities."
          />

          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
              <input
                className="w-full pl-10 pr-4 py-2.5 border border-outline bg-surface-container-lowest text-on-surface rounded-DEFAULT focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 font-body-md text-body-md placeholder:text-on-surface-variant transition-all shadow-soft"
                placeholder="Search by company or role..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {!loading && (
              <p className="font-body-sm text-body-sm text-on-surface-variant self-center">
                {filteredListings.length} {filteredListings.length === 1 ? 'opportunity' : 'opportunities'}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <SkeletonList count={5} />
            ) : filteredListings.length > 0 ? (
              filteredListings.map((listing, i) => (
                <InternshipCard
                  key={listing.id}
                  delay={i * 60}
                  title={listing.title}
                  company={`${listing.company} • ${listing.location}`}
                  status={listing.type}
                  avatarUrl={listing.profiles?.avatar_url}
                  onViewDetails={() => navigate(`/internship-details?id=${listing.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon={SearchX}
                title={searchTerm ? 'No matches found' : 'No listings yet'}
                description={
                  searchTerm
                    ? 'Try a different company name or role keyword.'
                    : 'There are no active internship listings right now. Check back soon.'
                }
              />
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  );
}
