import './index.css'
import Header from '../Header'
import JobsProfile from '../JobsProfile'

const Jobs = () => {
    return (
        <>
            <Header />
            <div className="job-profile-container">
                <JobsProfile />
            </div>
        </>
    )
}

export default Jobs
