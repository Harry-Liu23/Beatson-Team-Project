import React from "react"; 
import Link from 'next/link';

const Navbar = () => {   
    return (     
        <div className='page-header'>    
            <ul className='list'>         
                <li>           
                    <Link href="/">Home</Link>         
                </li>         
                <li>           
                    <Link href="/login">Login</Link>         
                </li>            
                <li>
                    <Link href="/upload">Upload</Link> 
                </li>
                <li>
                    <Link href="/test">Test Upload</Link> 
                </li>
            </ul>     
        </div>     
    ); 
} 
export default Navbar;