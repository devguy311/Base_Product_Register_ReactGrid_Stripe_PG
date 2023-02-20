import React from "react";

import "./App.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ApparelPanel from "./components/ApparelPanel";
import ShoesPanel from "./components/ShoesPanel";
import BagWalletPanel from "./components/BagWalletPanel";
import DressPanel from "./components/DressPanel";
import SwimsuitPanel from "./components/SwimsuitPanel";
import ProductDescriptionPanel from "./components/ProductDescriptionPanel";
import LuminaPanel from "./components/LuminaPanel";

const a11yProps = (index: number) => {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
};

function App() {
    const [tabIndex, setTabIndex] = React.useState(6);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabIndex} onChange={handleChange} aria-label="basic product tabs">
                    <Tab label="商品説明テンプレ" {...a11yProps(0)} />
                    <Tab label="アパレル" {...a11yProps(1)} />
                    <Tab label="シューズ" {...a11yProps(2)} />
                    <Tab label="バッグ・財布" {...a11yProps(3)} />
                    <Tab label="ドレス" {...a11yProps(4)} />
                    <Tab label="水着" {...a11yProps(5)} />
                    <Tab label="Lumina" {...a11yProps(6)} />
                </Tabs>
            </Box>
            {tabIndex === 0 && <ProductDescriptionPanel productName="にょ天狗" />}
            {tabIndex === 1 && <ApparelPanel />}
            {tabIndex === 2 && <ShoesPanel />}
            {tabIndex === 3 && <BagWalletPanel />}
            {tabIndex === 4 && <DressPanel />}
            {tabIndex === 5 && <SwimsuitPanel />}
            {tabIndex === 6 && <LuminaPanel />}
        </>
    );
}

export default App;
