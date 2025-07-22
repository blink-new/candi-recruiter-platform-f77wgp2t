import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Calendar as CalendarIcon, MapPin, Clock, User, Edit, Trash2, X } from 'lucide-react';
import blink from '@/blink/client';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  projectId?: string;
  candidateId?: string;
  description?: string;
  projectName?: string;
  candidateName?: string;
}

interface Project {
  id: string;
  title: string;
}

interface Candidate {
  id: string;
  name: string;
  projectId: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventCard, setShowEventCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    projectId: '',
    candidateId: '',
    description: ''
  });

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch projects
      const fetchedProjects = await blink.db.projects.list({ where: { userId: user.id } });
      setProjects(fetchedProjects);
      
      // Fetch candidates
      const fetchedCandidates = await blink.db.candidates.list({ where: { userId: user.id } });
      setCandidates(fetchedCandidates);
      
      // Fetch events
      const fetchedEvents = await blink.db.calendarEvents.list({ where: { userId: user.id } });
      const formattedEvents = fetchedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        projectName: fetchedProjects.find(p => p.id === event.projectId)?.title,
        candidateName: fetchedCandidates.find(c => c.id === event.candidateId)?.name
      }));
      setEvents(formattedEvents);
    };

    fetchData();
  }, [user]);

  // Filter candidates based on selected project
  useEffect(() => {
    if (formData.projectId) {
      const filtered = candidates.filter(c => c.projectId === formData.projectId);
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates([]);
    }
  }, [formData.projectId, candidates]);

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      projectId: '',
      candidateId: '',
      description: ''
    });
  };

  const handleCreateEvent = async () => {
    if (!user || !formData.title || !formData.date || !formData.startTime || !formData.endTime) return;

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const newEvent = {
      id: `event_${Date.now()}`,
      title: formData.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      location: formData.location,
      projectId: formData.projectId,
      candidateId: formData.candidateId,
      description: formData.description,
      userId: user.id
    };

    try {
      await blink.db.calendarEvents.create(newEvent);
      
      const eventWithNames = {
        ...newEvent,
        start: startDateTime,
        end: endDateTime,
        projectName: projects.find(p => p.id === formData.projectId)?.title,
        candidateName: candidates.find(c => c.id === formData.candidateId)?.name
      };
      
      setEvents(prev => [...prev, eventWithNames]);
      setShowEventDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !user) return;

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    const updatedEvent = {
      title: formData.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      location: formData.location,
      projectId: formData.projectId,
      candidateId: formData.candidateId,
      description: formData.description
    };

    try {
      await blink.db.calendarEvents.update(selectedEvent.id, updatedEvent);
      
      const eventWithNames = {
        ...selectedEvent,
        ...updatedEvent,
        start: startDateTime,
        end: endDateTime,
        projectName: projects.find(p => p.id === formData.projectId)?.title,
        candidateName: candidates.find(c => c.id === formData.candidateId)?.name
      };
      
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? eventWithNames : e));
      setIsEditing(false);
      setShowEventCard(false);
      resetForm();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await blink.db.calendarEvents.delete(selectedEvent.id);
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setShowEventCard(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventCard(true);
  };

  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    setFormData({
      title: selectedEvent.title,
      date: moment(selectedEvent.start).format('YYYY-MM-DD'),
      startTime: moment(selectedEvent.start).format('HH:mm'),
      endTime: moment(selectedEvent.end).format('HH:mm'),
      location: selectedEvent.location || '',
      projectId: selectedEvent.projectId || '',
      candidateId: selectedEvent.candidateId || '',
      description: selectedEvent.description || ''
    });
    setIsEditing(true);
    setShowEventCard(false);
    setShowEventDialog(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Only create events on slot click for week and day views
    if (currentView === Views.MONTH) return;
    
    const startTime = moment(slotInfo.start);
    const endTime = moment(slotInfo.start).add(1, 'hour'); // Default 1-hour duration
    
    setFormData({
      title: '',
      date: startTime.format('YYYY-MM-DD'),
      startTime: startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      location: '',
      projectId: '',
      candidateId: '',
      description: ''
    });
    setIsEditing(false);
    setShowEventDialog(true);
  };

  const handleViewChange = (view: any) => {
    setCurrentView(view);
  };

  const handleEventDrop = async ({ event, start, end }: { event: CalendarEvent, start: Date, end: Date }) => {
    try {
      await blink.db.calendarEvents.update(event.id, {
        start: start.toISOString(),
        end: end.toISOString(),
      });
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventResize = async ({ event, start, end }: { event: CalendarEvent, start: Date, end: Date }) => {
    try {
      await blink.db.calendarEvents.update(event.id, {
        start: start.toISOString(),
        end: end.toISOString(),
      });
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: '#FFA552',
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        padding: '2px 6px'
      }
    };
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Calendar</h1>
            <p className="text-foreground/70">Schedule and manage your interviews and meetings</p>
          </div>
          
          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button className="bg-coral hover:bg-coral-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Event Name *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Interview with candidate"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Office, Zoom link, or address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Select 
                    value={formData.projectId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value, candidateId: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.projectId && (
                  <div>
                    <Label htmlFor="candidate">Candidate</Label>
                    <Select 
                      value={formData.candidateId} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, candidateId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCandidates.map(candidate => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            {candidate.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional notes or agenda items"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEventDialog(false);
                    setIsEditing(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isEditing ? handleUpdateEvent : handleCreateEvent}
                  className="bg-coral hover:bg-coral-dark text-white"
                  disabled={!formData.title || !formData.date || !formData.startTime || !formData.endTime}
                >
                  {isEditing ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar */}
        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            <div className="calendar-container">
              <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSelectSlot}
                onView={handleViewChange}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                defaultView={Views.MONTH}
                selectable
                popup
                className="soft-calendar"
                step={30}
                timeslots={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Details Popover */}
        {selectedEvent && (
          <Dialog open={showEventCard} onOpenChange={setShowEventCard}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle className="text-lg font-semibold">{selectedEvent.title}</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventCard(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-coral flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      {moment(selectedEvent.start).format('MMMM D, YYYY')}
                    </div>
                    <div className="text-foreground/70">
                      {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
                    </div>
                  </div>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-coral flex-shrink-0" />
                    <div>
                      {selectedEvent.location.startsWith('http') ? (
                        <a 
                          href={selectedEvent.location} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-coral hover:underline"
                        >
                          {selectedEvent.location}
                        </a>
                      ) : (
                        <span>{selectedEvent.location}</span>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedEvent.projectName && (
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarIcon className="h-4 w-4 text-coral flex-shrink-0" />
                    <div>
                      <div className="font-medium">Project</div>
                      <div className="text-foreground/70">{selectedEvent.projectName}</div>
                    </div>
                  </div>
                )}
                
                {selectedEvent.candidateName && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-coral flex-shrink-0" />
                    <div>
                      <div className="font-medium">Candidate</div>
                      <div className="text-foreground/70">{selectedEvent.candidateName}</div>
                    </div>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div className="pt-2 border-t">
                    <div className="font-medium text-sm mb-2">Description</div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteEvent}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditEvent}
                  className="bg-coral hover:bg-coral-dark text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}