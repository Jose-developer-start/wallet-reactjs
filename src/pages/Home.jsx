import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Coin from '../Coin';

export default function Home() {
    const [coins, setCoins] = useState([]);
    const [search, setSearch] = useState("");
    const fetchApi = () => {
        axios
            .get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
            )
            .then((res) => {
                //console.log(res.data);
                setCoins(res.data);
                console.log('Peticion a api')
            })
            .catch((error) => {
                alert("Error en tu conexión");
            });
    };

    useEffect(() => {
        setInterval(() => {
            fetchApi();
        }, 6000)
    }, []);
    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredCoins = coins.filter((coin) => {
        return coin.name.toLowerCase().includes(search.toLowerCase());
    });
    return (
        <div className="coin-app">
            <div className="coin-search">
                <h1 className="coin-text">Buscar</h1>
                <form>
                    <input
                        onChange={handleChange}
                        type="text"
                        placeholder="Search"
                        className="coin-input"
                    />
                </form>
            </div>
            {filteredCoins.map((coin) => (
                <Coin
                    key={coin.id}
                    name={coin.name}
                    image={coin.image}
                    symbol={coin.symbol}
                    volume={coin.market_cap}
                    price={coin.current_price}
                    priceChange={coin.price_change_percentage_24h}
                    marketcap={coin.market_cap}
                />
            ))}
        </div>
    )
}
