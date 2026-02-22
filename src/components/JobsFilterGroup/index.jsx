import UserProfile from '../UserProfile'
import './index.css'

const JobsFilterGroup = props => {
    const {
        employmentTypesList,
        salaryRangesList,
        onChangeEmploymentType,
        onChangeSalaryType,
    } = props

    const renderEmployementTypes = () => {
        return (
            <div className="salary-container">
                <h1 className="fliter-heading">Types of Employment</h1>

                <ul className="boxes-card">
                    {employmentTypesList.map(each => (
                        <li className="items" key={each.employmentTypeId}>
                            <input
                                type="checkbox"
                                className="check-radio"
                                id={each.employmentTypeId}
                                value={each.employmentTypeId}
                                onChange={event => onChangeEmploymentType(event.target.value)}
                            />
                            <label htmlFor={each.employmentTypeId} className="check-label">
                                {each.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const renderSalaryTypes = () => {
        return (
            <div className="salary-container">
                <h1 className="fliter-heading">Salary Range</h1>
                <ul className="salary-card">
                    {salaryRangesList.map(each => (
                        <li className="items" key={each.salaryRangeId}>
                            <input
                                type="radio"
                                className="check-radio"
                                id={each.salaryRangeId}
                                name="salary"
                                onChange={event => onChangeSalaryType(event.target.value)}
                            />
                            <label htmlFor={each.salaryRangeId} className="check-label">
                                {each.label}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="filter-group">
            <UserProfile />
            <hr className="line" />
            {renderEmployementTypes()}
            <hr className="line" />
            {renderSalaryTypes()}
        </div>
    )
}
export default JobsFilterGroup
