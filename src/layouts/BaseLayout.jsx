import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BaseLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
