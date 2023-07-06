import { createTheme } from '@mui/material/styles';
import {red, yellow} from '@mui/material/colors';





const theme = (color = yellow) => createTheme({

    palette: {

        primary: {
            main : color.A400
        },
        secondary :{
            main:yellow.A700
        },error:{
            main:red.A400
        }

    },
});

export default theme;