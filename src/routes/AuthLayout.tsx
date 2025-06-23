import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <h2 className="text-2xl font-bold">Grow Your Brand</h2>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-4">
              <p className="text-lg">
                “This dashboard has revolutionized how we manage our blog content and user data.”
              </p>
              <footer className="mr-4 text-right text-sm">- Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
