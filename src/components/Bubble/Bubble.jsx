import './Bubble.css';
const Bubble=(props)=>{
    return(
        <div className='bubble'>
            <div className='badge'><p>{props.stat}</p></div>
            <img className='bubble-img' src={props.img}/>
        </div>
    )
}
export default Bubble