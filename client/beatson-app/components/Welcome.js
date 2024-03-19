import {
    Grid,
    Card,
  } from "@mui/material";

const Welcome = () => {
    return (
        <div className='page-content'>
            <Card variant="outlined" sx={{ padding:10 }} > 
                <Grid
                    container
                    rowGap={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                >
                    <Grid item xs={6}>
                        Welcome to the MOSAIC Data Portal
                    </Grid>
                    <Grid item xs={6}>
                        <img src='/ukri-logo.png' alt='UKRI Logo' />
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
  };

export default Welcome;