const Dashboard=()=>{
    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-8">Welcome to your dashboard. Here you can manage your content and settings.</p>
        <a href="/" className="text-blue-500 hover:underline">
            Go back to Home
        </a>
    </div>
    );
};
export default Dashboard