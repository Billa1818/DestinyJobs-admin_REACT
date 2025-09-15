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
            <p className="text-gray-400 mb-6">
              La plateforme de référence pour trouver des emplois, bourses et financements au Bénin et en Afrique de l'Ouest.
            </p>
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
                <a href="/jobs" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-briefcase mr-2"></i>
                  Emplois
                </a>
              </li>
              <li>
                <a href="/bourses" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Bourses d'études
                </a>
              </li>
              <li>
                <a href="/financements" className="text-gray-400 hover:text-white transition duration-200">
                  <i className="fas fa-money-bill-wave mr-2"></i>
                  Financements
                </a>
              </li>
              <li>
                <a href="/consultations" className="text-gray-400 hover:text-white transition duration-200">
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



          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-fuchsia-400 mr-3"></i>
                <span className="text-gray-400">
                  Zone 4, Cotonou<br />
                  Bénin
                </span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-fuchsia-400 mr-3"></i>
                <span className="text-gray-400">+229 21 30 45 67</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-fuchsia-400 mr-3"></i>
                <span className="text-gray-400">contact@destinyjobs.bj</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock text-fuchsia-400 mr-3"></i>
                <span className="text-gray-400">
                  Lun-Ven: 8h-18h<br />
                  Sam: 9h-13h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Restez informé</h3>
            <p className="text-gray-400 mb-4">
              Recevez nos dernières offres et actualités par email
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
                <i className="fas fa-paper-plane mr-2"></i>
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Destiny Jobs. Tous droits réservés.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/termes" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Conditions d'utilisation
              </a>
              <a href="/politique-confidentialite" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Politique de confidentialité
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 