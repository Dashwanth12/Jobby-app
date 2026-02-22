import { Component } from 'react'
import Cookies from 'js-cookie'
import {TailSpin} from 'react-loader-spinner'
import { BsSearch } from 'react-icons/bs'
import JobsFilterGroup from '../JobsFilterGroup'
import JobCard from '../JobCard'
import './index.css'

const employmentTypesList = [
    {
        label: 'Full Time',
        employmentTypeId: 'FULLTIME',
    },
    {
        label: 'Part Time',
        employmentTypeId: 'PARTTIME',
    },
    {
        label: 'Freelance',
        employmentTypeId: 'FREELANCE',
    },
    {
        label: 'Internship',
        employmentTypeId: 'INTERNSHIP',
    },
]

const salaryRangesList = [
    {
        salaryRangeId: '1000000',
        label: '10 LPA and above',
    },
    {
        salaryRangeId: '2000000',
        label: '20 LPA and above',
    },
    {
        salaryRangeId: '3000000',
        label: '30 LPA and above',
    },
    {
        salaryRangeId: '4000000',
        label: '40 LPA and above',
    },
]

const apiStatusConstants = {
    initial: 'INITIAL',
    in_progress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

class JobsProfile extends Component {
    state = {
        searchInput: '',
        jobsList: [],
        salaryRange: '',
        employmentType: [],
        apiStatus: apiStatusConstants.initial,
    }

    componentDidMount() {
        this.getJobDetails()
    }

    getJobDetails = async () => {
        const jwtToken = Cookies.get('jwt_token')
        const { searchInput, employmentType, salaryRange } = this.state

        this.setState({ apiStatus: apiStatusConstants.in_progress })

        const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options)
        console.log('Jobs API status:', response.status)

        if (response.ok) {
            const data = await response.json()
            const updatedData = data.jobs.map(each => ({
                companyLogoUrl: each.company_logo_url,
                employmentType: each.employment_type,
                id: each.id,
                jobDescription: each.job_description,
                location: each.location,
                packagePerAnnum: each.package_per_annum,
                rating: each.rating,
                title: each.title,
            }))
            this.setState({
                jobsList: updatedData,
                apiStatus: apiStatusConstants.success,
            })
        } else {
            this.setState({ apiStatus: apiStatusConstants.failure })
        }
    }
    onChangeSearchInput = event => {
        this.setState({ searchInput: event.target.value })
    }

    onKeyDown = event => {
        if (event.key === 'Enter') {
            this.getJobDetails()
        }
    }

    onChangeSalaryType = salary => {
        this.setState({ salaryRange: salary }, this.getJobDetails)
    }

    onChangeEmploymentType = type => {
        this.setState(
            prev => ({ employmentType: [...prev.employmentType, type] }),
            this.getJobDetails,
        )
    }

    renderLoadingView = () => {
        return (
            <div className="loader-card" data-testid="loader">
                <TailSpin color="whitesmoke" height={70} width={70} />
            </div>
        )
    }

    renderSuccessView = () => {
        const { jobsList, searchInput } = this.state
        const jobsDisplay = jobsList.length > 0

        return jobsDisplay ? (
            <div className="details-container">
                <div className="search-input">
                    <input
                        type="search"
                        className="search"
                        value={searchInput}
                        onChange={this.onChangeSearchInput}
                        onKeyDown={this.onKeyDown}
                    />

                </div>
                <ul className="jobs-list-items">
                    {jobsList.map(each => (
                        <JobCard key={each.id} jobDetails={each} />
                    ))}
                </ul>
            </div>
        ) : (
            <div className="no-jobs-container">
                <div className="search-input-content">
                    <input
                        type="search"
                        className="search"
                        placeholder="Search"
                        value={searchInput}
                        onChange={this.changeSearchInput}
                        onKeyDown={this.onKeyDown}
                    />
                </div>
                <img
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    alt="no jobs"
                    className="no-jobs"
                />
                <h1 className="no-jobs-heading">No Jobs Found</h1>
                <p className="no-jobs-desc">
                    We could not find any jobs. Try other filters.
                </p>
            </div>
        )
    }

    renderFailureView = () => {
        return (
            <div className="failure-card">
                <img
                    src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                    alt="failure view"
                    className="failure-img"
                />
                <h1 className="failure-title">
                    Oops! Something Went Wrong Please Try Again!
                </h1>
                <p>We can't reload the page</p>
                <div className="retry-btn">
                    <button type="button" className="retry">
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    renderView = () => {
        const { apiStatus } = this.state

        switch (apiStatus) {
            case apiStatusConstants.in_progress:
                return this.renderLoadingView()
            case apiStatusConstants.success:
                return this.renderSuccessView()
            case apiStatusConstants.failure:
                return this.renderFailureView()
        }
    }

    render() {
        return (
            <div className="job-details-container">
                <div className="render-items">
                    <JobsFilterGroup
                        employmentTypesList={employmentTypesList}
                        salaryRangesList={salaryRangesList}
                        onChangeEmploymentType={this.onChangeEmploymentType}
                        onChangeSalaryType={this.onChangeSalaryType}
                    />
                </div>
                <div className="reponsive-items">{this.renderView()}</div>
            </div>
        )
    }
}
export default JobsProfile
