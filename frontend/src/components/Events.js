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
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosConfig';
import Layout from '../components/Layout';

/* Light Coffee Theme Setup */
const coffeeTheme = createTheme({
  palette: {
    primary: { main: '#4e342e' },
    secondary: { main: '#d7ccc8' },
    background: {
      default: '#f7f3f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#5d4037',
      secondary: '#795548',
    },
  },
  typography: {
    fontFamily: 'Merriweather, Georgia, serif',
    h4: {
      fontWeight: 700,
      color: '#5d4037',
    },
    body1: {
      color: '#5d4037',
    },
  },
});

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const Events = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [mode] = useState('light');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHobby, setSelectedHobby] = useState(''); // For hobby filter
  const [hobbiesList, setHobbiesList] = useState([]); // Store fetched hobbies

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [guestCount, setGuestCount] = useState(0);

  const colorMode = useMemo(() => ({ toggleColorMode: () => {} }), []);
  const theme = coffeeTheme;

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events/');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch Hobbies
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axiosInstance.get('/api/hobbies/');
        setHobbiesList(response.data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };
    fetchHobbies();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedDate) {
      filtered = filtered.filter((event) => event.date === selectedDate);
    }

    if (selectedHobby) {
      filtered = filtered.filter((event) => event.hobby && event.hobby.id === parseInt(selectedHobby, 10));
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedDate, selectedHobby, events]);

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
    if (!selectedEvent) return;
    try {
      const response = await axiosInstance.post(
        `/api/events/${selectedEvent.id}/rsvp/`,
        { guest_count: guestCount }
      );
      setSnackbarMessage(response.data.detail);
      setSnackbarOpen(true);

      const updatedEvent = { ...selectedEvent };
      if (updatedEvent.is_attending) {
        updatedEvent.is_attending = false;
        updatedEvent.attendees_count -= guestCount + 1;
      } else {
        updatedEvent.is_attending = true;
        updatedEvent.attendees_count += guestCount + 1;
      }
      setSelectedEvent(updatedEvent);

      const updatedEvents = events.map((evt) =>
        evt.id === updatedEvent.id ? updatedEvent : evt
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
      <Box
        sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: '80vh', backgroundColor: theme.palette.background.default
        }}
      >
        <Typography variant="h6" color="text.primary">Loading events...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 2, backgroundColor: theme.palette.background.default }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Layout setIsAuth={setIsAuth}>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.default,
              minHeight: '100vh',
              pb: '80px'
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                padding: 3,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '0 0 16px 16px',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Events Page
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Explore upcoming events tailored for hobbyists!
              </Typography>
            </Box>

            {/* Search & Filters */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 2,
                padding: '8px 16px',
                boxShadow: 2,
                margin: '16px',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {/* Search */}
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
                <InputBase
                  sx={{ flex: 1, fontSize: '16px', color: theme.palette.text.primary }}
                  placeholder="Search events..."
                  inputProps={{ 'aria-label': 'search events' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton>
                  <SearchIcon style={{ color: theme.palette.primary.main }} />
                </IconButton>
              </Box>

              {/* Date Filter */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Date:</Typography>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    border: '1px solid #d6ccc9',
                    borderRadius: '4px',
                    padding: '4px',
                    height: '36px',
                    color: theme.palette.text.primary,
                    backgroundColor: '#fff',
                    fontFamily: 'Merriweather, Georgia, serif',
                  }}
                />
              </Box>

              {/* Hobby Filter */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Hobby:</Typography>
                <select
                  value={selectedHobby}
                  onChange={(e) => setSelectedHobby(e.target.value)}
                  style={{
                    border: '1px solid #d6ccc9',
                    borderRadius: '4px',
                    padding: '4px',
                    height: '36px',
                    color: theme.palette.text.primary,
                    backgroundColor: '#fff',
                    fontFamily: 'Merriweather, Georgia, serif',
                  }}
                >
                  <option value="">All Hobbies</option>
                  {hobbiesList.map((hobby) => (
                    <option key={hobby.id} value={hobby.id}>
                      {hobby.name}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>

            {/* Events Grid */}
            <Grid container spacing={3} sx={{ padding: 2 }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 4,
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'scale(1.02)' },
                        backgroundColor: theme.palette.background.paper,
                        cursor: 'pointer',
                      }}
                    >
                      {event.image && (
                        <Box
                          component="img"
                          src={event.image}
                          alt={event.title}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: '4px 4px 0 0'
                          }}
                          onClick={() => openModal(event)}
                        />
                      )}
                      <CardContent onClick={() => openModal(event)}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Date:</strong> {event.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Location:</strong> {event.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Remaining RSVPs:</strong>{' '}
                          {event.max_attendees - event.attendees_count > 0
                            ? event.max_attendees - event.attendees_count
                            : 'Full'}
                        </Typography>
                        {event.hobby && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Hobby:</strong> {event.hobby.name}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            marginTop: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          color="text.primary"
                        >
                          {event.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: 'center', width: '100%' }}
                >
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
                  borderRadius: 2,
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
                    {selectedEvent.hobby && (
                      <Typography>
                        <strong>Hobby:</strong> {selectedEvent.hobby.name}
                      </Typography>
                    )}
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
                          backgroundColor: '#fff',
                          color: theme.palette.text.primary,
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
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setSnackbarOpen(false)}
                >
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