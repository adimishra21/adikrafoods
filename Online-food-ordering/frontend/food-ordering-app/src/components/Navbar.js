import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  InputBase, 
  Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  ShoppingCart as CartIcon, 
  AccountCircle, 
  Favorite as FavoriteIcon, 
  Receipt as ReceiptIcon, 
  Payment as PaymentIcon, 
  Notifications as NotificationsIcon, 
  Event as EventIcon, 
  ExitToApp as LogoutIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { api } from '../config/apiConfig';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const Navbar = () => {
  const { user, logout, isAuthenticated, isRestaurantOwner } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/api/cart');
      const count = response.data?.items?.length || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
      {isRestaurantOwner && (
        <MenuItem onClick={() => { handleMenuClose(); navigate('/restaurant-dashboard'); }}>Restaurant Dashboard</MenuItem>
      )}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const profileDrawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" component="div">
          {user?.fullName || 'User Profile'}
        </Typography>
        <Typography variant="body2">
          {user?.email || ''}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/orders">
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/favorites">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button component={Link} to="/payment">
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Payment" />
        </ListItem>
        <ListItem button component={Link} to="/notifications">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem button component={Link} to="/events">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: '1px',
              mr: 2
            }}
          >
            ADIKR Foods
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{ 
              display: { xs: 'block', sm: 'none' }, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: '1px',
              flexGrow: 1
            }}
          >
            ADIKR
          </Typography>

          {/* Search Bar */}
          <Search sx={{ flexGrow: { xs: 0, sm: 1 }, display: { xs: 'none', sm: 'flex' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for food or restaurants..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </Search>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: { xs: 0, sm: 2 } }}>
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <IconButton 
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ mr: 2 }}
                >
                  <StyledBadge badgeContent={cartCount} color="secondary">
                    <CartIcon />
                  </StyledBadge>
                </IconButton>

                {/* Profile Menu */}
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user?.fullName ? (
                    <Avatar 
                      sx={{ 
                        bgcolor: 'secondary.main',
                        width: 32,
                        height: 32
                      }}
                    >
                      {user.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              to="/"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/restaurants"
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Restaurants
            </Button>
            {isAuthenticated && isRestaurantOwner && (
              <Button
                component={Link}
                to="/restaurant-dashboard"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {profileDrawer}
      </Drawer>

      {/* Profile Menu */}
      {renderMenu}
    </AppBar>
  );
};

export default Navbar;
