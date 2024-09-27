import Post from "./Post";

function PostList() {
   // Sample data - in a real application, this would likely come from props or a data fetching hook
   const posts = [
      {
         id: 1,
         title: "Blockchain developer best practices on innovationchain",
         author: "Pavel Gvay",
         time: "3 weeks ago",
         tags: ["finance", "bitcoin", "crypto"],
         views: 651324,
         likes: 36545,
         comments: 56,
         btcPrice: 20788,
         btcChange: "+0.25%",
      },
      {
         id: 2,
         title: "The future of decentralized finance",
         author: "Sarah Johnson",
         time: "2 days ago",
         tags: ["defi", "ethereum", "finance"],
         views: 123456,
         likes: 7890,
         comments: 234,
         btcPrice: 21000,
         btcChange: "-0.5%",
      },
      // Add more sample posts as needed
   ];

   return (
      <div className='post-list'>
         {posts.map((post) => (
            <Post key={post.id} post={post} />
         ))}
      </div>
   );
}

export default PostList;
