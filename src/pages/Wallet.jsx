import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
export default function Wallet() {
    let saldo = 60000;
    const [coins, setCoins] = useState([]);
    const [amount, setAmount] = useState(saldo || 0)
    const [price, setPrice] = useState(0);
    const [satoshig, setSatoshig] = useState(0);
    const [satoshigToUSD, setSatoshigToUSD] = useState(0);
    const [current_price_btc, setCurrent_price_btc] = useState(0);
    const fetchApi = () => {
        axios
            .get(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
            )
            .then((res) => {
                //console.log(res.data);
                setCoins(res.data);
                setCurrent_price_btc(res.data[0].current_price)
                sessionStorage.setItem('price_btc', res.data[0].current_price)
                console.log('Peticion a api')
            })
            .catch((error) => {
                alert("Error en tu conexión");
            });
    };
    const handleSale = (e) => {
        e.preventDefault()
        if (price == 0) {
            swal('Error', 'Campo vacio!!', 'error')
            return 0;
        }
        if (price > amount) {
            swal('Error', 'No tienes suficiente saldo!!', 'error')
            return 0;
        } else {
            let conversionUSDToSatoshig = (price * 1) / current_price_btc;
            setSatoshig(satoshig + conversionUSDToSatoshig);
            setAmount(amount - price)
            //Muestra el valor en dolar en la conversion de satoshig a USD
            //console.log(satoshig)


        }

        setPrice(0)
    }

    const handleBay = () => {
        let usd = satoshig * current_price_btc;
        setAmount(amount + usd);
        setSatoshig(0);
        setSatoshigToUSD(0);
    }

    useEffect(() => {
        setInterval(() => {
            fetchApi();
            //Conversion de Satoshig a USD para mostrar al usuario
            setSatoshigToUSD(sessionStorage.getItem('satoshig') * sessionStorage.getItem('price_btc'))
        }, 10000)
    }, []);
    //Cap session satoshig conversation
    sessionStorage.setItem('satoshig', satoshig);

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    ws.onmessage = (e)=>{
        console.log(e.x)
    }

    if (!coins.length) { return <div className="alert alert-warning">Cargando...</div> }
    return (
        <div>
            <div className="container my-5">
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-dark">BTC:$ {coins[0].current_price.toLocaleString()}</h3>
                                <h4 className="text-muted">BTC A USD: {satoshig.toFixed(8)} a {satoshigToUSD.toFixed(2)}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-dark">USD:$ {amount.toLocaleString()}</h3>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="d-flex flex-column justify-content-center my-4">
                    <form onSubmit={handleSale} action="">
                        <input min="0.00" step="any" value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="form-control" />
                        <button type="submit" className="btn btn-info my-2">Convertir de USD a BTC</button>
                    </form>
                    <button onClick={handleBay} className="btn btn-success my-3">Convertir de BTC a USD</button>
                </div>
            </div>
        </div>
    )
}
