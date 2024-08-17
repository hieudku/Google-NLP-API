import React, { useState } from 'react';
import './Dashboard.css';
import SentimentAnalysis from './SentimentAnalysis';
import EntityAnalysis from './EntityAnalysis';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sentiment' | 'entities'>('sentiment');

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Text Analysis Dashboard</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab('sentiment')} className={activeTab === 'sentiment' ? 'active' : ''}>
                    Sentiment Analysis
                </button>
                <button onClick={() => setActiveTab('entities')} className={activeTab === 'entities' ? 'active' : ''}>
                    Entity Analysis
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'sentiment' && <SentimentAnalysis />}
                {activeTab === 'entities' && <EntityAnalysis />}
            </div>
        </div>
    );
};

export default Dashboard;
