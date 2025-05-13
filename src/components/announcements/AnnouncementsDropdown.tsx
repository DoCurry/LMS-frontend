import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { announcementAPI } from '@/api/api';
import { AnnouncementDto } from '@/models/announcement.model';

export function AnnouncementsDropdown() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementAPI.getAll();
        const latestAnnouncements = response.data.data.slice(0, 5);
        setAnnouncements(latestAnnouncements);
        // Set unread count based on last 24 hours
        const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
        setUnreadCount(
          latestAnnouncements.filter(
            (a:AnnouncementDto) => new Date(a.createdAt) > lastDay
          ).length
        );
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="max-h-[400px] overflow-auto p-4">
          <h3 className="font-medium mb-2">Latest Updates</h3>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                >
                  <h4 className="text-sm font-medium">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.content}
                  </p>
                  <time className="text-xs text-gray-400">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No announcements</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
