import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_MENUS, isActiveRoute } from '../routers';
import { useAuth } from '../contexts/AuthContext';
import NotificationCounter from './NotificationCounter';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);
  const [mobileRecruitersOpen, setMobileRecruitersOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);

  const location = useLocation();

  // Utiliser l'utilisateur connecté ou un utilisateur par défaut
  const adminUser = user || {
    first_name: 'Admin',
    last_name: 'Destiny',
    email: 'admin@destinyjobs.bj',
    username: 'admin'
  };

  // Générer les initiales de l'utilisateur
  const getUserInitials = () => {
    const firstName = adminUser.first_name || '';
    const lastName = adminUser.last_name || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    return 'AD';
  };

  // Obtenir le prénom de l'utilisateur
  const getUserFirstName = () => {
    if (adminUser.first_name) {
      return adminUser.first_name;
    }
    return adminUser.username || 'Admin';
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const toggleMobileMenu = () => {
    // Fermer les sous-menus avant d'ouvrir le menu burger
    setMobileDashboardOpen(false);
    setMobileRecruitersOpen(false);
    setMobileBlogOpen(false);
    setMobileOffersOpen(false);
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileDropdown = (menuId) => {
    switch (menuId) {
      case 'mobile-dashboard':
        setMobileDashboardOpen(!mobileDashboardOpen);
        break;
      case 'mobile-recruiters':
        setMobileRecruitersOpen(!mobileRecruitersOpen);
        break;
      case 'mobile-blog':
        setMobileBlogOpen(!mobileBlogOpen);
        break;
      case 'mobile-offers':
        setMobileOffersOpen(!mobileOffersOpen);
        break;
      default:
        break;
    }
  };

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path, exact = false) => {
    return isActiveRoute(location.pathname, path, exact);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link to="/">
              <img src="/vite.svg" alt="Destiny Jobs Admin" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden xl:flex flex-1 justify-center space-x-4 2xl:space-x-6">
            {NAVIGATION_MENUS.MAIN.map((menu) => (
              <div key={menu.id}>
                {menu.children ? (
                  // Menu avec sous-menus
                  <div className="relative group">
                    <button className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                      isActiveLink(menu.path)
                        ? 'text-fuchsia-600 bg-fuchsia-50' 
                        : 'text-gray-700 hover:text-fuchsia-600'
                    }`}>
                      <i className={`${menu.icon} mr-1`}></i>
                      {menu.label} <i className="fas fa-chevron-down ml-1 text-xs"></i>
                    </button>
                    <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                      <div className="py-1">
                        {menu.children.map((subMenu) => (
                          <Link 
                            key={subMenu.id} 
                            to={subMenu.path} 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                          >
                            <i className={`${subMenu.icon} mr-2`}></i>{subMenu.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Menu simple
                  <Link 
                    to={menu.path} 
                    className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      isActiveLink(menu.path, menu.exact)
                        ? 'text-fuchsia-600 bg-fuchsia-50' 
                        : 'text-gray-700 hover:text-fuchsia-600'
                    }`}
                  >
                    <i className={`${menu.icon} mr-1`}></i>
                    {menu.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/notifications">
                <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                  <i className="fas fa-bell text-lg"></i>
                  <NotificationCounter />
                </button>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <span className="hidden xl:inline">
                  {getUserFirstName()}
                </span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    <div className="font-medium">{getUserFirstName()}</div>
                    <div className="text-xs text-gray-400">{adminUser.email}</div>
                  </div>
                  {NAVIGATION_MENUS.USER.map((userMenu) => (
                    <Link 
                      key={userMenu.id}
                      to={userMenu.path} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                    >
                      <i className={`${userMenu.icon} mr-2`}></i>{userMenu.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100"></div>
                                                   <button 
                                   onClick={handleLogout}
                                   className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                                 >
                                   <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
                                 </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Notifications */}
            <Link to="/notifications">
              <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                <i className="fas fa-bell"></i>
                <NotificationCounter />
              </button>
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">{getUserInitials()}</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {getUserFirstName()}
              </span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>

            {/* Mobile menu button */}
            <button type="button" className="text-gray-700 hover:text-fuchsia-600 focus:outline-none focus:text-fuchsia-600 p-2" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile User Menu */}
      <div className={`lg:hidden mobile-menu-slide bg-white border-t border-gray-200 ${userMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          {/* User Info Header */}
          <div className="px-3 py-3 bg-gray-50 rounded-md mb-2">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-fuchsia-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{getUserInitials()}</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {getUserFirstName()}
                </div>
                <div className="text-xs text-gray-400">
                  {adminUser.email}
                </div>
              </div>
            </div>
          </div>
          
          {NAVIGATION_MENUS.USER.map((userMenu) => (
            <Link 
              key={userMenu.id}
              to={userMenu.path} 
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md"
            >
              <i className={`${userMenu.icon} mr-2`}></i>{userMenu.label}
            </Link>
          ))}
          <Link to="/logout" className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md">
            <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          {NAVIGATION_MENUS.MAIN.map((menu) => (
            <div key={menu.id}>
              {menu.children ? (
                // Menu avec sous-menus
                <div>
                  <button 
                    onClick={() => toggleMobileDropdown(`mobile-${menu.id}`)} 
                    className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md ${
                      isActiveLink(menu.path)
                        ? 'text-fuchsia-600 bg-fuchsia-50' 
                        : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
                    }`}
                  >
                    <span><i className={`${menu.icon} mr-2`}></i>{menu.label}</span>
                    <i className={`fas fa-chevron-down text-xs transform transition-transform ${
                        menu.id === 'recruiters' ? mobileRecruitersOpen :
                        menu.id === 'blog' ? mobileBlogOpen :
                        menu.id === 'offers' ? mobileOffersOpen : false
                      } ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`mobile-menu-slide ml-4 ${
                    menu.id === 'recruiters' ? mobileRecruitersOpen :
                    menu.id === 'blog' ? mobileBlogOpen :
                    menu.id === 'offers' ? mobileOffersOpen : false
                  } ? 'show' : ''}`}>
                    {menu.children.map((subMenu) => (
                      <Link 
                        key={subMenu.id}
                        to={subMenu.path} 
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md"
                      >
                        <i className={`${subMenu.icon} mr-2`}></i>{subMenu.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // Menu simple
                <Link 
                  to={menu.path} 
                  className={`flex items-center px-3 py-2 text-sm rounded-md ${
                    isActiveLink(menu.path, menu.exact)
                      ? 'text-fuchsia-600 bg-fuchsia-50' 
                      : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
                  }`}
                >
                  <i className={`${menu.icon} mr-2`}></i>
                  {menu.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;