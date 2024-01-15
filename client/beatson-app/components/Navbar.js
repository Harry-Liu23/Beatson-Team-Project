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
                    <Link href="/upload-menu">Menu Upload</Link>        
                </li>             
                <li>
                    <Link href="/upload-checkbox">Checkbox Upload</Link> 
                </li>
            </ul>     
        </div>     
    ); 
} 
export default Navbar;