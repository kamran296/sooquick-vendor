import React from 'react';
import RootLayout from '../../layouts/landing/RootLayout';
import HomeHero from '../../components/landing/HomeHero';
import {
  ComboServices,
  ComingServices,
  EssentialServices,
  ServiceCategories,
} from '../../components/landing/HomeServices';
import VideosAndBlogs from '../../components/landing/VideosAndBlogs';
import MobileApp from '../../components/landing/MobileApp';

const Home = () => {
  return (
    <RootLayout>
      <HomeHero />
      <ServiceCategories />
      <EssentialServices />
      <ComboServices />
      <ComingServices />
      <VideosAndBlogs />
      <MobileApp />
    </RootLayout>
  );
};

export default Home;
