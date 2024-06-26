import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow"
import toast from "react-hot-toast";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const {username} = useParams(); // getting this 'username' from the App.jsx

	const {follow, isPending} = useFollow();

	const queryClient = useQueryClient();

	// getting the authUser from Query
	const {data: authUser} = useQuery({queryKey: ["authUser"]})


    // // created a dummy User
	// const user = {
	// 	_id: "1",
	// 	fullName: "John Doe",
	// 	username: "johndoe",
	// 	profileImg: "/avatars/boy2.png",
	// 	coverImg: "/cover.png",
	// 	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	// 	link: "https://youtube.com/@asaprogrammer_",
	// 	following: ["1", "2", "3"],
	// 	followers: ["1", "2", "3"],
	// };
	
	const { data: user, isLoading, refetch, isRefetching } = useQuery({ //fetching the User profile using Query
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
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

	//creting mutation function to update the Profile
	const {mutate: updateProfile , isPending:isUpdatingProfile} = useMutation({
		mutationFn: async () =>{
			try {
				const res = await fetch(`/api/users/update`, {
					method: "POST",
					headers: {
						"Content-Type" : "application/json",
					},
					body: JSON.stringify({
						//these 2 things which the user will update
						coverImg,
						profileImg
					}),
				})
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error.message)
				
			}
		},
		onSuccess: () =>{
			toast.success("Profile updated successfully")
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"]}),
				queryClient.invalidateQueries({ queryKey: ["userProfile"]}),
			])
		},
		onError: (error) =>{
			toast.error(error.message)
		}
	})

	const isMyProfile = authUser._id === user?._id;
    //getting the DATE when the user has been created
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);

	//This the way we can check weither we are Following the user or not
	const amIFollowing = authUser?.following.includes(user?._id);

    // created a function to ADD or UPDATE the Profile or cover image
	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// we need to refacth whenever the user is changed
	useEffect(() => {
		refetch() //refacth whenevr the username changes
	}, [username, refetch]) 

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />} {/* show the skeleton when it's Loading or refatching */}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
                            {/* TOP section : contains back icon <-- , UserName , no. of post */}
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' /> {/* <-- Icon : is created and linked it to the Home page */}
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span> {/* Shows no. of post */}
								</div>
							</div>

							{/* COVER IMG */}
							<div className='relative group/cover'>
                            
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
                                {/* only the user to whome the account belong can change or update the cover umage that's why it's given "isMyProfile" */}
								{isMyProfile && (
                                    // Onclick gives the option to use image from pc
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
                                    accept="image/*"
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
                                    accept="image/*"
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className='flex justify-end px-4 mt-5'>
                                {/* Added the Edit Profile Model , only the user to whom the account belong can make chages to it's user details */}
								{isMyProfile && <EditProfileModal authUser={authUser} />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm'
										onClick={() => follow(user?._id)} // passing the user._id so as to follow or unfollow whom we want
									>
										{isPending && "Loading..."}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={() => updateProfile()}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href='https://youtube.com/@asaprogrammer_'
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													youtube.com/@asaprogrammer_
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate} </span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} username={username} userId={user?._id}/>
				</div>
			</div>
		</>
	);
};
export default ProfilePage;