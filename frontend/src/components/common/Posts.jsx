import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType }) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	//To fetch POST 
	// refatch & isRefetching : we need to refatch when we switch betwen follow and following button on the screen so we are using it
	const {data: posts, isLoading, refetch, isRefetching,} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	// whenever we will change the feed (from follow to following or vice-versa) we need to call the refatch() funciton
	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	return (
		<>
		{/* If it's Loading or Refatching we will show the sketaton */}
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
          
				</div>
			)}

			{/* else : show the data */}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
                  {/* adding the dummy data to the post */}
					{/* {POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))} */}

					{/* adding the real data to the post */}
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;