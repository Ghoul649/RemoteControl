import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ConnectionMode } from "../types/connectionMode";

export interface ConnectionModeSelectorProps {
    onModeSelected?: (connectionMode: ConnectionMode) => void
}

const modeDescriptions = [
    {
        id: ConnectionMode.Direct,
        name: "Direct",
        description: "Directly connect to the device via COM-Port and Video receiver"
    },
    {
        id: ConnectionMode.Remote,
        name: "Remote",
        description: "Connect to the intermediate server"
    }
];


export function ConnectionModeSelector({ onModeSelected }: ConnectionModeSelectorProps){

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems:"center",
            height: "100vh",
            flexWrap: "wrap",
            columnGap: '32px'
        }}>
            {modeDescriptions.map((item) => (
                <Card key={item.id}>
                    <CardActionArea onClick={() => onModeSelected?.(item.id)}>
                        <CardContent sx={{ 
                            width: 300, 
                            height: 120
                        }}>
                            <Typography variant="h5" component="div" align="center">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" align="center">
                                {item.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}