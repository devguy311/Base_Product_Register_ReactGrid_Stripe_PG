import { useState } from "react";
import DynamicTable from "./common/dynamic-table";
import { ProductKeyword } from "./common/dynamic-table/components/ProductKeyword";

const LuminaPanel = () => {
    const [data, setData] = useState<ProductKeyword[]>([]);

    return <DynamicTable source={data} />;
};

export default LuminaPanel;
