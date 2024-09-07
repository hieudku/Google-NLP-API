import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import axios from "axios";

const SearchPage: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async (term: string) => {
        try {
            const accessToken = "your-access-token";  // Obtain this securely
            const response = await axios.get(`https://oauth.reddit.com/search?q=${term}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "User-Agent": "ContentAnalysisApp/0.1 by sriracha0811",
                },
            });
            setResults(response.data.data.children.map((child: any) => child.data));
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div>
            <h1>Search Reddit</h1>
            <SearchBar onSearch={handleSearch} />
            <SearchResults results={results} />
        </div>
    );
};

export default SearchPage;
