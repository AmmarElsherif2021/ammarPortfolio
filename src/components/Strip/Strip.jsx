import './Strip.css';
import Bubble from '../Bubble/Bubble';
import { useState, useEffect, useRef } from 'react';

const Strip = (props) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollInterval = useRef(null);

    const startScrolling = (direction) => {
        stopScrolling(); // Clear any existing intervals
        scrollInterval.current = setInterval(() => {
            setScrollPosition((prevPosition) => prevPosition + direction * 100); // Adjust the value for speed
        }, 50); // Adjust the interval for speed
    };

    const stopScrolling = () => {
        clearInterval(scrollInterval.current);
    };

    useEffect(() => {
        const parent = document.querySelector('.strip-rail');
        if (parent) {
            parent.scrollLeft = scrollPosition;
        }
    }, [scrollPosition]);

    useEffect(() => {
        // Clean up the interval on component unmount
        return () => stopScrolling();
    }, []);

    return (
        <div className='strip'>
            <button
                onPointerOver={() => startScrolling(-1)}
                onPointerOut={stopScrolling}
            >
                {'<'}
            </button>
            <div className='strip-rail'>
                {props.libsList.map((x, index) => (
                    <Bubble key={index} img={x.img} stat={x.stat} />
                ))}
            </div>
            <button
                onPointerOver={() => startScrolling(1)}
                onPointerOut={stopScrolling}
            >
                {'>'}
            </button>
        </div>
    );
};

export default Strip;
