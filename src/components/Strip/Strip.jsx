import './Strip.css'
import Bubble from '../Bubble/Bubble'
import { useState, useEffect } from 'react';
const Strip = (props) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollLeft = () => {
        setScrollPosition(scrollPosition - 300);
    };

    const scrollRight = () => {
        setScrollPosition(scrollPosition + 300);
    };

    useEffect(() => {
        const parent = document.querySelector('.strip-rail');
        if (parent) {
            parent.scrollLeft = scrollPosition;
        }
    }, [scrollPosition]);
    return (
        <div className='strip'>
            <button onClick={scrollLeft}>{'<'}</button>
            <div className='strip-rail'>
                {props.libsList.map((x) => (
                    <div><Bubble img={x.img} stat={x.stat} /></div>

                ))}
            </div>
            <button onClick={scrollRight}>{'>'}</button>
        </div>




    )
}
export default Strip