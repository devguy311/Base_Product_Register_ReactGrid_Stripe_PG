import { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

import DynamicTable from "./common/dynamic-table";
import { LoadingStatus } from "./common/LoadingStatus.d";
import { ProductKeyword } from "./common/dynamic-table/components/ProductKeyword";

const LuminaPanel = () => {
    const [data, setData] = useState<ProductKeyword[]>([]);
    const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LOADING);

    useEffect(() => {
        axios.get("/descriptions").then((response) => {
            setData(() => [
                ...(response.data.descriptions as any[]).map((t) => {
                    const values = Object.values<string>(t);
                    return { header: values[0], keywords: values[1].split(",") };
                }),
            ]);
            setLoadingStatus(LoadingStatus.LOADED);
        });
    }, []);

    return (
        <>
            {loadingStatus === LoadingStatus.LOADING && <CircularProgress />}
            {loadingStatus === LoadingStatus.LOADED && <DynamicTable source={data} />}
        </>
    );
};

export default LuminaPanel;
