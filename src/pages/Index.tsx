import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import UserTypes from '@/components/UserTypes';
import Footer from '@/components/Footer';
import PawPatternBackground from '@/components/ui/PawPatternBackground';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona veterinários e admins para o dashboard
    if (user && (user.role === 'vet' || user.role === 'admin')) {
      navigate('/dashboard-admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <UserTypes />
      </main>
      <Footer />
    </div>
  );
};

export default Index;