import { Component } from 'react'
import Cookies from 'js-cookie'
import { TailSpin } from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    loading: 'LOADING',
}

class Profile extends Component {
    state = {
        profileData: {},
        apiStatus: apiStatusConstants.initial,
    }

    componentDidMount() {
        this.getProfileInfo()
    }

    getProfileInfo = async () => {
        this.setState({ apiStatus: apiStatusConstants.loading })

        const jwtToken = Cookies.get('jwt_token')

        const response = await fetch('https://apis.ccbp.in/profile', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        })

        if (response.ok === true) {
            const data = await response.json()

            const updatedData = {
                name: data.profile_details.name,
                profileImageUrl: data.profile_details.profile_image_url,
                shortBio: data.profile_details.short_bio,
            }

            this.setState({
                profileData: updatedData,
                apiStatus: apiStatusConstants.success,
            })
        } else {
            this.setState({ apiStatus: apiStatusConstants.failure })
        }
    }

    renderProfileSuccess = () => {
        const { profileData } = this.state
        const { name, profileImageUrl, shortBio } = profileData

        return (
            <div className="profile-card">
                <img
                    src={profileImageUrl}
                    alt="profile"
                    className="profile-pic"
                />
                <h1 className="profile-name">{name}</h1>
                <p className="bio">{shortBio}</p>
            </div>
        )
    }

    renderLoading = () => (
        <div className="profile-card loading-view">
            <TailSpin color="#00BFFF" height={50} width={50} />
        </div>
    )

    renderFailure = () => (
        <div className="profile-card failure-view">
            <button
                type="button"
                className="retry-btn"
                onClick={this.getProfileInfo}
            >
                Retry
            </button>
        </div>
    )

    renderProfile = () => {
        const { apiStatus } = this.state

        switch (apiStatus) {
            case apiStatusConstants.success:
                return this.renderProfileSuccess()
            case apiStatusConstants.loading:
                return this.renderLoading()
            case apiStatusConstants.failure:
                return this.renderFailure()
            default:
                return null
        }
    }

    render() {
        return this.renderProfile()
    }
}

export default Profile
