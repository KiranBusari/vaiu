import React from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';
import { Logo } from "../Logo";


const Footer = () => {
  return (
    <footer className="dark:bg-black dark:text-white py-10">
      <div className="container max-w-7xl mx-auto px-4 pl-40 flex flex-col md:flex-row justify-between items-stretch">
        <div className="flex flex-col space-y-4 mb-8 md:mb-0 w-full md:w-1/4">
          <h3 className="text-xl font-semibold text-blue-500">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition duration-300">About Us</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Our Services</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Affiliate Program</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 mb-8 md:mb-0 w-full md:w-1/4">
          <h3 className="text-xl font-semibold text-blue-500">Get Help</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition duration-300">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Shipping</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Returns</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Order Status</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Payment Options</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 mb-8 md:mb-0 w-full md:w-1/4">
          <h3 className="text-xl font-semibold text-blue-500">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Blog</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Guides</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-500 transition duration-300">Community</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 w-full md:w-1/4">
          <h3 className="text-xl font-semibold text-blue-500">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 transform hover:scale-110">
              <FaFacebookF size={28} className="text-blue-500 hover:text-blue-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 transform hover:scale-110">
              <FaTwitter size={28} className="text-blue-500 hover:text-blue-300" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 transform hover:scale-110">
              <FaInstagram size={28} className="text-red-500 hover:text-red-400" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="transition duration-300 transform hover:scale-110">
              <FaLinkedinIn size={28} className="text-blue-700 hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>
      

      <div className="mt-8 border-t border-gray-700 pt-4 flex items-center justify-center dark:text-white text-center text-sm">
      <div className='left-28 pt-8 absolute'><Logo /></div>
      
        <p className='pt-2'>&copy; 2025 RepoX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;