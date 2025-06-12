import React from 'react';
import './Dashboard.css';
import DecryptedText from './Misc/DecryptedText';

const SentimentExplanation: React.FC = () => {
    return (
        <div className="sentiment-info">
  <DecryptedText
    text="Results note:"
    animateOn="view"
    sequential
    speed={100}
  />
  <br />
  <ul>
    <li>
      <strong>
        <DecryptedText
          text="Sentiment Score:"
          animateOn="view"
          sequential
          speed={100}
        />
      </strong>{' '}
      <DecryptedText
        text="Ranges from -1.0 (negative-red) to 1.0 (positive-green). A score of 0 indicates neutral-grey sentiment."
        animateOn="view"
        sequential
        speed={100}
      />
    </li>
    <li>
      <strong>
        <DecryptedText
          text="Sentiment Magnitude:"
          animateOn="view"
          sequential
          speed={100}
        />
      </strong>{' '}
      <DecryptedText
        text="The strength of the sentiment. Higher magnitude means stronger emotional content in the text. Scaling: Low: 0.1-2, Medium: 2-5, High: 5 and above."
        animateOn="view"
        sequential
        speed={100}
      />
    </li>
  </ul>
</div>
    );
};

export default SentimentExplanation;