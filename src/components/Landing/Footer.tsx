import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { FaMediumM } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="dark:bg-black mt-10 border dark:border-t-white border-t-black dark:text-white py-6">
      <div className="container mx-auto flex justify-center space-x-4">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaXTwitter size={24} />
        </a>
        <a href="https://medium.com" target="_blank" rel="noopener noreferrer">
          <FaMediumM size={24} />
        </a>
      </div>
      <p className="mt-4 text-center text-sm">
        &copy; 2025 RepoX. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;