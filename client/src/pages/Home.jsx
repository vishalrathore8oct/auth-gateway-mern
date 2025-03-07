export default function Home() {
  return (
    <div className="min-h-[94vh] flex flex-col items-center justify-center bg-gray-100">
      <header className="w-full bg-blue-600 text-white text-center p-4 text-2xl font-bold">
        My Home Page
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to My Website</h1>
        <p className="text-gray-600 text-lg text-center max-w-xl">
          This is a simple home page built with React and Tailwind CSS.
        </p>
        <div className="mt-6 text-center max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800">About Our Auth App</h2>
          <p className="text-gray-600 mt-2">
            Our authentication system is built using the MERN stack, featuring secure user authentication with JWT tokens, OAuth integration, and password recovery options.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            <li>JWT-based authentication for secure access</li>
            <li>OAuth support for social logins</li>
            <li>Forgot password and reset password functionality</li>
            <li>Secure user data handling and session management</li>
          </ul>
        </div>
      </main>
      <footer className="w-full bg-gray-800 text-white text-center p-4 mt-auto">
        &copy; 2025 My Website. All rights reserved.
      </footer>
    </div>
  );
}
