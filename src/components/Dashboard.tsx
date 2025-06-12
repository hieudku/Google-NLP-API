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
import DecryptedText from './Misc/DecryptedText';

const Dashboard: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'sentiment' | 'entities' | 'syntax' | 'entitiesSentiment' | 'entitiesSentimentSentence'>('sentiment');
    const keepTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    }
    return (

        <div className="dashboard">
            <h1 className="dashboard-title">
                <DecryptedText
                    text="Enter/paste text to analyze"
                    encryptedClassName='encrypted'
                    speed={150}
                    sequential={true}
                    className="revealed"
                    animateOn="view"
                />
                </h1>

            <div className="info-box">
                <DecryptedText
                    text="Note:"
                    className="decrypted-note-title"
                    animateOn="view"
                />
                <br />
                <DecryptedText
                    text="Please enter up to 1000 characters of text."
                    speed={120}
                    sequential={true}
                    animateOn="view"
                    className="decrypted-note"
                />
                <br />
                <DecryptedText
                    text="Avoid pasting large documents or code."
                    speed={120}
                    sequential={true}
                    animateOn="view"
                    className="decrypted-note"
                />
                <br />
                <DecryptedText
                    text="Wait 60 seconds before analyzing again to avoid throttling."
                    speed={100}
                    sequential={true}
                    animateOn="view"
                    className="decrypted-note"
                />
</div>
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
