import React from "react";

interface RedditPostProps {
    post: any;  // Adjust the type based on your API response structure
}

const RedditPost: React.FC<RedditPostProps> = ({ post }) => {
    return (
        <li>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
                {post.title}
            </a>
            <p>{post.selftext}</p>  {/* Display the content of the post */}
        </li>
    );
};

export default RedditPost;
