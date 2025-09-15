import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, profileService, sessionService, tokenService } from '../services'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialiser l'état d'authentification au chargement
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser()
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser)
          // Configurer le rafraîchissement automatique du token
          tokenService.setupAutoRefresh()
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error)
        // Nettoyer le stockage si corrompu
        authService.logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Connexion
  const login = async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      
      const response = await authService.login(credentials)
      setUser(response.user)
      
      // Configurer le rafraîchissement automatique du token
      tokenService.setupAutoRefresh()
      
      return response
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Forcer la déconnexion même en cas d'erreur
      setUser(null)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Mise à jour du profil
  const updateProfile = async (profileData) => {
    try {
      setError(null)
      setLoading(true)
      
      const updatedProfile = await profileService.updateProfile(profileData)
      setUser(updatedProfile)
      
      return updatedProfile
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Changement de mot de passe
  const changePassword = async (passwordData) => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await profileService.changePassword(passwordData)
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Demande de récupération de mot de passe
  const requestPasswordReset = async (resetData) => {
    try {
      setError(null)
      setLoading(true)
      
      await authService.requestPasswordReset(resetData)
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Gestion des sessions
  const getSessions = async () => {
    try {
      setError(null)
      return await sessionService.getSessions()
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logoutAllSessions = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await sessionService.logoutAllSessions()
      
      // Si la session actuelle est invalidée, l'état sera mis à jour automatiquement
      if (result.force_logout) {
        setUser(null)
      }
      
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const invalidateSession = async (sessionId) => {
    try {
      setError(null)
      return await sessionService.invalidateSession(sessionId)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const forceLogout = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const result = await sessionService.forceLogout()
      
      if (result.force_logout) {
        setUser(null)
      }
      
      return result
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && (user.user_type === 'ADMIN' || user.is_staff === true)
  }

  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return !!user && authService.isAuthenticated()
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    getSessions,
    logoutAllSessions,
    invalidateSession,
    forceLogout,
    isAdmin,
    isAuthenticated,
    clearError: () => setError(null),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 