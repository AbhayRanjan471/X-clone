// Created a LoadingSpinner function to use it in our project
// by default the size is given "md" : medium
const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;
    // imported form Daisy UI : https://daisyui.com/components/loading/
	return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;