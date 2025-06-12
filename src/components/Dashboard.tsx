import React, { useState } from 'react';
import './Dashboard.css';
import SentimentAnalysis from './SentimentAnalysis';
import EntityAnalysis from './EntityAnalysis';
import SyntacticAnalysis from './SyntacticAnalysis';
import EntitySentimentAnalysis from './EntitySentimentAnalysis';
import EntitySentimentAnalysisSentences from './ESAnalysisSentences';
import Button from '@mui/material/Button';
import Hyperspeed from './Misc/Hyperspeed';
import Particles from './Misc/Particles';

const Dashboard: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'sentiment' | 'entities' | 'syntax' | 'entitiesSentiment' | 'entitiesSentimentSentence'>('sentiment');
    const keepTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }
    return (

        <div className="dashboard">
            <h1 className="dashboard-title">Enter/paste text to analyze</h1>
            <p className="info-box">
                <strong>Note:</strong><br/>
                Please enter up to <strong>1000 characters</strong> of text.<br />
                Avoid pasting large documents or code.<br />
                You can analyze again after <strong>60 seconds</strong> to avoid throttling.
            </p>
            <div className="tabs">
                <Button variant='contained'  onClick={() => setActiveTab('sentiment')} className={activeTab === 'sentiment' ? 'active' : ''}>
                    Sentiment
                </Button>
                <Button variant='contained' onClick={() => setActiveTab('entities')} className={activeTab === 'entities' ? 'active' : ''}>
                    Entity
                </Button>
                <Button variant='contained' onClick={() => setActiveTab('syntax')} className={activeTab === 'syntax' ? 'active' : ''}>
                    Syntactic
                </Button>
                <Button variant='contained' onClick={() => setActiveTab('entitiesSentiment')} className={activeTab === 'entitiesSentiment' ? 'active' : ''}>
                    Tokens
                </Button>
                <Button variant='contained' onClick={() => setActiveTab('entitiesSentimentSentence')} className={activeTab === 'entitiesSentimentSentence' ? 'active' : ''}>
                    Sentences
                </Button>
            </div>
            <div className="tab-content">
                {activeTab === 'sentiment' && <SentimentAnalysis text={text} onChange={keepTextChange}/>}
                {activeTab === 'entities' && <EntityAnalysis text={text} onChange={keepTextChange}/>}
                {activeTab === 'syntax' && <SyntacticAnalysis text={text} onChange={keepTextChange}/>}
                {activeTab === 'entitiesSentiment' && <EntitySentimentAnalysis text={text} onChange={keepTextChange}/>}
                {activeTab === 'entitiesSentimentSentence' && <EntitySentimentAnalysisSentences text={text} onChange={keepTextChange}/>}
            </div>
            
        </div>
    );
};

export default Dashboard;
