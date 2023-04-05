import axios from "axios";
import {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';

const BotPage = () => {
    const {id} = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/invite/${id}`).then((response) => {
            if (response.data.status === 'okay'){}
        })
    }, []);
}

export default BotPage;