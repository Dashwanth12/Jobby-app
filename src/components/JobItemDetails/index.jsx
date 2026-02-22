import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { AiFillStar } from 'react-icons/ai'
import { GoLocation } from 'react-icons/go'
import { BsBriefcaseFill } from 'react-icons/bs'
import { BiLinkExternal } from 'react-icons/bi'
import { TailSpin } from 'react-loader-spinner'
import { useParams } from 'react-router-dom'

import Header from '../Header'
import SkillsCard from '../skillsCard'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'INPROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

const getFormattedSkillData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    rating: data.rating,
    location: data.location,
    title: data.title,
})

const getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
        description: data.life_at_company.description,
        imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
    })),
})

const JobItemDetails = () => {
    const [jobItemList, setJobItemList] = useState({})
    const [similarJobItemList, setSimilarJobItemList] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const { id } = useParams()

    useEffect(() => {
        getJobItem()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const getJobItem = async () => {
        setApiStatus(apiStatusConstants.inProgress)

        const jwtToken = Cookies.get('jwt_token')
        const url = `https://apis.ccbp.in/jobs/${id}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options)
        if (response.ok === true) {
            const data = await response.json()
            const updatedData = getFormattedData(data.job_details)
            const updatedSkillData = data.similar_jobs.map(eachSimilarJob =>
                getFormattedSkillData(eachSimilarJob),
            )
            setJobItemList(updatedData)
            setSimilarJobItemList(updatedSkillData)
            setApiStatus(apiStatusConstants.success)
        } else {
            setApiStatus(apiStatusConstants.failure)
        }
    }

    const renderJobItemDetails = () => {
        const {
            companyLogoUrl,
            companyWebsiteUrl,
            employmentType,
            jobDescription,
            location,
            title,
            rating,
            packagePerAnnum,
            lifeAtCompany = {},
            skills = [],
        } = jobItemList
        const { description, imageUrl } = lifeAtCompany

        return (
            <div className="full-job-item-container">
                <div className="job-items-container">
                    <div className="logo-image-container">
                        <img
                            src={companyLogoUrl}
                            alt="job details company logo"
                            className="company-logo-justify"
                        />
                        <div className="title-container">
                            <h1 className="company-title-head">{title}</h1>
                            <div className="rating-container">
                                <AiFillStar className="star-icon" />
                                <p className="count-rating">{rating}</p>
                            </div>
                        </div>
                    </div>
                    <div className="location-type-salary-container">
                        <div className="location-container">
                            <div className="responsive">
                                <GoLocation className="location-logo" />
                                <p className="location-desc">{location}</p>
                            </div>
                            <div className="responsive">
                                <BsBriefcaseFill className="location-logo-brief" />
                                <p className="location-desc">{employmentType}</p>
                            </div>
                        </div>
                        <p className="package-desc">{packagePerAnnum}</p>
                    </div>
                    <hr className="line" />
                    <div className="description-container">
                        <h1 className="desc-heading">Description</h1>
                        <a className="visit-link" href={companyWebsiteUrl}>
                            Visit
                            <BiLinkExternal className="bi-link" />
                        </a>
                    </div>
                    <p className="job-story-desc">{jobDescription}</p>
                    <h1 className="skill-heading">Skills</h1>
                    <ul className="skill-container">
                        {skills.map(eachSkill => (
                            <SkillsCard
                                key={eachSkill.id || eachSkill.name}
                                skillDetails={eachSkill}
                            />
                        ))}
                    </ul>
                    <h1 className="life-company-heading">Life at company</h1>
                    <div className="life-at-company-container">
                        <p className="life-company-desc">{description}</p>
                        <img
                            src={imageUrl}
                            alt="life at company"
                            className="company-logo"
                        />
                    </div>
                </div>
                <h1 className="similar-job-heading">Similar Jobs</h1>
                <ul className="similar-cards">
                    {similarJobItemList.map(eachItem => (
                        <SimilarJobItem key={eachItem.id} jobDetails={eachItem} />
                    ))}
                </ul>
            </div>
        )
    }

    const renderFailureView = () => (
        <div className="render-loading-view">
            <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
                className="failure-view"
            />
            <h1 className="failure-heading">Oops! Something Went Wrong </h1>
            <p className="failure-desc">
                We cannot seem to find the page you are looking for
            </p>
            <button
                type="button"
                testid="button"
                className="job-item-failure-button"
                onClick={getJobItem}
            >
                Retry
            </button>
        </div>
    )

    const renderLoadingView = () => (
        <div className="profile-loader-container" testid="loader">
            <TailSpin color="#ffffff" height={50} width={50} />
        </div>
    )

    const renderJobViews = () => {
        switch (apiStatus) {
            case apiStatusConstants.success:
                return renderJobItemDetails()
            case apiStatusConstants.inProgress:
                return renderLoadingView()
            case apiStatusConstants.failure:
                return renderFailureView()
            default:
                return null
        }
    }

    return (
        <>
            <Header />
            <div className="get-products-details-container">{renderJobViews()}</div>
        </>
    )
}

export default JobItemDetails