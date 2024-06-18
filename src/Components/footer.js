"use client";

import { Footer } from "flowbite-react";
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

export default function footer() {
  return (
    <Footer container className="justify-between items-start">
        <Footer.Copyright className="text-xl font-semibold dark:text-white" href="#" by="ADS TECH™" year={2024} />
        <div className="inline-flex space-x-3">
          <Footer.Icon href="#" icon={BsFacebook} />
          <div className="w-6"></div>
          <Footer.Icon href="https://www.instagram.com/ads_tech_2024?utm_source=qr&igsh=YWU0Zm9wZDh4cjN5" target="_blank" icon={BsInstagram} />
          <div className="w-6"></div>
          <Footer.Icon href="#" icon={BsTwitter} />
          <div className="w-6"></div>
          <Footer.Icon href="#" icon={BsGithub} />
        </div>
    </Footer>
  );
}
