import Link from'next/link';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
} from "@mui/material";
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
              <Button color="inherit" size="large" startIcon={<HomeIcon/>}>                        
                  <Link href="/">
                    Home
                  </Link>                    
                </Button>  
            </li>

            <li>
              <Button color="inherit" size="large" startIcon={<SearchIcon/>}>                        
                <Link href="/discover_studies">
                  Discover Studies
                </Link>                     
              </Button> 
            </li>

            <li>
              <Button color="inherit" size="large" startIcon={<UploadIcon/>}>                        
                <Link href="/study_upload">
                  Upload a Study
                </Link>                     
              </Button> 
            </li>

            <li>
              <Button color="inherit" size="large" startIcon={<LoginIcon/>}>                        
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