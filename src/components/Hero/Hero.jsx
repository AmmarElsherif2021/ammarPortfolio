import './Hero.css'
import heroImg from '../../assets/ammar/hero2.gif'
const Hero = () => {
    return (

        <div className='hero'>

            <div >
                <img className='hero-img' src={heroImg} />
            </div>
            <div className='hero-text'>
                <h1>Hero text </h1>
                <div className="typewriter" style={{ animationDelay: "0s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "1.5s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "3s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "4.5s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "6s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "7.5s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "9s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "10.5s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "12s" }}>The purpose of using Lorem  Ipsum is that </div>
                <div className="typewriter" style={{ animationDelay: "13.5s" }}>words which dont look even slightly</div>
            </div>

        </div>

    )
}
export default Hero