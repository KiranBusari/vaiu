"use client";

const CheckEmailPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-black">
          Check your email
        </h1>
        <p className="text-center text-gray-600">
          A magic link has been sent to your email address. Please click the
          link to log in.
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
