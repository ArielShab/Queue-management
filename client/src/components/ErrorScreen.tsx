import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ErrorScrean({ error }: { error: string }) {
  const navigate = useNavigate();

  return (
    <Box mt={4}>
      <Typography component="h1" variant="h1">
        Error: {error}
      </Typography>
      <Button onClick={() => navigate('/')}>Home</Button>
    </Box>
  );
}

export default ErrorScrean;
