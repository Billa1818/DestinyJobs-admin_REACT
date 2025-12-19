import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../routers';
import Loader from '../../../components/Loader';

const OffersIndex = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const offerTypes = [
    {
      id: 'job-offers',
      title: 'Offres d\'emploi',
      description: 'Gérez les offres d\'emploi publiées sur la plateforme',
      icon: 'fas fa-file-invoice',
      color: 'from-blue-500 to-blue-600',
      path: ROUTES.ADMIN.OFFERS.JOB_OFFERS.LIST,
      count: 'Voir les offres'
    },
    {
      id: 'consultation-offers',
      title: 'Offres de consultation',
      description: 'Gérez les offres de services de consultation',
      icon: 'fas fa-comments',
      color: 'from-purple-500 to-purple-600',
      path: ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.LIST,
      count: 'Voir les offres'
    },
    {
      id: 'funding-offers',
      title: 'Offres de financement',
      description: 'Gérez les offres de financement et subventions',
      icon: 'fas fa-dollar-sign',
      color: 'from-green-500 to-green-600',
      path: ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.LIST,
      count: 'Voir les offres'
    },
    {
      id: 'scholarships',
      title: 'Bourses d\'étude',
      description: 'Gérez les annonces de bourses d\'étude',
      icon: 'fas fa-graduation-cap',
      color: 'from-orange-500 to-orange-600',
      path: ROUTES.ADMIN.OFFERS.SCHOLARSHIPS.LIST,
      count: 'Voir les offres'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gestion des Offres
          </h1>
          <p className="text-lg text-gray-600">
            Gérez tous les types d'offres disponibles sur la plateforme
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerTypes.map((offer) => (
            <div
              key={offer.id}
              onMouseEnter={() => setHoveredCard(offer.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(offer.path)}
              className="h-64 cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className={`h-full bg-gradient-to-br ${offer.color} rounded-lg shadow-lg hover:shadow-2xl p-6 flex flex-col justify-between text-white`}>
                {/* Icon */}
                <div className="text-5xl opacity-80 mb-4">
                  <i className={offer.icon}></i>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-sm opacity-90">{offer.description}</p>
                </div>

                {/* Button */}
                <div className={`mt-4 pt-4 border-t border-white border-opacity-30 transform transition-transform duration-300 ${
                  hoveredCard === offer.id ? 'translate-x-2' : ''
                }`}>
                  <span className="text-sm font-semibold flex items-center">
                    {offer.count}
                    <i className="fas fa-arrow-right ml-2"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Offres d'emploi</p>
                <p className="text-xs text-gray-500">Actives</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Consultations</p>
                <p className="text-xs text-gray-500">Actives</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Financements</p>
                <p className="text-xs text-gray-500">Actifs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Bourses</p>
                <p className="text-xs text-gray-500">Actives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersIndex;
