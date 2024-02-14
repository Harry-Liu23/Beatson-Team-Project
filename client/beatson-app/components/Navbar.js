import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="page-header">
      <ul className="list">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/discover_studies">Discover Studies</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        {/* <li>
          <Link href="/upload">Upload</Link>
        </li> */}
        <li>
          <Link href="/study_upload">Study Upload</Link>
        </li>
      </ul>
    </div>
  );
};
export default Navbar;
