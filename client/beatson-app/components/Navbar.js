import Link from'next/link';
import AppBar from '@mui/material/AppBar';
import Box from'@mui/material/Box';
import Toolbar from'@mui/material/Toolbar';
import Button from'@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {     
  return (       
    <div>
      <Box sx={{flexGrow:1}}>
        <AppBar position="static">
          <Toolbar className="page-header">   
          <ul className="list">
            <li>
              <Button color="inherit" startIcon={<HomeIcon/>}>                        
                  <Link href="/">
                    Home
                  </Link>                    
                </Button>  
            </li>

            <li>
              <Button color="inherit" startIcon={<SearchIcon/>}>                        
                <Link href="/discover_studies">
                  Discover Studies
                </Link>                     
              </Button> 
            </li>

            <li>
              <Button color="inherit" startIcon={<UploadIcon/>}>                        
                <Link href="/study_upload">
                  Upload a Study
                </Link>                     
              </Button> 
            </li>

            <li>
              <Button color="inherit" startIcon={<LoginIcon/>}>                        
                <Link href="/login">
                  Login
                </Link>                     
              </Button> 
            </li>
          </ul>
          </Toolbar>            
        </AppBar>        
      </Box>    
    </div>  
  );
};

export default Navbar;