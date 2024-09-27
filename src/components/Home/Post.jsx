import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faEye, faComment, faBitcoinSign } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Post({ post }) {
   return (
      <div className='post-card'>
         <div className='post-header'>
            <div className='btc-info'>
               <FontAwesomeIcon icon={faBitcoinSign} className='btc-logo' />
               <span className='btc-price'>${post.btcPrice.toLocaleString()}</span>
               <span className={`btc-change ${post.btcChange.startsWith("+") ? "positive" : "negative"}`}>{post.btcChange}</span>
            </div>
            <div className='post-title'>
               <h3>{post.title}</h3>
            </div>
         </div>
         <div className='post-body'>
            <div className='post-tags'>
               {post.tags.map((tag) => (
                  <span key={tag} className='tag'>
                     #{tag}
                  </span>
               ))}
            </div>
            <div className='post-author'>
               <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`} alt={post.author} className='author-avatar' />
               <div className='author-info'>
                  <span className='author-name'>{post.author}</span>
                  <span className='post-time'>{post.time}</span>
               </div>
            </div>
         </div>
         <div className='post-footer'>
            <div className='post-stat'>
               <FontAwesomeIcon icon={faEye} />
               <span>{post.views.toLocaleString()}</span>
            </div>
            <div className='post-stat'>
               <FontAwesomeIcon icon={faHeart} />
               <span>{post.likes.toLocaleString()}</span>
            </div>
            <div className='post-stat'>
               <FontAwesomeIcon icon={faComment} />
               <span>{post.comments.toLocaleString()}</span>
            </div>
         </div>
      </div>
   );
}

Post.propTypes = {
   post: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string).isRequired,
      views: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
      btcPrice: PropTypes.number.isRequired,
      btcChange: PropTypes.string.isRequired,
   }).isRequired,
};

export default Post;
