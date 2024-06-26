import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

// React Icon which we have used here
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {toast} from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient(); //The useQuery hook is used to fetch and cache data,  useMutation for creating, updating, or deleting data, and useQueryClient provides methods to control and interact with the cache.
	
	// https://tanstack.com/query/latest/docs/framework/react/guides/mutations
	// Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, TanStack Query exports a useMutation hook.
	// here mutate : is renamed as loginMutation
	const {mutate: loginMutation, isError, isPending, error} = useMutation({
		mutationFn: async({username, password}) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type" :"application/json",
					},
					body: JSON.stringify({username, password}),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			// toast.success("Login successfull")
			// refetch the authUser query to update the UI
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				{/* It's the Twitter Logo (X) */}
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
                    {/* 1st Label: USERNAME */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail /> {/* icon */}
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

                    {/* 2nd Label: PASSWORD */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword /> {/* icon */}
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
                    {/* LOGIN button */}
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Loading..." : "Login"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
                    {/* If we click on this Sign Up button it will take us to the SignUp Page */}
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;