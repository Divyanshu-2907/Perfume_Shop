import React from 'react';
import FragranceFinder from '../components/FragranceFinder';
import '../styles/FragranceFinderPage.css';

const FragranceFinderPage = () => {
  return (
    <div className="fragrance-finder-page">
      <div className="page-header">
        <h1>Find Your Perfect Fragrance</h1>
        <p>Take our quick quiz to discover perfumes that match your preferences</p>
      </div>
      <FragranceFinder />
    </div>
  );
};

export default FragranceFinderPage; 