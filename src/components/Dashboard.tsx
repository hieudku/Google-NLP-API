import React, { useState } from 'react';
import './Dashboard.css';
import SentimentAnalysis from './SentimentAnalysis';
import EntityAnalysis from './EntityAnalysis';
import SyntacticAnalysis from './SyntacticAnalysis';
import EntitySentimentAnalysis from './EntitySentimentAnalysis';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sentiment' | 'entities' | 'syntax' | 'entitiesSentiment'>('sentiment');

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Enter/paste text to analyze</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab('sentiment')} className={activeTab === 'sentiment' ? 'active' : ''}>
                    Sentiment Analysis
                </button>
                <button onClick={() => setActiveTab('entities')} className={activeTab === 'entities' ? 'active' : ''}>
                    Entity Analysis
                </button>
                <button onClick={() => setActiveTab('syntax')} className={activeTab === 'syntax' ? 'active' : ''}>
                    Syntactic Analysis
                </button>
                <button onClick={() => setActiveTab('entitiesSentiment')} className={activeTab === 'entitiesSentiment' ? 'active' : ''}>
                    Entity Sentiment
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'sentiment' && <SentimentAnalysis />}
                {activeTab === 'entities' && <EntityAnalysis />}
                {activeTab === 'syntax' && <SyntacticAnalysis />}
                {activeTab === 'entitiesSentiment' && <EntitySentimentAnalysis />}
            </div>
        </div>
    );
};

export default Dashboard;
