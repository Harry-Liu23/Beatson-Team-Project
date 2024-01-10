import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';


const Navbar = () => {   
    return (     
        <Box >
            <AppBar position="static">
                <Toolbar className="page-header">
                    <Button color="inherit">
                        <Link href="/">Home</Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/login">Login</Link> 
                    </Button>
                </Toolbar>
            </AppBar>
        </Box> 
    ); 
} 
export default Navbar;