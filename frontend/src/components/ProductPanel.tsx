import { useEffect, useState } from "react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";

import ProductTable, { ProductKeyword } from "./product-table/index.d";
import { LoadingStatus } from "../types/index.d";

const ProductPanel = (props: any) => {
    const [data, setData] = useState<ProductKeyword[]>([]);
    const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.LOADING);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/descriptions`, { params: { email: props.email } }).then((response) => {
            setData(response.data.descriptions);
            setLoadingStatus(LoadingStatus.LOADED);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {loadingStatus === LoadingStatus.LOADING && <LinearProgress />}
            {loadingStatus === LoadingStatus.LOADED && <ProductTable source={data} email={props.email} />}
        </>
    );
};

export default ProductPanel;
