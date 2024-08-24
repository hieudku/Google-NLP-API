import React, { useEffect, useState } from 'react';
import './Feed.css';
import defaultImage from '../../Resouces/header-news.png';

interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

const Feed: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<string>('general');
    const [country, setCountry] = useState<string>('nz');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch from Newsdata.io using the query parameter
                const response = await fetch(
                    `https://newsdata.io/api/1/news?apikey=${process.env.REACT_APP_NEWS_API_KEY}&q=${category}&country=${country}&language=en`
                );console.log(category+ '-'+country);
                const data = await response.json();

                if (data.status === 'success') {
                    const formattedArticles = data.results.map((article: any) => ({
                        source: { id: null, name: article.source_id },
                        author: article.creator ? article.creator.join(', ') : 'Unknown Author',
                        title: article.title,
                        description: article.description || 'No description available.',
                        url: article.link,
                        urlToImage: article.image_url || defaultImage,
                        publishedAt: article.pubDate,
                        content: article.content || 'No content available.',
                    }));
                    setArticles(formattedArticles);
                } else {
                    setError('Failed to fetch news.');
                }
            } catch (error) {
                setError('An error occurred while fetching the news.');
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [category, country]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className="title">Latest News</h1>
            <div className="controls">
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="nz">New Zealand</option>
                    <option value="au">Australia</option>
                    <option value="us">United States</option>
                </select>
            </div>
            <ul className="menu">
                <li className={category === 'genenal' ? 'active' : 'inactive'} onClick={() => setCategory('general')}>
                    General
                </li>
                <li className={category === 'sport' ? 'active' : 'inactive'} onClick={() => setCategory('sport')}>
                    Sport
                </li>
                <li className={category === 'business' ? 'active' : 'inactive'} onClick={() => setCategory('business')}>
                    Business
                </li>
                <li className={category === 'technology' ? 'active' : 'inactive'} onClick={() => setCategory('technology')}>
                    Technology
                </li>
                <li className={category === 'health' ? 'active' : 'inactive'} onClick={() => setCategory('health')}>
                    Health
                </li>
                <li className={category === 'science' ? 'active' : 'inactive'} onClick={() => setCategory('science')}>
                    Science
                </li>
                <li className={category === 'entertainment' ? 'active' : 'inactive'} onClick={() => setCategory('entertainment')}>
                    Entertainment
                </li>
                <li className={category === 'politics' ? 'active' : 'inactive'} onClick={() => setCategory('politics')}>
                    Politics
                </li>
                <li className={category === 'world' ? 'active' : 'inactive'} onClick={() => setCategory('world')}>
                    World
                </li>
                <li className={category === 'travel' ? 'active' : 'inactive'} onClick={() => setCategory('travel')}>
                    Travel
                </li>
                <li className={category === 'food' ? 'active' : 'inactive'} onClick={() => setCategory('food')}>
                    Food
                </li>
            </ul>
            <div className="news-grid">
                {articles.map((article, index) => (
                    <a
                        key={index}
                        href={article.url}
                        className="article"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="article-image">
                            <img src={article.urlToImage || defaultImage} alt={article.title} />
                        </div>
                        <div className="article-content">
                            <h2>{article.title}</h2>
                            <p>{article.description}</p>
                            <div className="article-source">
                                <span>{article.author}</span>
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Feed;
