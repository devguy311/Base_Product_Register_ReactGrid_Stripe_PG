import React, { SyntheticEvent, useState } from "react";

import "./App.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ProductDescriptionPanel from "./components/ProductDescriptionPanel";
import LuminaPanel from "./components/LuminaPanel";
import VerticalLinearStepper from "./components/VerticalLinearStepper";

const a11yProps = (index: number) => {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
};

function App() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabIndex} onChange={handleChange} aria-label="basic product tabs">
                    <Tab label="商品説明テンプレ" {...a11yProps(0)} />
                    <Tab label="Lumina" {...a11yProps(1)} />
                    <Tab label="Vertical Stepper" {...a11yProps(2)} />
                </Tabs>
            </Box>
            {tabIndex === 0 && <ProductDescriptionPanel productName="にょ天狗" />}
            {tabIndex === 1 && <LuminaPanel />}
            {tabIndex === 2 && <VerticalLinearStepper />}
        </>
    );
}

export default App;
