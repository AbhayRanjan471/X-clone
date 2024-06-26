import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

//https://react-icons.github.io/react-icons/
//imported the react icon which we have used
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
    //Form data
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	// https://tanstack.com/query/latest/docs/framework/react/guides/mutations
	// Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, TanStack Query exports a useMutation hook.
	//instaed of creating all these functionality like(Loading ,setLoading , error, seterror ) using the "useState" we are directly using the React query
	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

		
				const data = await res.json();
				// if(!res.ok) throw new Error(data.error);
				// if(data.error) throw new Error(data.error);
				                      //OR
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				// toast.error(error.message);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
		}

		// 	{
		// 		/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
		// 	}
		// 	queryClient.invalidateQueries({ queryKey: ["authUser"] });
		// },
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // using that so that page don't reload
		// console.log(formData);
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    {/* Took the code from daisyUI :- https://daisyui.com/components/input/ */}
                    {/* 1st Lable : EMAIL */}
					<label className='input input-bordered rounded flex items-center gap-2'>
                        
						<MdOutlineMail /> {/* It's the React icon which we have imported from recat icon */}
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
                    {/* build the 2nd and 3rd Label under <div> tag to make it flexible */}
					<div className='flex gap-4 flex-wrap'>
                        {/* 2nd Label: USERNAME */}
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser /> {/* icon */}
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
                        {/* 3rd Label: FULLNAME */}
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline /> {/* icon */}
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
                    {/* 4th Label: PASSWORD */}
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
                    {/* SignUp button */}
					<button className='btn rounded-full btn-primary text-white'>{isPending ? "Loading..." : "Sign up"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
                    {/* If we click on this SignIn button it will take us to the Login Page */}
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;