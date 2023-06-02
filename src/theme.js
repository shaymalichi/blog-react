import { createTheme } from '@mui/material/styles';
import {yellow} from '@mui/material/colors';

const theme = createTheme({
    status: {
        danger: yellow[500],
    },
});

export default theme;