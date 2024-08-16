import React, { useEffect, useState } from 'react';
import './Feed.css';

interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

const Feed:React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<string>('general');

    useEffect(() => {
         const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/top-headlines?`+`country=us&`+`category=${category}&apiKey=76fda4ae21f64c0fb0175cd414e6d749`
                );
                const data = await response.json();
                console.log(data);
                if (data.status == 'ok') {
                    setArticles(data.articles);
                }
                else {
                    setError('Failed to fetch news');
                }
            }
            catch (error) {
                setError('Error occured while fetching the news.');
            }
            finally {
                setLoading(false);
            }
         };

         fetchNews();
    }, [category]);

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div>
            <h1 className="title">News Feed</h1>
            <ul className="menu">
                <li
                    className={category === 'general' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('general')}
                >
                    General
                </li>
                <li
                    className={category === 'business' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('business')}
                >
                    Business
                </li>
                <li
                    className={category === 'entertainment' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('entertainment')}
                >
                    Entertainment
                </li>
                <li
                    className={category === 'health' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('health')}
                >
                    Health
                </li>
                <li
                    className={category === 'science' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('science')}
                >
                    Science
                </li>
                <li
                    className={category === 'sports' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('sports')}
                >
                    Sports
                </li>
                <li
                    className={category === 'technology' ? 'active' : 'inactive'}
                    onClick={() => handleCategoryChange('technology')}
                >
                    Technology
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
                        {article.urlToImage && (
                            <div className="article-image">
                                <img src={article.urlToImage} alt={article.title} />
                            </div>
                        )}
                        <div className="article-content">
                            <h2>{article.title}</h2>
                            <p>{article.description}</p>
                            <div className="article-source">
                                <span>{article.source.name}</span>
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