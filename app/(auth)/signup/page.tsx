import React from "react";

// import SignupForm from "../../../components/othercomponents/Signup";

function page() {
  return (
    <main className="flex justify-center items-center md:p-10 p-5">
      <p className="text-xl font-bold text-center">
        You are not allowed to access this page
      </p>
      {/* <div className="h-fit max-h-[50rem] w-full max-w-[30rem] overflow-hidden bg-accent p-5">
        <p className="text-center text-xl md:text-2xl font-bold">
          Create an account
        </p>
        <div className="mt-5">
          <SignupForm />
          <p className="text-center my-3">Or</p>

          <p className="text-center my-3">
            Already have an account?{" "}
            <a href="/login" className="text-primary">
              Login
            </a>
          </p>
        </div>
      </div> */}
    </main>
  );
}

export default page;
