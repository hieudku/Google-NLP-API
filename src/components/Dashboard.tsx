import React, { useState } from 'react';
import './Dashboard.css';
import SentimentAnalysis from './SentimentAnalysis';
import EntityAnalysis from './EntityAnalysis';
import SyntacticAnalysis from './SyntacticAnalysis';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sentiment' | 'entities' | 'syntax'>('sentiment');

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
            </div>
            <div className="tab-content">
                {activeTab === 'sentiment' && <SentimentAnalysis />}
                {activeTab === 'entities' && <EntityAnalysis />}
                {activeTab === 'syntax' && <SyntacticAnalysis />}
            </div>
        </div>
    );
};

export default Dashboard;
