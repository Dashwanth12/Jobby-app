import {Component} from 'react'
import './index.css'
import {NavLink} from 'react-router-dom'
import Header from '../Header'

class Home extends Component {
	render(){
		return(
            <>
            <Header />
			<div className="home">
				<div className="home-content">
					<h1 className="home-heading">Find The Job <br /> That Fits Your Life</h1>
					<p className="home-description">Millions of people are searching <br /> for jobs, salary information, <br /> company reviews, and interview questions. <br /> Find the job that fits your abilities and potential.</p>
					<NavLink to='/jobs'>
					<button type="button" className="home-button">Find Jobs</button>
					</NavLink>
				</div>
			</div>
            </>
		)
	}
}

export default Home
