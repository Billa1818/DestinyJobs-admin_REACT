import React, { useState, useEffect } from 'react';
import RecruteurNotificationService from '../services/notificationService';

const NotificationCounter = () => {
  console.log('🚀 DEBUG - NotificationCounter composant monté');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Charger le compteur de notifications non lues
  const loadUnreadCount = async () => {
    try {
      console.log('🔍 DEBUG - Chargement du compteur de notifications...');
      const stats = await RecruteurNotificationService.getNotificationStats();
      console.log('📊 DEBUG - Stats reçues pour le compteur (brutes):', stats);
      console.log('📊 DEBUG - Type de stats:', typeof stats);
      console.log('📊 DEBUG - Clés de stats:', Object.keys(stats || {}));
      
      // Essayer différentes structures possibles
      let count = 0;
      if (stats && typeof stats === 'object') {
        count = stats.unread_count || stats.unreadCount || stats.unread || 0;
      }
      
      console.log('🔢 DEBUG - Nombre de notifications non lues extrait:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Erreur lors du chargement du compteur de notifications:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Charger le compteur au montage du composant
  useEffect(() => {
    loadUnreadCount();
  }, []);

  // Mettre à jour le compteur toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Debug: afficher toujours le composant pour voir les valeurs
  console.log('🎯 DEBUG - NotificationCounter rendu avec:', { unreadCount, loading });
  
  // Si pas de notifications non lues, ne rien afficher
  if (unreadCount === 0) {
    console.log('🚫 DEBUG - Aucune notification non lue, composant masqué');
    return null;
  }

  console.log('✅ DEBUG - Affichage du compteur avec:', unreadCount);
  return (
    <div className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold z-10">
      {unreadCount > 99 ? '99+' : unreadCount}
    </div>
  );
};

export default NotificationCounter; 