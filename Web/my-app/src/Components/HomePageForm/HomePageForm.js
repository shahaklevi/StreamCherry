import {  Link } from 'react-router-dom';
import { useState } from 'react';
import NetflixLogo from '../NetflixLogo/NetflixLogo';

function HomePageForm() {
    const [email, setEmail] = useState("");
    return (
        <div>
            <div className="homepage">
            <div className="overlay">
                <NetflixLogo/>
                <div className="container">
                    <h1>Welcome To StreamCherry</h1>
                    <p>Ready to watch? Enter your email to create an Account</p>
                    <div className="form">
                        <input type="email" placeholder="Email address" className="email-input" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                        <Link to="/SignUp"
                        state = {{email}}>
                        <button className="button">Get Started</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div>
                <Link to="/login">
                    <button type="button" className="btn btn-signin" style={{ color: 'white' }}>Sign in</button>
                </Link>
            </div>

        </div>
        </div>

    )
}
export default HomePageForm;


