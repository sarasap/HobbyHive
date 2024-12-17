import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Typography,
  InputBase,
  Card,
  CardContent,
  Button,
  Modal,
  Box,
  Fab,
  Snackbar,
  Grid,
  ThemeProvider, // Add this
  createTheme,  // Add this
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosConfig';
import Layout from '../components/Layout';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const Events = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('light');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [guestCount, setGuestCount] = useState(0);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events/');
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize filtered events
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  const handleCreateEventClick = () => {
    navigate('/create-event');
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleRSVP = async () => {
    try {
      const response = await axiosInstance.post(`/api/events/${selectedEvent.id}/rsvp/`,{ guest_count: guestCount });
      setSnackbarMessage(response.data.detail);
      setSnackbarOpen(true);
      const updatedEvent = { ...selectedEvent };
      if (selectedEvent.is_attending) {
        updatedEvent.is_attending = false;
        updatedEvent.attendees_count -= guestCount + 1; // Deduct guests and user
      } else {
        updatedEvent.is_attending = true;
        updatedEvent.attendees_count += guestCount + 1; // Add guests and user
      }
      setSelectedEvent(updatedEvent);
      const updatedEvents = events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      setSnackbarMessage('An error occurred while trying to RSVP.');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Layout setIsAuth={setIsAuth}>
    <ThemeProvider theme={theme}>
      <ColorModeContext.Provider value={colorMode}>
        <Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
          {/* App Bar */}
          {/* Header Section */}
          <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
              Events Page
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Explore upcoming events tailored for hobbyists!
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 2,
              padding: '8px 16px',
              boxShadow: 2,
              margin: '16px',
            }}
          >
            <InputBase
              sx={{ flex: 1, fontSize: '16px' }}
              placeholder="Search events..."
              inputProps={{ 'aria-label': 'search events' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Events List */}
          <Grid container spacing={3} sx={{ padding: 2 }}>
  {filteredEvents.length > 0 ? (
    filteredEvents.map((event) => (
      <Grid item xs={12} key={event.id}> {/* Adjust this line */}
        <Card
  sx={{
    borderRadius: 3,
    boxShadow: 2,
    transition: 'transform 0.2s ease',
    '&:hover': { transform: 'scale(1.02)' },
  }}
>
  {event.image && (
    <Box
      component="img"
      src={event.image}
      alt={event.title}
      sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }}
    />
  )}
  <CardContent onClick={() => openModal(event)}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
      {event.title}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      <strong>Date:</strong> {event.date}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      <strong>Location:</strong> {event.location}
    </Typography>
    <Typography variant="body2" color="textSecondary">
            <strong>Remaining RSVPs:</strong>{' '}
            {event.max_attendees - event.attendees_count > 0
              ? event.max_attendees - event.attendees_count
              : 'Full'}
    </Typography>
    <Typography
      variant="body2"
      sx={{ marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
    >
      {event.description}
    </Typography>
  </CardContent>
</Card>
      </Grid>
    ))
  ) : (
    <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
      No events found.
    </Typography>
  )}
</Grid>

          {/* Event Modal */}
          <Modal
            open={modalIsOpen}
            onClose={closeModal}
            aria-labelledby="event-title"
            aria-describedby="event-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 24,
                p: 4,
              }}
            >
              {selectedEvent && (
                <>
                  <Typography id="event-title" variant="h6" component="h2">
                    {selectedEvent.title}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    <strong>Date:</strong> {selectedEvent.date}
                  </Typography>
                  <Typography>
                    <strong>Time:</strong> {selectedEvent.time}
                  </Typography>
                  <Typography>
                    <strong>Location:</strong> {selectedEvent.location}
                  </Typography>
                  <Typography>
                    <strong>Category:</strong> {selectedEvent.category}
                  </Typography>
                  <Typography sx={{ mt: 2 }}>{selectedEvent.description}</Typography>
                  <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Number of Guests:
                        </Typography>
                        <InputBase
                          type="number"
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          inputProps={{ min: 0 }}
                          sx={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid',
                            borderColor: 'grey.400',
                            borderRadius: 1,
                          }}
                        />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRSVP}
                    sx={{ mt: 2 }}
                  >
                    {selectedEvent.is_attending ? 'Cancel RSVP' : 'RSVP'}
                  </Button>
                  <Button onClick={closeModal} sx={{ mt: 2, ml: 2 }}>
                    Close
                  </Button>
                </>
              )}
            </Box>
          </Modal>

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleCreateEventClick}
          >
            <AddIcon />
          </Fab>

          {/* Snackbar for Feedback */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Box>
      </ColorModeContext.Provider>
    </ThemeProvider>
    </Layout>
  );
};

export default Events;
