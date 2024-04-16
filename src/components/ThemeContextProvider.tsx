import React, { useMemo, useState } from 'react';
import { CssBaseline, PaletteMode, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';

export const ColorModeContext = React.createContext({ 
    colorMode: "light" as PaletteMode,
    toggleColorMode: () => {} 
});

export function ThemeContextProvider({children}: {children?: React.ReactNode}) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [colorMode, setColorMode] = useState<PaletteMode>(prefersDarkMode ? 'dark' : 'light');

    const theme = useMemo(() => createTheme({
        palette: { mode: colorMode }
    }), [colorMode]);

    const colorModeContext: typeof ColorModeContext extends React.Context<infer T> ? T : never = useMemo(() => ({
        colorMode,
        toggleColorMode: () => setColorMode(colorMode === 'light' ? 'dark' : 'light')
    }), [colorMode, setColorMode]);

    return (
        <ThemeProvider theme={theme}>  
            <ColorModeContext.Provider value={colorModeContext}>
                <CssBaseline />
                {children}
            </ColorModeContext.Provider>
        </ThemeProvider>
    );
}