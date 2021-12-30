import axios from 'axios';
import "./Wallet.css"
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
    const [time,setTime] = useState(1);
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
        if (price === 0) {
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
            //Conversion de Satoshig a USD para mostrar al usuario
            setSatoshigToUSD(sessionStorage.getItem('satoshig') * sessionStorage.getItem('price_btc'))
        }, 1000);

    }, []);
    //Cap session satoshig conversation
    sessionStorage.setItem('satoshig', satoshig);

    setTimeout(()=>{
        if(time < 60){
            setTime( time + 1)
        }else{
            fetchApi();
            setTime(1);
        }
    },1000)

    if (!coins.length) { return <div className="alert alert-warning">Cargando...</div> }
    return (

        <div>
            <div className="container">
                <h1 className="text-center wallet__title my-4">Convertir</h1>
                <span className="text-center wallet__content">Disponible ${amount.toLocaleString()} USD</span>
                <form onSubmit={handleSale} action="">
                    <div className="form__input d-flex justify-content-center align-items-center">
                        <span className="form__title-USD">USD</span>
                        <input min="0.00" step="any" placeholder="$0.00" value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="form-control form__usd" />
                    </div>
                    <button type="submit" className="btn btn-info my-4 btn-block">Convertir de USD a BTC</button>
                </form>
                <div className="text-center wallet__price_btc">1 BTS equivale aprox.${coins[0].current_price.toLocaleString()}</div>
                <hr />
                <span className="text-center wallet__content"><i className="uil uil-clock clock__icon"></i>: {time}s</span>
                <span className="text-center wallet__content">Quiero recibir</span>
                <div className="form__input d-flex justify-content-center align-items-center">
                    <span className="form__title-BTC">BTC</span>
                    <div className="form-control form__usd satoshig">
                        {satoshig.toFixed(8)}
                    </div>
                </div>
                <span className="wallet__content">Equivale a ${satoshigToUSD.toFixed(2)} USD</span>
                <div className="d-flex flex-column justify-content-center my-4">

                    <button onClick={handleBay} className="btn btn-success my-3">Convertir de BTC a USD</button>
                </div>

            </div>
        </div>
    )
}
