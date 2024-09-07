import React from "react";
import RedditPost from "./RedditPost";

interface SearchResultsProps {
    results: any[];  // Adjust the type based on your API response structure
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    return (
        <div>
            <h2>Search Results</h2>
            <ul>
                {results.map((result, index) => (
                    <RedditPost key={index} post={result} />
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;
