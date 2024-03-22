import './Hero.css'
import heroImg from '../../assets/ammar/hero2.gif'
import { useState } from 'react';
const textArr = [`The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `,
    `The purpose of using Lorem  Ipsum is thaj bla `
];

const Hero = () => {

    return (

        <div className='hero'>

            <div >
                <img className='hero-img' src={heroImg} />
            </div>
            <div className='hero-text'>
                <div className="typewriter" style={{ animationDelay: 0 }}>
                    <h1>Hero text </h1>
                </div>


                {textArr.map((x, i) => {

                    return (
                        <div className="typewriter" style={{ animationDelay: `${(i * 2.5) + 2.5}s` }}> The purpose {i} of using Lorem  Ipsum is that bla
                        </div>
                    )
                })}
            </div>

        </div>

    )
}
export default Hero