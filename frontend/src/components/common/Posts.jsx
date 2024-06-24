import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";

const Posts = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
          {/* 3 Number of Post will be shown at one time */}
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
          
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
          {/* adding the dummy data to the post */}
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;