import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_MENUS, isActiveRoute } from '../routers';
import { useAuth } from '../contexts/AuthContext';
import NotificationCounter from './NotificationCounter';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // États pour les menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});

  const normalizedRole = (value) =>
    typeof value === 'string' ? value.trim().toUpperCase() : '';
  const currentUser = user?.user || user;
  const isGestionnaire = [
    currentUser?.user_type,
    currentUser?.role,
    currentUser?.account_type,
    currentUser?.profile_type,
  ].map(normalizedRole).includes('GESTIONNAIRE');
  const mainMenus = isGestionnaire
    ? NAVIGATION_MENUS.MAIN.filter((menu) => menu.id !== 'recruiters')
    : NAVIGATION_MENUS.MAIN;

  // Fermer les menus mobiles au redimensionnement de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) { // xl breakpoint
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utilisateur par défaut
  const adminUser = user || {
    first_name: 'Admin',
    last_name: 'Destiny',
    email: 'admin@destinyjobs.bj',
    username: 'admin'
  };

  // Obtenir les initiales
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

  // Obtenir le prénom
  const getUserFirstName = () => {
    return adminUser.first_name || adminUser.username || 'Admin';
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Toggle menu mobile principal
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle menu utilisateur
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Toggle sous-menu
  const toggleSubmenu = (menuId) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Vérifier si un lien est actif
  const isActiveLink = (path, exact = false) => {
    return isActiveRoute(location.pathname, path, exact);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link to="/">
              <img src="/vite.svg" alt="Destiny Jobs Admin" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden xl:flex flex-1 justify-center space-x-4 2xl:space-x-6">
            {mainMenus.map((menu) => (
              <div key={menu.id}>
                {menu.children ? (
                  <div className="relative group">
                    <button className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                      isActiveLink(menu.path)
                        ? 'text-fuchsia-600 bg-fuchsia-50'
                        : 'text-gray-700 hover:text-fuchsia-600'
                    }`}>
                      <i className={`${menu.icon} mr-1`}></i>
                      {menu.label}
                      <i className="fas fa-chevron-down ml-1 text-xs"></i>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <div className="py-1">
                        {menu.children.map((subMenu) => (
                          <Link
                            key={subMenu.id}
                            to={subMenu.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-colors"
                          >
                            <i className={`${subMenu.icon} mr-2`}></i>{subMenu.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
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

          {/* Menu Utilisateur Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <div className="relative">
              <Link to="/notifications">
                <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                  <i className="fas fa-bell text-lg"></i>
                  <NotificationCounter />
                </button>
              </Link>
            </div>

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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    <div className="font-medium">{getUserFirstName()}</div>
                    <div className="text-xs text-gray-400">{adminUser.email}</div>
                  </div>
                  {NAVIGATION_MENUS.USER.map((userMenu) => (
                    <Link
                      key={userMenu.id}
                      to={userMenu.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-colors"
                    >
                      <i className={`${userMenu.icon} mr-2`}></i>{userMenu.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            <Link to="/notifications">
              <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                <i className="fas fa-bell"></i>
                <NotificationCounter />
              </button>
            </Link>

            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200"
            >
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">{getUserInitials()}</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {getUserFirstName()}
              </span>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-fuchsia-600 focus:outline-none p-2"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-base sm:text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Utilisateur Mobile */}
      {userMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 py-2 space-y-1">
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
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md transition-colors"
              >
                <i className={`${userMenu.icon} mr-2`}></i>{userMenu.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* Menu Mobile Principal */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200">
          <div className="px-2 py-2 space-y-1">
            {mainMenus.map((menu) => (
              <div key={menu.id}>
                {menu.children ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(menu.id)}
                      className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md transition-colors ${
                        isActiveLink(menu.path)
                          ? 'text-fuchsia-600 bg-fuchsia-50'
                          : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
                      }`}
                    >
                      <span>
                        <i className={`${menu.icon} mr-2`}></i>{menu.label}
                      </span>
                      <i className={`fas fa-chevron-down text-xs transform transition-transform ${
                        openSubmenus[menu.id] ? 'rotate-180' : ''
                      }`}></i>
                    </button>

                    {openSubmenus[menu.id] && (
                      <div className="ml-4 space-y-1">
                        {menu.children.map((subMenu) => (
                          <Link
                            key={subMenu.id}
                            to={subMenu.path}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md transition-colors"
                          >
                            <i className={`${subMenu.icon} mr-2`}></i>{subMenu.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={menu.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
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
      )}
    </header>
  );
};

export default Header;
