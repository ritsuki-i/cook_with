import React from 'react'
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css';

function HomeSwiper() {
    return (
        <div className='HomeSwiper'>
            <Splide
                aria-label="私のお気に入りの画像集"
                options={{
                    type: "loop",
                    autoplay: true, // 自動再生を有効
                    interval: 3000, // 自動再生の間隔を3秒に設定
                    pauseOnHover: false, //マウスのホバー時停止
                    speed: 2000, // スライドの変化スピード
                }}
            >
                <SplideSlide>
                    <img className="slide-img" src="./img/ex1.jpg" alt=''/>
                </SplideSlide>
                <SplideSlide>
                    <img className="slide-img" src="./img/ex2.jpg" alt=''/>
                </SplideSlide>
                <SplideSlide>
                    <img className="slide-img" src="./img/ex3.jpg" alt=''/>
                </SplideSlide>
                <SplideSlide>
                    <img className="slide-img" src="./img/ex4.jpg" alt=''/>
                </SplideSlide>
            </Splide>

            <style jsx>{`
                .slide-img {
                    display: block;
                    width: 100vw;
                    height: 100vh;
                    object-fit: cover;
                }
            `}</style>
        </div>
    )
}

export default HomeSwiper