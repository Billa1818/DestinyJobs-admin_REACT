import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 mr-3" />
              <span className="text-xl font-bold">Destiny Jobs</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Opportunités */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opportunités</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.destinyjobs.net/jobs" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-briefcase mr-2"></i>
                  Emplois
                </a>
              </li>
              <li>
                <a href="https://www.destinyjobs.net/bourses" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Bourses d'études
                </a>
              </li>
              <li>
                <a href="https://www.destinyjobs.net/financements" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-money-bill-wave mr-2"></i>
                  Financements
                </a>
              </li>
              <li>
                <a href="https://www.destinyjobs.net/consultations" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-handshake mr-2"></i>
                  Consultations
                </a>
              </li>
              <li>
                <a href="/formations" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-chalkboard-teacher mr-2"></i>
                  Formations
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2026 Destiny Jobs. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 